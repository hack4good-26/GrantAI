# Supabase Database Schema Documentation

This document provides complete documentation of the database schema for the **Grant Intent Advisor** platform, including tables, functions, indexes, and data relationships.

---

## Overview

The database uses **PostgreSQL** with the **pgvector** extension for semantic search capabilities. The architecture supports:

- **Vector similarity search** for semantic grant matching
- **AI-powered grant analysis** with intent profiles
- **Search history tracking** with result persistence
- **Efficient querying** with proper indexes

**Key Technologies:**
- PostgreSQL 15+ (Supabase managed)
- pgvector extension (vector embeddings)
- Google Gemini API (embeddings via text-embedding-004 model)
- 3072-dimension vectors for semantic search

---

## Table of Contents

1. [Database Setup](#database-setup)
2. [Tables](#tables)
   - [grants_vectors](#grants_vectors)
   - [results](#results)
   - [grant_intent_profiles](#grant_intent_profiles-planned)
   - [conversation_history](#conversation_history-planned)
3. [Database Functions](#database-functions)
4. [Indexes](#indexes)
5. [Data Relationships](#data-relationships)
6. [Common Queries](#common-queries)
7. [Migration Guide](#migration-guide)

---

## Database Setup

### Prerequisites

1. Create a Supabase project at https://supabase.com
2. Enable the pgvector extension
3. Set up environment variables (see below)

### Enable pgvector Extension

```sql
-- Run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

### Environment Variables

**For local development** (`.env.local` - NEVER commit this file):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**For server-side API routes** (Vercel Environment Variables):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
CRON_SECRET=your-cron-secret
```

⚠️ **SECURITY WARNING**: Never commit service role keys or API keys to version control. Always use environment variables and Vercel's secret management.

---

## Tables

### `grants_vectors`

Primary table storing all grant information with vector embeddings for semantic search.

**Purpose**: Core grant data populated by scraper, supports both standard queries and vector similarity search.

#### Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | NOT NULL | Primary key, unique identifier for each grant |
| `title` | TEXT | NOT NULL | Grant name/title with proper casing |
| `description` | TEXT | NOT NULL | Short 1-2 sentence summary of the grant |
| `embedding` | VECTOR(3072) | NOT NULL | Vector embedding for semantic search (Gemini text-embedding-004) |
| `grant_url` | TEXT | NULL | Direct URL to official grant page |
| `about_grant` | TEXT | NULL | Detailed overview of grant goals and requirements |
| `full_description` | TEXT | NULL | Complete text extracted from source page |
| `who_can_apply` | TEXT | NULL | Eligibility criteria (age, citizenship, org type) |
| `funding_info` | TEXT | NULL | Funding amount, caps, percentage of project costs |
| `application_status` | TEXT | NULL | Current status (e.g., "Open for Applications") |
| `how_to_apply` | TEXT | NULL | Step-by-step application instructions |
| `when_can_apply` | TEXT | NULL | Deadlines and timeline requirements |
| `documents_required` | TEXT | NULL | JSON string: `{text, items[], links[]}` |
| `links` | TEXT[] | NULL | Array of URLs to downloadable forms (.docx, .xlsx, .pdf) |
| `metadata` | JSONB | NULL | Raw scraper data (original page title, URL, nested fields) |

#### Example Record

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "SG Enable Capability Fund",
  "description": "Provides funding for welfare organisations to build capabilities and improve service delivery for persons with disabilities.",
  "embedding": [0.012, -0.034, 0.056, ...], // 3072 dimensions
  "grant_url": "https://www.ncss.gov.sg/grants/capability-fund",
  "about_grant": "The Capability Fund supports VWOs in building organisational capabilities...",
  "who_can_apply": "Registered charities or IPC-registered organisations serving persons with disabilities",
  "funding_info": "Up to $50,000 per project, max 80% of total costs",
  "application_status": "Open for Applications",
  "how_to_apply": "Submit online application form with project proposal and budget breakdown",
  "when_can_apply": "Applications accepted year-round, review takes 8-10 weeks",
  "documents_required": "{\"text\": \"Required:\", \"items\": [\"Project proposal\", \"Budget breakdown\"], \"links\": []}",
  "links": ["https://example.com/application-form.docx"],
  "metadata": {"source": "NCSS", "scraped_at": "2026-01-15"},
}
```

#### TypeScript Interface

```typescript
export interface Grant {
  id: string;  // UUID
  title: string;
  description: string;
  embedding?: number[];  // Not typically used in frontend
  grant_url: string | null;
  about_grant: string | null;
  full_description: string | null;
  who_can_apply: string | null;
  funding_info: string | null;
  application_status: string | null;
  how_to_apply: string | null;
  when_can_apply: string | null;
  documents_required: string | null;  // JSON string
  links: string[];
  metadata?: any;  // JSONB
}
```

#### Important Notes

- **Text formatting preserved**: Most fields are `TEXT` to maintain original formatting (bullet points, newlines)
- **Embedding dimensions**: Must be exactly 3072 to match Gemini text-embedding-004 model
- **Vector search**: Use `match_grants()` function (see [Database Functions](#database-functions))
- **documents_required parsing**: Frontend should parse JSON string to extract items and links

---

### `results`

Stores user search queries and AI-generated grant recommendations.

**Purpose**: Tracks search history, persists match results for revisiting, enables analytics.

#### Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | NOT NULL | Primary key, used in URLs (`/results/[id]`) |
| `title` | TEXT | NULL | Optional user-provided title for the search |
| `description` | TEXT | NOT NULL | User's service idea description (used for embedding) |
| `estimated_cost` | INTEGER | NULL | Estimated project cost in dollars |
| `timeline_months` | INTEGER | NULL | Expected project duration in months |
| `target_beneficiaries` | TEXT | NULL | Description of intended beneficiaries |
| `expected_outcomes` | TEXT | NULL | Expected impact/outcomes of the project |
| `recommended_grants` | JSONB | NOT NULL | Array of `RecommendedGrant` objects (see below) |
| `created_at` | TIMESTAMPTZ | NOT NULL | Search timestamp (used for history sorting) |
| `updated_at` | TIMESTAMPTZ | NULL | Last update timestamp |

#### `recommended_grants` JSONB Structure

Each item in the `recommended_grants` array contains:

```typescript
{
  grant_id: string,              // UUID of matched grant
  similarity_score: number,      // Vector search score (0-1, from cosine similarity)
  match_score: number,           // LLM-generated score (0-100)
  match_reasoning: string,       // 2-3 sentence explanation
  why_fits: string[],            // Array of positive alignment reasons
  concerns: string[],            // Array of potential concerns/issues
  decision_recommendation: 'APPLY' | 'WATCH' | 'SKIP',
  win_probability: number        // 0.0-1.0 estimate of application success
}
```

#### Example Record

```json
{
  "id": "789e0123-e89b-12d3-a456-426614174999",
  "title": "Youth Mental Health Support Program",
  "description": "A community-based mental health support program for teenagers aged 13-18, providing counseling and peer support groups.",
  "estimated_cost": 75000,
  "timeline_months": 12,
  "target_beneficiaries": "At-risk youth in underserved communities",
  "expected_outcomes": "Improved mental health outcomes and reduced crisis interventions",
  "recommended_grants": [
    {
      "grant_id": "123e4567-e89b-12d3-a456-426614174000",
      "similarity_score": 0.87,
      "match_score": 92,
      "match_reasoning": "This grant strongly aligns with your youth-focused mental health initiative. The funding amount matches your budget, and the eligibility criteria fit your organization type.",
      "why_fits": [
        "Explicitly targets youth mental health programs",
        "Budget range ($50K-$100K) matches your $75K request",
        "Accepts applications from community organizations"
      ],
      "concerns": [
        "Requires 2 years of prior experience in mental health services",
        "Prefers programs with established partnerships with schools"
      ],
      "decision_recommendation": "APPLY",
      "win_probability": 0.75
    }
  ],
  "created_at": "2026-01-15T14:22:00Z",
  "updated_at": null
}
```

#### TypeScript Interfaces

```typescript
export interface QueryResult {
  id: string;  // UUID
  title: string | null;
  description: string;
  estimated_cost: number | null;
  timeline_months: number | null;
  target_beneficiaries: string | null;
  expected_outcomes: string | null;
  recommended_grants: RecommendedGrant[];
  created_at: string;
  updated_at: string | null;
}

export interface RecommendedGrant {
  grant_id: string;  // UUID
  similarity_score: number;  // 0-1 from vector search
  match_score: number;  // 0-100 from LLM
  match_reasoning: string;
  why_fits: string[];
  concerns: string[];
  decision_recommendation: 'APPLY' | 'WATCH' | 'SKIP';
  win_probability: number;  // 0.0-1.0
  grant?: Grant;  // Populated on frontend
}
```

#### Important Notes

- **JSONB for flexibility**: `recommended_grants` uses JSONB to store variable-length arrays without schema changes
- **No foreign key to grants**: Uses UUID references but no FK constraint (grants can be deleted without breaking history)
- **Idempotent searches**: Each search creates a new result record (no deduplication)
- **History display**: Results ordered by `created_at DESC` on `/history` page

---

### `grant_intent_profiles` (Planned)

Stores AI-analyzed "intent" for each grant to enable nuanced matching beyond keywords.

**Status**: Schema defined in `src/lib/types.ts` but not yet implemented in database.

**Purpose**: Deep analysis of grant requirements, values, and ideal applicants to improve match quality.

#### Planned Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `grant_id` | UUID | Foreign key to `grants_vectors.id` |
| `primary_intent` | TEXT | Main goal/purpose of the grant |
| `focus_areas` | TEXT[] | Key topics (e.g., "education", "health", "environment") |
| `philosophical_stance` | JSONB | Values, priorities, approach |
| `ideal_applicant` | JSONB | Org type, size, experience level, characteristics |
| `kpi_nature` | JSONB | KPI type, flexibility, expectations |
| `realistic_project` | JSONB | Scope, timeline, budget range, examples |
| `potential_concerns` | TEXT[] | Common rejection reasons |
| `application_tips` | TEXT[] | Advice for stronger applications |
| `confidence_score` | FLOAT | AI confidence in analysis (0-1) |
| `created_at` | TIMESTAMPTZ | Analysis timestamp |
| `updated_at` | TIMESTAMPTZ | Last re-analysis timestamp |

**Note**: When implementing, create this table and populate via weekly cron job analyzing grants with Gemini.

---

### `conversation_history` (Planned)

Stores AI chat history for the Grant Explainer feature.

**Status**: Not yet implemented, currently mocked in frontend.

**Purpose**: Persist Q&A conversations about specific grants for continuity and analytics.

#### Planned Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `grant_id` | UUID | Foreign key to `grants_vectors.id` |
| `user_id` | UUID | Foreign key to `auth.users` (when auth is added) |
| `session_id` | UUID | Groups messages in same conversation |
| `role` | TEXT | 'user' or 'assistant' |
| `message` | TEXT | Question or answer content |
| `created_at` | TIMESTAMPTZ | Message timestamp |

**Note**: When implementing, update `/api/grants/[id]/explain` to save/retrieve history.

---

## Database Functions

### `match_grants` - Vector Similarity Search

Performs semantic search to find grants matching a query embedding.

#### Function Definition

```sql
CREATE OR REPLACE FUNCTION match_grants(
  query_embedding vector(3072),
  match_count int
)
RETURNS TABLE (
  id uuid,
  distance float
)
LANGUAGE sql
AS $$
  SELECT
    id,
    embedding <=> query_embedding AS distance
  FROM grants_vectors
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

#### Parameters

- **`query_embedding`** (vector(3072)) - Embedding vector for user's search query
  - Generated using Google Gemini text-embedding-004 model
  - Must be exactly 3072 dimensions
  - Created via `/lib/embeddings.ts` helper

- **`match_count`** (int) - Number of top matches to return
  - Typically 10 for initial retrieval (K_VALUE constant)
  - Results are then filtered by LLM to 4-6 best matches

#### Returns

- **`id`** (uuid) - Grant ID from `grants_vectors` table
- **`distance`** (float) - Cosine distance between query and grant embeddings
  - **Lower distance = better match**
  - **Range**: 0.0 (identical) to 2.0 (opposite)
  - **Typical good matches**: < 0.5
  - **Excellent matches**: < 0.3

#### Distance to Similarity Conversion

⚠️ **IMPORTANT**: The function returns *distance*, not similarity. Convert using:

```typescript
// CORRECT: Cosine distance is 0-2, convert to 0-1 similarity
const similarity = Math.max(0, 1 - (distance / 2));

// INCORRECT (current bug in code):
const similarity = 1 - distance;  // Assumes 0-1 range, gives wrong scores
```

#### Usage Example

**In API Route** (`/api/results/route.ts`):

```typescript
import { getSupabase } from '@/lib/supabase';
import { generateEmbedding } from '@/lib/embeddings';

// Generate embedding for user query
const queryEmbedding = await generateEmbedding(userDescription);

// Call match_grants function
const { data: results, error } = await supabase.rpc('match_grants', {
  query_embedding: queryEmbedding,
  match_count: 10
});

// Fetch full grant details
const grantIds = results.map(r => r.id);
const { data: grants } = await supabase
  .from('grants_vectors')
  .select('*')
  .in('id', grantIds);

// Merge results with similarity scores
const grantsWithScores = results.map(r => {
  const grant = grants.find(g => g.id === r.id);
  const similarity = Math.max(0, 1 - (r.distance / 2));  // Correct conversion
  return { ...grant, similarity, distance: r.distance };
});
```

#### Performance Notes

- **Index**: Function relies on pgvector index (see [Indexes](#indexes))
- **Speed**: ~50ms for 10K grants on typical Supabase instance
- **Scaling**: Consider using HNSW index for >100K grants
- **Cost**: Vector operations are CPU-intensive, monitor Supabase usage

---

## Indexes

Proper indexes are critical for query performance as data grows.

### Existing Indexes

```sql
-- Primary keys (auto-created)
CREATE UNIQUE INDEX grants_vectors_pkey ON grants_vectors(id);
CREATE UNIQUE INDEX results_pkey ON results(id);

-- Vector similarity search (required for match_grants function)
CREATE INDEX grants_vectors_embedding_idx ON grants_vectors
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### Recommended Additional Indexes

```sql
-- History page sorting (ORDER BY created_at DESC)
CREATE INDEX idx_results_created_at ON results(created_at DESC);

-- Fetching grants by ID array (used after vector search)
CREATE INDEX idx_grants_vectors_id ON grants_vectors(id);

-- Full-text search on grant titles (for browse page search)
CREATE INDEX idx_grants_vectors_title_trgm ON grants_vectors
USING gin(title gin_trgm_ops);

-- Metadata filtering (if used)
CREATE INDEX idx_grants_vectors_metadata ON grants_vectors USING gin(metadata);
```

### Index Maintenance

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Rebuild vector index if needed
REINDEX INDEX grants_vectors_embedding_idx;
```

---

## Data Relationships

### Entity Relationship Diagram

```
┌─────────────────┐
│ grants_vectors  │
│ (Primary)       │
│─────────────────│
│ id (PK)         │◄──┐
│ title           │   │
│ embedding       │   │
│ ...             │   │
└─────────────────┘   │
                      │
                      │ referenced by
                      │ grant_id (no FK)
┌─────────────────┐   │
│ results         │   │
│ (Search History)│   │
│─────────────────│   │
│ id (PK)         │   │
│ description     │   │
│ recommended_    │───┘
│   grants[]      │   (JSONB array)
│   - grant_id    │
│   - match_score │
│   - reasoning   │
└─────────────────┘

Future:
┌──────────────────┐
│ grant_intent_    │
│   profiles       │
│──────────────────│
│ id (PK)          │
│ grant_id (FK) ───┼──► grants_vectors.id
│ primary_intent   │
│ ...              │
└──────────────────┘

┌──────────────────┐
│ conversation_    │
│   history        │
│──────────────────│
│ id (PK)          │
│ grant_id (FK) ───┼──► grants_vectors.id
│ session_id       │
│ message          │
└──────────────────┘
```

### Relationship Details

1. **grants_vectors ← results**
   - **Type**: One-to-many (one grant can appear in many results)
   - **Connection**: `results.recommended_grants[].grant_id` references `grants_vectors.id`
   - **Constraint**: None (soft reference via UUID)
   - **Cascade**: Grants can be deleted without breaking history

2. **grants_vectors ← grant_intent_profiles** (Planned)
   - **Type**: One-to-one (each grant has one intent profile)
   - **Connection**: Foreign key `grant_intent_profiles.grant_id`
   - **Constraint**: `ON DELETE CASCADE`

3. **grants_vectors ← conversation_history** (Planned)
   - **Type**: One-to-many (one grant can have many conversation messages)
   - **Connection**: Foreign key `conversation_history.grant_id`
   - **Constraint**: `ON DELETE CASCADE`

---

## Common Queries

### 1. Browse All Grants (Frontend Direct Query)

```typescript
// src/app/grants/page.tsx
const supabase = getSupabase();
const { data: grants } = await supabase
  .from('grants_vectors')
  .select('id, title, description, grant_url, funding_info, application_status')
  .order('title');
```

### 2. Get Grant Details by ID

```typescript
// src/app/grants/[id]/page.tsx
const { data: grant } = await supabase
  .from('grants_vectors')
  .select('*')
  .eq('id', grantId)
  .single();
```

### 3. Search History (Most Recent 50)

```typescript
// src/app/history/page.tsx
const { data: results } = await supabase
  .from('results')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50);
```

### 4. Get Result with Grant Details

```typescript
// src/app/results/[id]/page.tsx
// Step 1: Fetch result
const { data: result } = await supabase
  .from('results')
  .select('*')
  .eq('id', resultId)
  .single();

// Step 2: Extract grant IDs
const grantIds = result.recommended_grants.map(rg => rg.grant_id);

// Step 3: Fetch grants
const { data: grants } = await supabase
  .from('grants_vectors')
  .select('*')
  .in('id', grantIds);

// Step 4: Merge data
const enrichedGrants = result.recommended_grants.map(rg => ({
  ...rg,
  grant: grants.find(g => g.id === rg.grant_id)
}));
```

### 5. Vector Search + LLM Matching (Full Flow)

See `/api/results/route.ts` for complete implementation:

```typescript
// 1. Generate embedding
const embedding = await generateEmbedding(description);

// 2. Vector search
const { data: vectorResults } = await supabase.rpc('match_grants', {
  query_embedding: embedding,
  match_count: 10
});

// 3. Fetch full grant details
const { data: grants } = await supabase
  .from('grants_vectors')
  .select('*')
  .in('id', vectorResults.map(v => v.id));

// 4. LLM filter stage (10 → 4-6 grants)
const selectedIndices = await llmFilterStage(grants, description);

// 5. LLM reasoning stage (parallel)
const reasonings = await Promise.all(
  selectedGrants.map(grant => llmReasoningStage(grant, description))
);

// 6. Save result
const { data: result } = await supabase
  .from('results')
  .insert({
    title,
    description,
    recommended_grants: reasonings
  })
  .select()
  .single();
```

### 6. Client-Side Text Search (Browse Page Filter)

```typescript
// Client-side filtering (no database query)
const filtered = grants.filter(g =>
  g.title.toLowerCase().includes(query.toLowerCase()) ||
  g.description.toLowerCase().includes(query.toLowerCase())
);
```

### 7. Check Vector Index Health

```sql
-- Check index size and stats
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
WHERE indexname = 'grants_vectors_embedding_idx';
```

---

## Migration Guide

### Initial Setup (New Project)

1. **Enable pgvector extension**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Create grants_vectors table**:
   ```sql
   CREATE TABLE grants_vectors (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     embedding VECTOR(3072) NOT NULL,
     grant_url TEXT,
     about_grant TEXT,
     full_description TEXT,
     who_can_apply TEXT,
     funding_info TEXT,
     application_status TEXT,
     how_to_apply TEXT,
     when_can_apply TEXT,
     documents_required TEXT,
     links TEXT[],
     metadata JSONB
   );
   ```

3. **Create vector index**:
   ```sql
   CREATE INDEX grants_vectors_embedding_idx ON grants_vectors
   USING ivfflat (embedding vector_cosine_ops)
   WITH (lists = 100);
   ```

4. **Create match_grants function**:
   ```sql
   -- See function definition in "Database Functions" section above
   ```

5. **Create results table**:
   ```sql
   CREATE TABLE results (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT,
     description TEXT NOT NULL,
     estimated_cost INTEGER,
     timeline_months INTEGER,
     target_beneficiaries TEXT,
     expected_outcomes TEXT,
     recommended_grants JSONB NOT NULL DEFAULT '[]'::jsonb,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ
   );

   CREATE INDEX idx_results_created_at ON results(created_at DESC);
   ```

6. **Set up Row Level Security (RLS)**:
   ```sql
   -- Enable RLS on tables
   ALTER TABLE grants_vectors ENABLE ROW LEVEL SECURITY;
   ALTER TABLE results ENABLE ROW LEVEL SECURITY;

   -- Public read access for grants (all users can browse)
   CREATE POLICY "Public read access for grants"
     ON grants_vectors FOR SELECT
     TO anon, authenticated
     USING (true);

   -- Authenticated users can create/read their own results
   CREATE POLICY "Users can insert results"
     ON results FOR INSERT
     TO authenticated
     WITH CHECK (true);

   CREATE POLICY "Users can read all results"
     ON results FOR SELECT
     TO authenticated
     USING (true);
   ```

### Migrating from Mock Data

If you currently have mock data in `src/lib/mock-data.ts`:

1. **Export mock grants to SQL**:
   ```typescript
   // scripts/export-mock-grants.ts
   import { MOCK_GRANTS } from '../src/lib/mock-data';
   import { generateEmbedding } from '../src/lib/embeddings';

   for (const grant of MOCK_GRANTS) {
     const embedding = await generateEmbedding(
       `${grant.title} ${grant.description} ${grant.about_grant}`
     );

     await supabase.from('grants_vectors').insert({
       title: grant.title,
       description: grant.description,
       embedding,
       ...grant
     });
   }
   ```

2. **Update frontend to remove mock data imports**:
   - Remove `import { MOCK_GRANTS } from '@/lib/mock-data'`
   - Replace with Supabase queries as shown in Common Queries section

3. **Test vector search**:
   ```bash
   # Submit a test search via UI
   # Check results table in Supabase dashboard
   # Verify recommended_grants JSONB structure
   ```

### Updating Embedding Dimensions

If you need to change embedding dimensions (e.g., switching models):

```sql
-- 1. Add new column with new dimension
ALTER TABLE grants_vectors ADD COLUMN embedding_new VECTOR(1536);

-- 2. Populate new embeddings (do this in batches via script)
-- See scripts/regenerate-embeddings.ts

-- 3. Drop old index
DROP INDEX grants_vectors_embedding_idx;

-- 4. Rename columns
ALTER TABLE grants_vectors DROP COLUMN embedding;
ALTER TABLE grants_vectors RENAME COLUMN embedding_new TO embedding;

-- 5. Create new index
CREATE INDEX grants_vectors_embedding_idx ON grants_vectors
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 6. Update match_grants function signature
-- Change vector(3072) to vector(1536)
```

---

## Performance Optimization

### Query Performance Tips

1. **Batch grant fetches**: Use `.in()` instead of multiple single queries
2. **Select only needed columns**: Use `.select('id, title, description')` instead of `*`
3. **Paginate large results**: Use `.range(0, 49)` for pagination
4. **Cache grant listings**: Use Next.js revalidation for browse page

### Vector Search Optimization

1. **Tune HNSW parameters** for large datasets (>100K grants):
   ```sql
   CREATE INDEX grants_vectors_embedding_idx ON grants_vectors
   USING hnsw (embedding vector_cosine_ops)
   WITH (m = 16, ef_construction = 64);
   ```

2. **Monitor index usage**:
   ```sql
   SELECT * FROM pg_stat_user_indexes
   WHERE indexname LIKE '%embedding%';
   ```

3. **Consider pre-filtering** before vector search if you have categories:
   ```sql
   -- Example: filter by category before vector search
   SELECT id, embedding <=> query_embedding AS distance
   FROM grants_vectors
   WHERE metadata->>'category' = 'education'
   ORDER BY distance
   LIMIT 10;
   ```

### Cost Monitoring

- **Supabase**: Monitor database size and monthly egress in dashboard
- **Gemini API**: Track embedding calls (1 per search) and LLM calls (7-16 per search)
- **Expected costs** (1000 searches/month):
  - Embeddings: ~1000 calls × $0.00001 = $0.01
  - LLM calls: ~10,000 calls × $0.001 = $10
  - Supabase: Free tier sufficient for MVP (<500MB)

---

## Security Considerations

### Row Level Security (RLS)

**Current Status**: RLS must be configured before production.

**Recommended policies**:

```sql
-- Grants: Public read-only
CREATE POLICY "Anyone can read grants"
  ON grants_vectors FOR SELECT
  USING (true);

-- Results: Users can only read/write their own
CREATE POLICY "Users own their results"
  ON results
  USING (auth.uid() = user_id);  -- Add user_id column first
```

### API Security

1. **Never expose service role key** in client-side code
2. **Use anon key** for public reads (grants browsing)
3. **Use service role key** only in API routes (server-side)
4. **Validate inputs** before database queries (see code review findings)
5. **Rate limit** AI endpoints to prevent abuse

### Data Privacy

- **No PII in results**: User service ideas might contain sensitive info
- **Consider encryption**: For production, encrypt `results.description` field
- **Audit logs**: Track who accesses which grants (add `audit_log` table)

---

## Troubleshooting

### Vector Search Returns No Results

**Check**:
1. Is pgvector extension enabled? `SELECT * FROM pg_extension WHERE extname = 'vector';`
2. Do grants have embeddings? `SELECT id, title FROM grants_vectors WHERE embedding IS NULL;`
3. Is index built? `SELECT * FROM pg_indexes WHERE indexname LIKE '%embedding%';`
4. Is query embedding correct dimension? `SELECT array_length(embedding, 1) FROM grants_vectors LIMIT 1;`

### Slow Query Performance

**Check**:
1. Are indexes created? `SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';`
2. Is index being used? `EXPLAIN ANALYZE SELECT ...` your slow query
3. Are you selecting only needed columns?
4. Is Supabase instance overloaded? Check dashboard metrics

### Distance Scores Look Wrong

**Check**:
1. Are you converting distance to similarity correctly? `similarity = 1 - (distance / 2)` not `1 - distance`
2. Is embedding model consistent? Don't mix different embedding models (e.g., gemini-embedding-001 vs text-embedding-004)
3. Are embeddings normalized? pgvector expects unit vectors for cosine distance

### LLM Returns Invalid JSON

**Check**:
1. Is prompt clear about JSON-only response? Remove markdown instructions
2. Are you stripping markdown code blocks? `text.replace(/^```json?\n?/i, '')`
3. Is fallback handling in place? See `/api/results/route.ts:134-138` for example

---

## Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **pgvector Guide**: https://github.com/pgvector/pgvector
- **Gemini API**: https://ai.google.dev/docs
- **Next.js + Supabase**: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-15 | Initial | Complete schema documentation with tables, functions, indexes, and relationships |

---

**Questions?** Contact the development team or open an issue in the repository.

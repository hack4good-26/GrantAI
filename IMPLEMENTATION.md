# Implementation Architecture

## Overview

This document describes the technical architecture for Grant Intent Advisor. The system uses a serverless approach with Next.js API routes, Supabase (PostgreSQL + pgvector), and weekly cron jobs for grant ingestion.

**Key Design Principle:** No persistent backend server (FastAPI/Express). All server-side logic runs in Next.js API routes on Vercel's serverless functions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│ Frontend: Next.js on Vercel                     │
│ - UI components (React 19)                      │
│ - Direct Supabase queries for reading grants    │
│ - Calls Next.js API routes for AI operations    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Next.js API Routes (Server-Side on Vercel)     │
│                                                  │
│ /api/service-ideas/route.ts                     │
│   POST: Generate embedding → Store in Supabase  │
│   GET: Fetch search history                     │
│                                                  │
│ /api/service-ideas/[id]/matches/route.ts        │
│   GET: pgvector similarity search                │
│        Call Gemini for match reasoning           │
│                                                  │
│ /api/grants/route.ts                            │
│   GET: Fetch all grants (optional, can be       │
│        direct Supabase call from frontend)      │
│                                                  │
│ /api/grants/[id]/route.ts                       │
│   GET: Fetch single grant details               │
│                                                  │
│ /api/grants/[id]/explain/route.ts               │
│   POST: Call Gemini for conversational Q&A       │
│         Return AI response                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Supabase (PostgreSQL + pgvector)               │
│                                                  │
│ Tables:                                         │
│ - grants (id, title, description, funding, etc) │
│ - grant_embeddings (grant_id, embedding vector) │
│ - grant_intent_profiles (AI-analyzed intent)    │
│ - service_ideas (id, description, embedding)    │
│ - grant_matches (similarity scores, reasoning)  │
│ - conversation_history (AI chat logs)           │
│                                                  │
│ Extensions:                                      │
│ - pgvector (for vector similarity search)       │
└─────────────────────────────────────────────────┘
                    ↑
┌─────────────────────────────────────────────────┐
│ Weekly Cron Job (GitHub Actions / Vercel Cron) │
│                                                  │
│ 1. Scrape grants from sources (NCSS, etc)      │
│ 2. Generate embeddings (OpenAI API)             │
│ 3. Generate intent profiles (Gemini)             │
│ 4. Update Supabase tables                       │
│ 5. Clean up expired grants                      │
└─────────────────────────────────────────────────┘
```

## Components Breakdown

### 1. Frontend (Next.js on Vercel)

**What it does:**
- Renders UI components (forms, cards, dialogs)
- Direct Supabase read queries for browsing grants (no API route needed)
- Calls Next.js API routes for write operations and AI features
- Client-side filtering and search (for simple operations)

**Why direct Supabase access?**
- Reading grants list doesn't require AI processing
- Reduces latency (no intermediate API call)
- Supabase client library handles connection pooling and caching

**Example:**
```typescript
// src/app/grants/page.tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function GrantsPage() {
  const { data: grants } = await supabase
    .from('grants')
    .select('*')
    .eq('status', 'ACTIVE');

  return <GrantList grants={grants} />;
}
```

### 2. Next.js API Routes (Serverless Functions)

**Purpose:** Handle operations that require:
- OpenAI API calls (embeddings, Gemini)
- Complex database operations (vector search)
- Secret key access (API keys should never be exposed to frontend)

#### 2.1 Service Ideas API

**POST /api/service-ideas**


**GET /api/service-ideas**
```typescript
// Fetch search history
export async function GET() {
  const supabase = createClient(...);
  const { data } = await supabase
    .from('service_ideas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return Response.json(data);
}
```

#### 2.2 Match Search API

**GET /api/service-ideas/[id]/matches**

#### 2.3 Grant Explainer API

**POST /api/grants/[id]/explain**


### 3. Supabase Database Schema

**grants table:**
```sql
CREATE TABLE grants (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  description TEXT NOT NULL,
  raw_content TEXT NOT NULL,
  url TEXT,
  funding_min INTEGER,
  funding_max INTEGER,
  deadline TIMESTAMP,
  duration_months INTEGER,
  status TEXT CHECK (status IN ('ACTIVE', 'EXPIRED', 'UPCOMING')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**grant_embeddings table:**
```sql
CREATE TABLE grant_embeddings (
  id SERIAL PRIMARY KEY,
  grant_id INTEGER REFERENCES grants(id) ON DELETE CASCADE,
  embedding vector(3072),  -- pgvector extension required
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON grant_embeddings USING ivfflat (embedding vector_cosine_ops);
```

**grant_intent_profiles table:**
```sql
CREATE TABLE grant_intent_profiles (
  id SERIAL PRIMARY KEY,
  grant_id INTEGER REFERENCES grants(id) ON DELETE CASCADE,
  primary_intent TEXT,
  focus_areas JSONB,  -- Array of strings
  philosophical_stance JSONB,  -- {values, priorities, approach}
  ideal_applicant JSONB,  -- {organization_type, size, experience_level, characteristics}
  kpi_nature JSONB,  -- {type, flexibility, expectations}
  realistic_project JSONB,  -- {scope, timeline, budget_range, examples}
  potential_concerns JSONB,  -- Array of strings
  application_tips JSONB,  -- Array of strings
  confidence_score FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**service_ideas table:**
```sql
CREATE TABLE service_ideas (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT NOT NULL,
  estimated_cost INTEGER,
  timeline_months INTEGER,
  target_beneficiaries TEXT,
  expected_outcomes TEXT,
  embedding vector(3072),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON service_ideas USING ivfflat (embedding vector_cosine_ops);
```

**grant_matches table:**
```sql
CREATE TABLE grant_matches (
  id SERIAL PRIMARY KEY,
  service_idea_id INTEGER REFERENCES service_ideas(id) ON DELETE CASCADE,
  grant_id INTEGER REFERENCES grants(id) ON DELETE CASCADE,
  similarity_score FLOAT NOT NULL,
  alignment_score FLOAT,
  match_reasoning TEXT,
  why_fits JSONB,  -- Array of strings
  concerns JSONB,  -- Array of strings
  decision_recommendation TEXT CHECK (decision_recommendation IN ('APPLY', 'WATCH', 'SKIP')),
  recommended_effort TEXT CHECK (recommended_effort IN ('LOW', 'MEDIUM', 'HIGH')),
  win_probability FLOAT,
  next_steps JSONB,  -- Array of strings
  reframing_needed BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**conversation_history table:**
```sql
CREATE TABLE conversation_history (
  id SERIAL PRIMARY KEY,
  grant_id INTEGER REFERENCES grants(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Weekly Cron Job (Grant Ingestion)

**Purpose:** Scrape new grants, generate embeddings and intent profiles, update database.

**Implementation Options:**
1. **Vercel Cron** (recommended for Next.js apps)
2. **GitHub Actions** (run workflow on schedule)
3. **Separate Node.js script** (can be same repo, different entry point)


## Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**Server-Side (Vercel Environment Variables):**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  (secret, full database access)
OPENAI_API_KEY=sk-xxx...
CRON_SECRET=xxx...  (for authenticating cron jobs)
```

## Data Flow Summary

### User Search Flow:
1. User submits query → `POST /api/service-ideas`
2. API route generates embedding → stores in Supabase
3. Redirect to `/matches?id={serviceIdeaId}`
4. Page calls `GET /api/service-ideas/{id}/matches`
5. API route performs vector search + generates reasoning
6. Returns matches to frontend → display

### Browse Grants Flow:
1. User navigates to `/grants`
2. Frontend directly queries Supabase (no API route)
3. Display grants in grid

### Grant Explainer Flow:
1. User asks question → `POST /api/grants/{id}/explain`
2. API route fetches grant + intent profile
3. Calls Gemini with context
4. Returns answer → display in chat UI

## Cost Optimization

**OpenAI API Costs:**
- **Embeddings:** $0.00013 per 1K tokens (~$0.0001 per service idea, ~$0.001 per grant)
- **Gemini:** ~$0.01-0.03 per match reasoning, ~$0.005-0.01 per explainer question

**Strategies:**
1. **Cache match results** - Store in `grant_matches` table, reuse for same service idea
2. **Batch grant ingestion** - Weekly cron reduces API calls
3. **Lazy intent profile generation** - Only generate when needed (not implemented in cron)
4. **Use Geminio-mini** for simpler tasks (cheaper alternative)

**Estimated Monthly Costs (100 active users):**
- 100 searches/month: ~$3 (embeddings + match reasoning)
- 500 questions/month: ~$5 (explainer)
- Weekly grant ingestion (10 new grants/week): ~$5
- **Total: ~$13/month**

## Deployment Checklist

- [ ] Set up Supabase project
- [ ] Enable pgvector extension
- [ ] Create database schema (all tables)
- [ ] Create search_similar_grants function
- [ ] Deploy Next.js to Vercel
- [ ] Configure environment variables
- [ ] Set up Vercel Cron for weekly ingestion
- [ ] Test service idea submission
- [ ] Test vector search
- [ ] Test grant explainer
- [ ] Monitor OpenAI API usage

## Benefits of This Architecture

1. **No persistent server** - Serverless scales automatically, no maintenance
2. **Cost-effective** - Only pay for actual usage (Vercel functions + Supabase)
3. **Single codebase** - Next.js handles both frontend and backend logic
4. **Scalable** - Vercel + Supabase handle scaling automatically
5. **Fast development** - No separate backend deployment pipeline
6. **Easy testing** - All code in one repo, easier to test and iterate

## Next Steps

See [CLAUDE.md](./CLAUDE.md) for implementation guidelines and component documentation.

1. Set up Supabase project
2. Implement Next.js API routes
3. Replace mock data in frontend with API calls
4. Implement grant scraper cron job
5. Test end-to-end flows
6. Deploy to production

# Implementation Plan - Simplified

This document outlines the simplified implementation plan for the Grant Intent Advisor, focusing on what's actually built in the frontend.

## Current Status

### ✅ Frontend Complete (Using Mock Data)
- **Dashboard** (`/dashboard`) - Search form with query input and optional filters
- **Matches** (`/matches`) - Display matching grants with similarity scores
- **History** (`/history`) - List of past searches
- **Grants** (`/grants`) - Browse all grants with client-side search
- **Grant Detail** (`/grants/[id]`) - Full grant info with AI chat sidebar
- **Sidebar Navigation** - Persistent navigation across all pages
- **UI Components** - shadcn/ui components, responsive design

### 🚧 Backend Needed
The frontend is complete but uses mock data. The backend needs to implement these 5 API endpoints:

## Required API Endpoints

### 1. GET /api/grants
**Purpose:** List all available grants
**Returns:** Array of Grant objects
**Used by:** `/grants` page to display all grants

```typescript
Response: Grant[]
```

### 2. GET /api/grants/[id]
**Purpose:** Get detailed information for a specific grant
**Returns:** Single Grant object
**Used by:** `/grants/[id]` page for grant details

```typescript
Response: Grant
```

### 3. POST /api/service-ideas
**Purpose:** Create a new service idea from search form
**Request:** Service idea data (title, description, optional fields)
**Returns:** Created ServiceIdea with ID
**Used by:** `/dashboard` SearchForm submission

```typescript
Request: {
  title: string;
  description: string;
  estimated_cost?: number;
  timeline_months?: number;
  target_beneficiaries?: string;
  expected_outcomes?: string;
}

Response: ServiceIdea (with id, created_at, updated_at)
```

### 4. GET /api/service-ideas
**Purpose:** List all past service ideas (for history)
**Returns:** Array of ServiceIdea objects
**Used by:** `/history` page

```typescript
Response: ServiceIdea[]
```

### 5. GET /api/service-ideas/[id]/matches
**Purpose:** Get matching grants for a service idea
**Returns:** Array of GrantMatch objects with similarity scores
**Used by:** `/matches` page

```typescript
Response: GrantMatch[] (includes grant object, similarity_score, match_reasoning)
```

### 6. POST /api/grants/[id]/explain
**Purpose:** AI chat - answer questions about a specific grant
**Request:** User question
**Returns:** AI-generated answer
**Used by:** `/grants/[id]` AI chat sidebar

```typescript
Request: {
  question: string;
}

Response: {
  question: string;
  answer: string;
}
```

## Backend Implementation Requirements

### Core Functionality Needed:

1. **Database Setup**
   - PostgreSQL with pgvector extension
   - Tables: grants, service_ideas, grant_matches
   - Store grant data and service ideas

2. **AI Integration (OpenAI)**
   - Generate embeddings for grants and service ideas (text-embedding-3-large)
   - Semantic similarity search using pgvector
   - GPT-4 for AI chat/explainer

3. **Vector Search**
   - When service idea is created, generate embedding
   - Find grants with similar embeddings using cosine similarity
   - Return top N matches sorted by similarity score

4. **AI Chat**
   - Take user question + grant data
   - Use GPT-4 to generate contextual answer
   - Return plain text response

## Optional/Future Features

These features are NOT in the current frontend but were in the original plan:

- ❌ Intent Analysis - Deep AI analysis of grant requirements
- ❌ Match Reasoning - Detailed "why fits" / "concerns" lists
- ❌ Decision Recommendations (APPLY/WATCH/SKIP)
- ❌ Grant comparison feature
- ❌ Advanced filtering (by status, funding range, deadline)
- ❌ Grant scraping from external sources

## Simplified Architecture

```
User Flow:
1. Dashboard → Enter service idea → Submit
2. Backend creates ServiceIdea + generates embedding
3. Redirect to /matches?id=X
4. Backend runs vector search for similar grants
5. Display grants sorted by similarity score
6. Click grant → View details + AI chat
```

## Next Steps

### To Make Frontend Functional:

1. **Set up Python FastAPI backend** with PostgreSQL + pgvector
2. **Implement 6 API endpoints** listed above
3. **Add OpenAI integration** for embeddings and chat
4. **Seed database** with sample grants
5. **Update frontend** to call real APIs instead of mock data
6. **Deploy** both frontend and backend

### Frontend Changes Needed:

- `SearchForm.tsx` - Replace mock delay with real `serviceIdeasApi.create()` call
- `matches/page.tsx` - Fetch from `serviceIdeasApi.getMatches(id)` instead of `MOCK_MATCHES`
- `history/page.tsx` - Fetch from `serviceIdeasApi.getAll()` instead of `MOCK_HISTORY`
- `grants/page.tsx` - Fetch from `grantsApi.getAll()` instead of `MOCK_GRANTS`
- `grants/[id]/page.tsx` - Fetch from `grantsApi.getById(id)` and call `explainerApi.explain()` for chat

All API client methods are already defined in `src/lib/api.ts` - just need to wire them up!

## Deployment

### Frontend (Vercel)
- Deploy Next.js app
- Set `NEXT_PUBLIC_API_URL` environment variable

### Backend (Railway/Render)
- Deploy FastAPI app
- Set up PostgreSQL with pgvector
- Set `OPENAI_API_KEY` environment variable
- Enable CORS for frontend domain

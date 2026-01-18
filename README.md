## Problem Statement: TSAO 1: Grants

How might non-profit organisations "pull" information about grants from OurSG grants portal that are relevant to them according to key criteria including issue area, scope of grant, KPls, funding quantum, application due date, etcs. so that they can strengthen their financial sustainability?

# GrantAI

AI-powered grant discovery and matching platform that helps nonprofits find the perfect funding opportunities for their service ideas.

## Overview

GrantAI uses advanced AI technology to match nonprofit service ideas with relevant grant opportunities. By combining vector embeddings with LLM-based reasoning, the platform provides intelligent, contextualized grant recommendations that go beyond simple keyword matching.

## Key Features

- **Intelligent Grant Matching**: Semantic search using vector embeddings to find grants that truly align with your service idea
- **AI-Powered Analysis**: LLM reasoning generates detailed match scores, fit analysis, and application recommendations
- **Grant Explainer Chatbot**: Interactive AI assistant to answer questions about specific grants
- **Search History**: Track and revisit past searches and recommendations
- **Browse Grants**: Explore the complete grant database with filtering and search
- **Detailed Grant Information**: View comprehensive grant details including eligibility, funding info, application requirements, and timelines

## Tech Stack

- **Frontend**: Next.js 16.1, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL with pgvector extension)
- **AI/ML**: Google Gemini API
  - `gemini-embedding-001` for vector embeddings
  - `gemini-3-flash-preview` for reasoning and chat
- **Vector Search**: pgvector for semantic similarity search

## Prerequisites

Before you begin, ensure you have:

- Node.js 20+ and npm installed
- A [Supabase](https://supabase.com) account and project
- A [Google AI Studio](https://aistudio.google.com) account for Gemini API access

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hack4good-2026
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here
```

4. Set up the database:

Run the SQL migrations in your Supabase SQL Editor. See [SUPABASE.md](./SUPABASE.md) for complete database setup instructions:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create tables and functions (see SUPABASE.md for full schema)
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
hack4good-2026/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   │   ├── results/          # Search and match endpoints
│   │   │   └── grants/           # Grant data and AI explainer
│   │   ├── dashboard/            # Main search interface
│   │   ├── results/              # Match results display
│   │   ├── grants/               # Grant browsing and details
│   │   ├── history/              # Search history
│   │   └── layout.tsx            # Root layout
│   ├── components/               # React components
│   │   ├── ui/                   # Radix UI primitives
│   │   ├── grants/               # Grant-specific components
│   │   ├── matches/              # Match display components
│   │   ├── search/               # Search form components
│   │   ├── layout/               # Sidebar, header
│   │   └── shared/               # Shared utilities
│   └── lib/                      # Utilities and configurations
│       ├── types.ts              # TypeScript interfaces
│       ├── supabase.ts           # Supabase client
│       ├── embeddings.ts         # Embedding generation
│       ├── api.ts                # API client
│       └── utils.ts              # Utility functions
├── CLAUDE.md                     # Claude Code development guide
├── SUPABASE.md                   # Database schema documentation
└── README.md                     # This file
```

## How It Works

### 6-Stage Grant Matching Pipeline

1. **User Input**: User describes their service idea with optional filters (budget, timeline)

2. **Embedding Generation**: Query is converted to a 3072-dimension vector using Gemini embeddings

3. **Vector Search**: Supabase performs cosine similarity search, returning top 10 grants

4. **LLM Filter Stage**: Gemini analyzes top 10 grants and selects 4-6 most relevant matches

5. **LLM Reasoning Stage**: Parallel AI analysis of each selected grant generates:
   - Match score (0-100)
   - Why it fits (strengths)
   - Concerns (potential issues)
   - Recommendation (APPLY/WATCH/SKIP)
   - Win probability (0.0-1.0)

6. **Result Persistence**: Recommendations saved to database, user redirected to results page

### Grant Explainer AI Chat

- Conversational AI assistant for each grant
- Maintains conversation history for context
- Answers questions about eligibility, requirements, funding, and application process
- Uses grant-specific context for accurate, relevant responses

## API Endpoints

### Search & Results

- `POST /api/results` - Submit service idea and get grant recommendations
- `GET /api/results/[id]` - Fetch a specific result by ID
- `DELETE /api/results` - Clear all search history

### Grants

- `GET /api/grants` - List all grants (paginated)
- `GET /api/grants/[id]` - Fetch specific grant details
- `POST /api/grants/[id]/explain` - Ask AI questions about a grant

## Database Schema

The application uses two main tables:

- **grants_vectors**: Stores grant information with vector embeddings
- **results**: Stores search queries and AI-generated recommendations

For complete database documentation, see [SUPABASE.md](./SUPABASE.md).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL (server-side) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (client-side) | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

**Security Note**: Never commit `.env.local` to version control. The service role key grants full database access.

## Key Technologies Explained

### Vector Embeddings

Text is converted into numerical vectors (arrays of numbers) that capture semantic meaning. Similar concepts have similar vectors, enabling semantic search that understands context beyond keywords.

### pgvector

PostgreSQL extension that enables efficient vector similarity search directly in the database using specialized indexes (IVFFlat/HNSW).

### Cosine Similarity

Measures the similarity between two vectors by calculating the cosine of the angle between them. Returns a distance score (0-2 range) where lower values indicate better matches.

### LLM Reasoning

Large Language Models analyze grant-service idea pairs to provide nuanced matching that considers eligibility, alignment, and application viability beyond simple text similarity.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables for Production

Set these in your Vercel project settings:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project was created for Hack4Good 2026.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://www.radix-ui.com)
- Database powered by [Supabase](https://supabase.com)
- AI capabilities from [Google Gemini](https://ai.google.dev)
- Vector search using [pgvector](https://github.com/pgvector/pgvector)

## Support

For questions or issues:
1. Check [CLAUDE.md](./CLAUDE.md) for development guidance
2. Check [SUPABASE.md](./SUPABASE.md) for database documentation
3. Open an issue in the repository

---

Built with ❤️ for nonprofits seeking funding opportunities

# 🚀 Grant Intent Advisor - Implementation Plan

## 🎯 Frontend User Flow (Comprehensive Platform)

A comprehensive grant discovery and matching platform with 4 main user flows:

### **Flow 1: Search for Matching Grants**
1. **Landing Page (`/dashboard`)** → Clean search interface
   - Large textarea for query (REQUIRED)
   - Collapsible optional fields (cost, timeline, beneficiaries, outcomes)
2. **Submit** → Service idea saved, semantic vector search runs
3. **Results Page (`/matches`)** → List of matching grants sorted by score
   - Each grant shows: basic info, matching score, AI reasoning
   - Collapsible AI explainer under each grant
   - Link to full grant details

### **Flow 2: Browse All Grants**
1. **Grants Page (`/grants`)** → View all available grants in grid
   - Filter by: status, source, funding range, deadline
   - Sort by: newest, deadline, funding amount
2. **Grant Detail (`/grants/[id]`)** → Full grant information
   - Intent analysis (collapsible)
   - AI Explainer at bottom (ask questions)

### **Flow 3: View Search History**
1. **History Page (`/history`)** → See all past searches with timestamps
2. **Click any search** → Navigate back to that search's matches
3. **Track progress** → See match counts for each search

### **Flow 4: Navigation**
- **Sidebar** with links to: Dashboard, Browse Grants, Search History
- Active page highlighted
- Responsive: drawer on mobile, fixed sidebar on desktop

---

## 🗺️ Application Map

```
┌─────────────────────────────────────────────────────────────┐
│                         SIDEBAR                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🏠 Dashboard (New Search)                           │   │
│  │  📋 Browse Grants                                    │   │
│  │  🕐 Search History                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│   Dashboard    │──▶   │    Matches     │──▶   │  Grant Detail  │
│   /dashboard   │      │  /matches?id=X │      │  /grants/[id]  │
│                │      │                │      │                │
│  • Query input │      │  • Grant cards │      │  • Full info   │
│  • Optional    │      │  • Match scores│      │  • Intent      │
│    fields      │      │  • AI reasoning│      │  • AI Explainer│
│  • Submit      │      │  • Mini explain│      │    (full)      │
└────────────────┘      └────────────────┘      └────────────────┘
                                 ▲                       │
                                 │                       │
                                 └───────────────────────┘
                                    (View Details)

┌────────────────┐      ┌────────────────┐
│   History      │──▶   │    Matches     │
│   /history     │      │  /matches?id=X │
│                │      │  (revisit old) │
│  • Past        │      └────────────────┘
│    searches    │
│  • Timestamps  │      ┌────────────────┐
│  • Match counts│──▶   │  Grant Detail  │
└────────────────┘      │  /grants/[id]  │
                        │                │
┌────────────────┐      │  • Browse      │
│  Browse Grants │──▶   │  • Discover    │
│   /grants      │      │  • Learn       │
│                │      └────────────────┘
│  • All grants  │
│  • Filter/Sort │
│  • Discover    │
└────────────────┘
```

---

## 📋 Complete Feature List

### **Core Features**
1. ✅ **Search & Matching** - Natural language query → AI-powered grant matches with scores and reasoning
2. ✅ **Browse Grants** - View all available grants with filter/sort functionality
3. ✅ **Grant Details** - Full grant information with intent analysis
4. ✅ **AI Explainer** - Ask questions about any grant, get contextual answers
5. ✅ **Search History** - Track and revisit past searches
6. ✅ **Sidebar Navigation** - Easy navigation between all pages

### **Pages Summary**
| Page | Route | Purpose |
|------|-------|---------|
| **Dashboard** | `/dashboard` | Main search interface (landing page) |
| **Matches** | `/matches?id=X` | Show grants matching a service idea |
| **History** | `/history` | List all past searches with timestamps |
| **Browse Grants** | `/grants` | Discover all available grants |
| **Grant Detail** | `/grants/[id]` | Full grant info + AI Q&A |

### **AI Components**
- **Vector Search**: Semantic matching using pgvector and embeddings
- **Intent Analysis**: Deep analysis of grant requirements and philosophical stance
- **Match Reasoning**: AI-generated explanation of why grants match service ideas
- **Grant Explainer**: Conversational AI to answer questions about grants

---

## 📋 Day-by-Day Overview

### **DAY 1: Foundation + Scraping Infrastructure**
**Goal:** Set up projects and build grant scraper

### **DAY 2: AI Intent Analysis Engine**
**Goal:** Build AI system to analyze grants and extract intent profiles

### **DAY 3: Search Interface & Match Results UI**
**Goal:** Build search form and display matching grants with AI reasoning

### **DAY 4: History Page & Grants Browse Page**
**Goal:** Add /history page for past searches and /grants page to browse all grants

### **DAY 5: Grant Detail Page & AI Explainer**
**Goal:** Build /grants/[id] with full grant info and integrated AI Q&A system

### **DAY 5.5: Sidebar Navigation**
**Goal:** Add persistent sidebar navigation connecting all pages

### **DAY 6: Sample Data, Testing & Refinement**
**Goal:** Create realistic sample data and test all features

### **DAY 7: Demo Preparation & Final Polish**
**Goal:** Prepare demo, fix bugs, create presentation

---

## 📁 Project Structure

### **Next.js Frontend Structure (Comprehensive Platform)**
```
grant-advisor/
├── src/
│   ├── app/
│   │   ├── layout.tsx (root layout with sidebar)
│   │   ├── page.tsx (redirect to dashboard)
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   │   └── page.tsx (search interface landing page)
│   │   ├── matches/
│   │   │   └── page.tsx (results page with grant matches)
│   │   ├── history/
│   │   │   └── page.tsx (view all previous searches)
│   │   └── grants/
│   │       ├── page.tsx (browse all available grants)
│   │       └── [id]/
│   │           └── page.tsx (individual grant detail + AI explainer)
│   │
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── scroll-area.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx (navigation with links)
│   │   │   └── Header.tsx (optional top nav)
│   │   │
│   │   ├── search/
│   │   │   ├── SearchForm.tsx (main form with React Hook Form)
│   │   │   ├── QueryInput.tsx (large required textarea)
│   │   │   └── OptionalFields.tsx (collapsible structured fields)
│   │   │
│   │   ├── matches/
│   │   │   ├── MatchCard.tsx (grant + score + reasoning + mini explainer)
│   │   │   ├── MatchList.tsx (sorted list of matches)
│   │   │   └── MatchScore.tsx (visual score indicator)
│   │   │
│   │   ├── grants/
│   │   │   ├── GrantCard.tsx (for /grants list view)
│   │   │   ├── GrantList.tsx (grid of grant cards)
│   │   │   ├── GrantDetail.tsx (full grant information display)
│   │   │   ├── GrantExplainer.tsx (AI Q&A section)
│   │   │   └── GrantFilters.tsx (filter/sort controls - optional)
│   │   │
│   │   ├── history/
│   │   │   ├── HistoryCard.tsx (past search display card)
│   │   │   ├── HistoryList.tsx (list of past searches)
│   │   │   └── HistoryItem.tsx (individual history item)
│   │   │
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── lib/
│   │   ├── api.ts (API client with axios)
│   │   ├── utils.ts (cn function, helpers)
│   │   └── types.ts (TypeScript interfaces)
│   │
│   └── hooks/
│       ├── useSearchHistory.ts (fetch search history)
│       └── useMatches.ts
│
├── public/
│   └── (images, icons)
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### **Key Frontend Pages**

**1. Dashboard (`/dashboard`)** - Search landing page
- Large textarea for query (REQUIRED)
- Collapsible optional fields (cost, timeline, beneficiaries, outcomes)
- "Find Grants" button

**2. Matches (`/matches?id=X`)** - Search results
- List of grants sorted by similarity score
- Each grant: basic info, match score, AI reasoning
- Collapsible mini AI explainer under each grant
- Link to full grant details

**3. History (`/history`)** - Past searches
- List of all previous searches with timestamps
- Shows match count for each search
- Click to navigate back to matches

**4. Grants (`/grants`)** - Browse all grants
- Grid of all available grants (informational)
- Filter by: status, source, funding, deadline
- Sort by: newest, deadline, funding amount
- Click any grant to view details

**5. Grant Detail (`/grants/[id]`)** - Individual grant
- Full grant information
- Intent analysis (collapsible)
- Eligibility & requirements
- AI Explainer at bottom (full version with conversation history)

**6. Sidebar Navigation** - Persistent across all pages
- Logo/branding
- Links: Dashboard, Browse Grants, Search History
- Active state highlighting
- Responsive: drawer on mobile, fixed sidebar on desktop

### **Python FastAPI Backend Structure**
```
grant-advisor-api/
├── main.py (FastAPI app entry point)
├── database.py (SQLAlchemy setup)
├── models.py (Database models)
│
├── routers/
│   ├── grants.py (grant endpoints)
│   ├── service_ideas.py (service idea endpoints)
│   ├── dashboard.py (dashboard data endpoints)
│   └── explainer.py (AI explainer endpoints)
│
├── scrapers/
│   ├── __init__.py
│   ├── base_scraper.py (abstract base class)
│   └── oursg_scraper.py (OurSG portal scraper)
│
├── ai/
│   ├── __init__.py
│   ├── openai_client.py (OpenAI API wrapper)
│   ├── prompts.py (all AI prompts)
│   ├── grant_analyzer.py (intent analysis)
│   ├── service_matcher.py (matching logic)
│   └── grant_explainer.py (Q&A system)
│
├── scripts/
│   ├── generate_sample_data.py
│   ├── setup_demo.sh
│   └── setup_demo_data.py
│
├── tests/
│   └── test_full_workflow.py
│
├── .env
├── .env.example
├── requirements.txt
└── README.md
```

---

## 🔧 Technical Implementation Checklist

## **DAY 1: Foundation + Scraping**

### Backend Setup
- [ ] Create Python virtual environment
- [ ] Install dependencies: `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `playwright`, `beautifulsoup4`, `python-dotenv`, `openai`, `pydantic`, `requests`
- [ ] Install Playwright browsers: `playwright install chromium`
- [ ] Set up Neon PostgreSQL database
- [ ] Enable pgvector extension on Neon
- [ ] Create `database.py` with SQLAlchemy connection
- [ ] Create `models.py` with all database models:
  - `grants` table
  - `grant_intent_profiles` table
  - `grant_embeddings` table (with vector column)
  - `service_ideas` table
  - `service_idea_embeddings` table
  - `grant_matches` table
  - `grant_timelines` table
- [ ] Create indexes on foreign keys
- [ ] Create vector similarity index on embeddings
- [ ] Set up FastAPI app in `main.py`
- [ ] Configure CORS middleware
- [ ] Create health check endpoint

### Scraper Implementation
- [ ] Create `base_scraper.py` abstract class
- [ ] Implement `oursg_scraper.py`:
  - Playwright async browser automation
  - Navigate to OurSG grants portal
  - Extract grant cards from listing
  - Visit each grant detail page
  - Parse structured data (title, funding, deadline, etc.)
  - Extract full raw content for AI analysis
- [ ] Create `/api/scrape/oursg` POST endpoint
- [ ] Save scraped grants to database
- [ ] Handle errors and timeouts
- [ ] Test scraper with actual OurSG site

### Frontend Setup
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Install Tailwind CSS
- [ ] Initialize shadcn/ui
- [ ] Install additional dependencies: `axios`, `react-hook-form`, `@hookform/resolvers`, `zod`, `date-fns`, `lucide-react`
- [ ] Configure `tailwind.config.ts`
- [ ] Set up project structure (folders listed above)
- [ ] Create `lib/types.ts` with TypeScript interfaces:
  - Grant
  - GrantIntentProfile
  - ServiceIdea
  - GrantMatch
- [ ] Create `lib/api.ts` with axios client
- [ ] Create `lib/utils.ts` with helper functions
- [ ] Set up basic layout and routing structure
- [ ] Test Next.js dev server running

### Environment Configuration
- [ ] Backend `.env`: `DATABASE_URL`, `OPENAI_API_KEY`
- [ ] Frontend `.env.local`: `NEXT_PUBLIC_API_URL`
- [ ] Create `.env.example` files for both

**End of Day 1:**
- ✅ Both projects set up and running
- ✅ Database connected with tables created
- ✅ Scraper working and saving grants
- ✅ Basic frontend structure ready

---

## **DAY 2: AI Intent Analysis Engine**

### Backend AI Implementation
- [ ] Create `ai/openai_client.py`:
  - Initialize OpenAI client
  - `generate_completion()` method for GPT-4
  - `generate_embeddings()` method for text-embedding-3-large
- [ ] Create `ai/prompts.py`:
  - `GRANT_INTENT_ANALYSIS_PROMPT` (structured JSON output)
  - Fields: primary_intent, philosophical_stance, ideal_applicant, kpi_nature, realistic_project, potential_concerns, application_tips
- [ ] Create `ai/grant_analyzer.py`:
  - `analyze_grant()` method
  - Format prompt with grant data
  - Call GPT-4 for analysis
  - Parse JSON response
  - Handle markdown code blocks in response
  - Calculate confidence score
  - `generate_embedding()` method
  - Combine grant + intent for embedding text
  - Generate 3072-dimension vector

### Grant Analysis Endpoints
- [ ] Create `routers/grants.py`
- [ ] Implement endpoints:
  - `GET /api/grants` (list all grants with filters)
  - `GET /api/grants/{id}` (get specific grant)
  - `POST /api/grants/{id}/analyze` (trigger intent analysis)
  - `GET /api/grants/{id}/intent` (get intent profile)
  - `POST /api/grants/analyze-all` (bulk analysis)
- [ ] Use FastAPI BackgroundTasks for async analysis
- [ ] Create `run_grant_analysis()` background task:
  - Fetch grant from database
  - Run AI analysis
  - Save intent profile to database
  - Generate embedding
  - Save embedding to database
- [ ] Handle errors gracefully
- [ ] Add response models with Pydantic

### Frontend Setup (Simplified)
- [ ] Install shadcn components: `button`, `card`, `badge`, `skeleton`
- [ ] Verify `lib/api.ts` has grant methods:
  - `grantsApi.getAll()` (for backend testing)
  - `grantsApi.getById(id)` (used by match results)
  - `grantsApi.analyzeGrant(id)` (backend only)
  - `grantsApi.getIntentProfile(id)` (used in match reasoning)
- [ ] No separate grants page needed - grants only shown in match results

**End of Day 2:**
- ✅ AI intent analysis working
- ✅ Grants analyzed and profiles stored
- ✅ Embeddings generated
- ✅ Frontend API client ready
- ✅ Ready for Day 3: Search interface implementation

---

## **DAY 3: Service Idea Matching System**

### Backend Matching Implementation
- [ ] Create `ai/service_matcher.py`:
  - `generate_service_embedding()` method
  - Create comprehensive text from service idea
  - Generate embedding vector
  - `calculate_semantic_similarity()` method
  - Cosine similarity between vectors
  - `match_service_to_grant()` method
  - Use GPT-4 for deep analysis
  - Compare service vs grant intent
  - Generate reasoning and recommendations
- [ ] Create `SERVICE_GRANT_MATCHING_PROMPT` in prompts.py:
  - Structured JSON output
  - Fields: alignment_score, similarity_score, match_reasoning, why_fits, concerns, decision_recommendation, recommended_effort, win_probability, next_steps, reframing_needed

### Service Idea Endpoints
- [ ] Create `routers/service_ideas.py`
- [ ] Implement endpoints:
  - `POST /api/service-ideas` (create service idea)
  - `GET /api/service-ideas` (list all)
  - `GET /api/service-ideas/{id}/matches` (find matching grants)
  - `POST /api/service-ideas/{id}/analyze-match/{grant_id}` (deep match analysis)
- [ ] Create Pydantic models:
  - `ServiceIdeaCreate` (input validation)
  - `ServiceIdeaResponse` (output format)
- [ ] Background task: `generate_service_embedding()`
  - Generate embedding after service idea creation
  - Save to database
- [ ] Background task: `run_match_analysis()`
  - Fetch service, grant, intent profile
  - Calculate similarity
  - Run AI matching
  - Save match result to database

### Vector Search Implementation
- [ ] Implement semantic search in matches endpoint:
  - Use pgvector cosine similarity operator `<=>`
  - Raw SQL query for vector search
  - Order by similarity (closest first)
  - Limit to top N results
- [ ] Return matches with:
  - Grant basic info
  - Similarity score
  - Match analysis (if exists)
  - Placeholder if analysis needed

### Frontend Search Interface & Match Results
- [ ] Install shadcn components: `input`, `textarea`, `label`, `collapsible`, `badge`, `card`, `button`, `skeleton`, `alert`
- [ ] Create `QueryInput.tsx`:
  - Large, prominent textarea (4-6 rows)
  - Required field
  - Character count indicator
  - Placeholder: "Describe your service idea... (e.g., I want to increase capacity for elderly care services)"
- [ ] Create `OptionalFields.tsx`:
  - Collapsible section (default: collapsed)
  - Trigger button: "Add more details for better matches (optional)"
  - Contains optional fields:
    - Estimated Cost (number input with $ prefix)
    - Timeline in months (number input)
    - Target Beneficiaries (textarea, 2 rows)
    - Expected Outcomes (textarea, 2 rows)
- [ ] Create `SearchForm.tsx`:
  - React Hook Form setup
  - Zod validation schema (query required, others optional)
  - Integrates QueryInput + OptionalFields
  - Submit handler:
    - Call `serviceIdeasApi.create()` with query as title/description
    - Show loading state
    - Navigate to `/matches?id={serviceIdeaId}`
  - Error handling
- [ ] Create `app/dashboard/page.tsx`:
  - Hero section with title and description
  - SearchForm component (centered, max-width)
  - Clean, focused design
- [ ] Create `MatchScore.tsx`:
  - Visual score indicator (colored badge or progress bar)
  - Color coding: green (80%+), yellow (60-80%), gray (<60%)
  - Show percentage prominently
- [ ] Create `MatchCard.tsx`:
  - Display grant info (title, source, funding, deadline)
  - Integrate MatchScore component
  - Match reasoning section with "Why this matches" heading
  - "Why This Fits" list
  - "Potential Concerns" list
  - Decision recommendation badge
  - Collapsible section at bottom for AI Explainer (integrated)
- [ ] Create `MatchList.tsx`:
  - Takes array of GrantMatch objects
  - Sorts by similarity_score descending
  - Renders MatchCard for each match
  - Grid or stacked responsive layout
- [ ] Create `LoadingSpinner.tsx`:
  - Center-aligned spinner
  - Optional loading text ("Finding matching grants...")
- [ ] Create `EmptyState.tsx`:
  - Shows when no matches found
  - Helpful message and suggestions
  - "New Search" button
- [ ] Create `app/matches/page.tsx`:
  - Get serviceIdeaId from URL query params
  - Fetch matches using `serviceIdeasApi.getMatches(id)`
  - Show LoadingSpinner while fetching
  - Display search query at top (optional)
  - Render MatchList with results
  - Show match count: "Found X matching grants"
  - "New Search" button to go back
  - Handle errors and empty state
- [ ] Update API client with service methods:
  - `serviceIdeasApi.create()`
  - `serviceIdeasApi.getAll()` (for history)
  - `serviceIdeasApi.getMatches(id)`
  - `serviceIdeasApi.analyzeMatch(ideaId, grantId)` (for explainer)

**End of Day 3:**
- ✅ Service idea creation working
- ✅ Semantic search returning relevant grants
- ✅ AI match analysis providing reasoning
- ✅ Match results displayed with recommendations
- ✅ Full workflow: idea → matches → decisions

---

## **DAY 4: Sidebar Navigation & Search History**

### Backend Search History Endpoint (Optional)
- [ ] Add endpoint to `routers/service_ideas.py`:
  - `GET /api/service-ideas` (list all service ideas with pagination)
  - Return: id, title (query), created_at, match_count
  - Order by created_at descending (most recent first)
- [ ] Add created_at timestamp to ServiceIdea model if not exists

### Frontend Sidebar & Navigation
- [ ] Install shadcn components: `scroll-area`, `separator`, `dropdown-menu`
- [ ] Create `useSearchHistory.ts` hook:
  - Fetch search history from API: `GET /api/service-ideas`
  - Or use localStorage for client-side persistence
  - Methods: getHistory(), addToHistory(serviceIdea), clearHistory()
- [ ] Create `SearchHistoryItem.tsx`:
  - Display service idea title/query (truncated)
  - Show timestamp (relative: "2 hours ago")
  - Show match count if available
  - Click handler to navigate to `/matches?id={id}`
  - Hover effect
- [ ] Create `Sidebar.tsx`:
  - Logo/branding at top
  - "New Search" button (navigates to `/dashboard`)
  - Search history section:
    - Heading: "Recent Searches"
    - Scrollable list of SearchHistoryItem components
    - Show latest 10 searches
    - Empty state: "No searches yet"
  - Fixed width (250-300px)
  - Collapsible on mobile
- [ ] Update `app/layout.tsx`:
  - Integrate Sidebar component
  - Create flex layout: Sidebar (fixed) + Main content (flex-1)
  - Ensure Sidebar persists across all pages
  - Add mobile menu toggle
- [ ] Update `app/dashboard/page.tsx`:
  - Ensure SearchForm updates history on submission
  - Call `addToHistory()` after service idea created
- [ ] Update `app/matches/page.tsx`:
  - Highlight current search in sidebar if visible
  - Add breadcrumb or back button

### Polish & Responsive Design
- [ ] Responsive sidebar:
  - Desktop: Always visible, fixed width
  - Tablet: Collapsible with toggle button
  - Mobile: Drawer/modal overlay
- [ ] Polish UI consistency:
  - Consistent spacing and padding
  - Typography hierarchy
  - Color scheme (primary, secondary, accent)
  - Button styles
  - Card styles
  - Hover and focus states

### Loading States & Error Handling
- [ ] Create skeleton loaders:
  - Skeleton for SearchHistoryItem
  - Skeleton for MatchCard
- [ ] Add loading states to all pages
- [ ] Add error handling to all API calls
- [ ] Add empty states with helpful messages

**End of Day 4:**
- ✅ Sidebar navigation working
- ✅ Search history displaying recent searches
- ✅ Can navigate between searches easily
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Consistent UI/UX
- ✅ Loading and error states handled

---

## **DAY 5: Grant Intent Explainer & Advanced Features**

### Backend Explainer Implementation
- [ ] Create `ai/grant_explainer.py`:
  - `explain_grant()` method
  - Takes grant + intent + question
  - Formats comprehensive context
  - Calls GPT-4 for nuanced answer
  - Returns natural language explanation
  - `compare_grants()` method
  - Takes multiple grants
  - Comparison criteria
  - Returns structured comparison
- [ ] Create system prompts for explainer:
  - Expert grant advisor persona
  - Honest and analytical tone
  - Specific, actionable insights
  - Reference concrete elements

### Explainer Endpoints
- [ ] Create `routers/explainer.py`
- [ ] Implement endpoints:
  - `POST /api/grants/{id}/explain` (ask question about grant)
  - `POST /api/grants/compare` (compare multiple grants)
- [ ] Request models:
  - `ExplainerRequest` (question field)
  - `CompareRequest` (grant_ids, criteria)
- [ ] Response includes:
  - Question asked
  - AI-generated answer
  - Grant context used

### Frontend AI Explainer Integration (Under Each Grant)
- [ ] Create `GrantExplainer.tsx`:
  - Integrated into MatchCard as collapsible section
  - Trigger button: "Ask questions about this grant"
  - When expanded:
    - Question input textarea (3-4 rows)
    - Quick question buttons:
      - "Why would this grant reject applications?"
      - "What type of organization is this really for?"
      - "How flexible are their KPIs actually?"
      - "Can a small pilot project get funded?"
      - "What makes a winning application?"
    - "Get Answer" button
    - Answer display section (appears below after response)
    - Loading state during AI processing
  - Can ask multiple questions without closing
  - Each Q&A pair stacks in conversation style
- [ ] Update `MatchCard.tsx`:
  - Add collapsible section at bottom
  - Integrate GrantExplainer component
  - Pass grant ID and basic grant info
  - Default: collapsed
  - Badge indicator: "AI Advisor Available"
- [ ] Update API client:
  - `explainerApi.explain(grantId, question)`:
    - POST request to `/api/grants/{id}/explain`
    - Request body: { question: string }
    - Response: { question, answer, grant_context }
  - Store Q&A history in component state (don't persist)

### UI Enhancements
- [ ] Add smooth transitions to buttons
- [ ] Add hover states to cards
- [ ] Add active states to buttons
- [ ] Improve typography hierarchy
- [ ] Add subtle animations
- [ ] Test responsive design on mobile
- [ ] Add tooltips where helpful

**End of Day 5:**
- ✅ Grant detail page with full intent analysis
- ✅ AI Q&A working for any grant
- ✅ Users can ask custom questions
- ✅ Nuanced, contextual answers provided
- ✅ UI polished and professional

---

## **DAY 6: Sample Data, Testing & Refinement**

### Sample Data Generation
- [ ] Create `scripts/generate_sample_data.py`:
  - Generate 5 realistic grants
  - Different sources (AIC, NCSS, MSF, NVPC)
  - Varied funding ranges ($20K-$500K)
  - Different focus areas
  - Realistic deadlines (next 45-120 days)
  - Comprehensive raw content
  - Different grant durations
- [ ] Sample grants to include:
  - Digital adoption grant
  - Workforce training grant
  - Innovation/pilot grant
  - Infrastructure grant
  - Volunteer management grant
- [ ] Clear existing data before generating
- [ ] Print confirmation after generation
- [ ] Instructions for next steps

### Demo Data Setup
- [ ] Create `scripts/setup_demo_data.py`:
  - 3 pre-configured service ideas
  - Ideas that match well with sample grants
  - Varied focus (digital, training, innovation)
  - Different budget ranges
  - Clear expected outcomes
- [ ] Create `scripts/setup_demo.sh`:
  - Run sample data generator
  - Start FastAPI server
  - Trigger bulk grant analysis
  - Wait for completion
  - Print success message

### Testing Implementation
- [ ] Create `tests/test_full_workflow.py`:
  - Test API health check
  - Test fetching grants
  - Test grant analysis
  - Test intent profile retrieval
  - Test service idea creation
  - Test getting matches
  - Test match analysis
  - Test explainer
  - Test dashboard stats
- [ ] Create `TESTING_CHECKLIST.md`:
  - Backend API endpoints
  - Frontend pages
  - Navigation
  - User workflows
  - Edge cases
  - Performance checks
- [ ] Run through complete testing checklist
- [ ] Fix all identified bugs
- [ ] Optimize slow queries
- [ ] Add missing error handling

### Bug Fixes & Optimization
- [ ] Check CORS configuration
- [ ] Verify database indexes
- [ ] Test with various input sizes
- [ ] Handle empty states properly
- [ ] Test error scenarios
- [ ] Verify loading states work
- [ ] Check responsive design
- [ ] Test on different browsers
- [ ] Optimize API response times
- [ ] Check memory usage

### Documentation
- [ ] Create comprehensive README.md:
  - Project description
  - Problem statement
  - Solution overview
  - Features list
  - Tech stack
  - Setup instructions
  - Usage guide
  - Architecture diagram
- [ ] Create `.env.example` files
- [ ] Document API endpoints
- [ ] Add code comments where needed
- [ ] Create deployment guide (optional)

**End of Day 6:**
- ✅ Realistic sample data loaded
- ✅ All features tested and working
- ✅ Bugs fixed
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ Ready for demo

---

## **DAY 7: Demo Preparation & Final Polish**

### Demo Preparation
- [ ] Create `DEMO_SCRIPT.md`:
  - 5-minute presentation flow
  - Introduction (30s)
  - Problem statement (30s)
  - Dashboard overview (45s)
  - Service idea creation (60s)
  - Match results walkthrough (90s)
  - Grant explainer demo (60s)
  - Impact & value prop (30s)
  - Technical highlights (30s)
  - Q&A preparation
- [ ] Prepare demo environment:
  - Fresh database with sample data
  - 5 analyzed grants
  - 2-3 service ideas with matches
  - Clear browser cache
  - Bookmark key pages
  - Test run multiple times
- [ ] Create backup plan:
  - Screenshots of key features
  - Video recording of demo (optional)
  - Local demo environment ready
- [ ] Practice demo multiple times:
  - Time each section
  - Smooth transitions
  - Handle potential errors
  - Prepare for questions

### Presentation Materials
- [ ] Create `PRESENTATION_OUTLINE.md`:
  - Slide 1: Title
  - Slide 2: The Problem
  - Slide 3: The Insight
  - Slide 4: Our Solution
  - Slide 5: How It Works
  - Slide 6: Demo
  - Slide 7: Key Differentiators
  - Slide 8: Impact
  - Slide 9: Technical Highlights
  - Slide 10: Future Vision
  - Slide 11: Thank You
- [ ] Design slides (PowerPoint/Google Slides/Canva):
  - Professional design
  - Minimal text
  - Key visuals
  - Architecture diagram
  - Screenshots of UI
- [ ] Prepare demo talking points
- [ ] Prepare answers to likely questions

### Final Polish
- [ ] UI improvements:
  - Check all spacing is consistent
  - Verify color scheme coherent
  - Test all animations smooth
  - Ensure proper contrast
  - Check mobile responsiveness
- [ ] Add final touches:
  - Favicon
  - Better empty states
  - Helpful tooltips
  - Improved error messages
  - Loading indicators everywhere
- [ ] Performance check:
  - Pages load <3 seconds
  - API responses <30 seconds
  - No console errors
  - No memory leaks
- [ ] Content review:
  - Fix any typos
  - Improve button labels
  - Clear call-to-actions
  - Helpful placeholder text

### Deployment (Optional but Recommended)
- [ ] Backend deployment to Railway/Render:
  - Create Procfile
  - Set environment variables
  - Deploy and test
- [ ] Frontend deployment to Vercel:
  - Configure build settings
  - Set environment variables
  - Deploy and test
- [ ] Database on Neon:
  - Ensure pgvector enabled
  - Load sample data
  - Test connections
- [ ] Test production deployment:
  - All features working
  - No CORS issues
  - API connected
  - Performance acceptable

### Pre-Demo Checklist
- [ ] Demo environment ready
- [ ] Sample data loaded and verified
- [ ] All features tested and working
- [ ] Demo script practiced
- [ ] Presentation slides complete
- [ ] Backup plan prepared
- [ ] Team knows their roles
- [ ] Time management planned
- [ ] Q&A responses prepared
- [ ] Confident and ready!

**End of Day 7:**
- ✅ Demo script perfected
- ✅ Presentation ready
- ✅ UI polished
- ✅ Everything tested
- ✅ Backup plans ready
- ✅ Team ready to present
- ✅ **READY TO WIN! 🏆**

---

## 🎯 Final Pre-Demo Checklist

### Must-Have Working:
**Search Flow:**
- [ ] Landing page (`/dashboard`) loads with clean search interface
- [ ] Can enter query (required) + optional fields
- [ ] Form submission creates service idea and redirects to matches
- [ ] Matches page displays grants sorted by similarity score
- [ ] Match reasoning displays for each grant
- [ ] Matching scores shown prominently with color coding
- [ ] Mini AI explainer works under each grant (collapsible)

**Grants Browse:**
- [ ] Grants page (`/grants`) displays all available grants in grid
- [ ] Can filter and sort grants
- [ ] Can click any grant to view detail page
- [ ] Grant detail page (`/grants/[id]`) shows full information
- [ ] Intent analysis displays on grant detail
- [ ] Full AI explainer works on grant detail (with conversation history)

**History:**
- [ ] History page (`/history`) shows all past searches
- [ ] Each history item shows query, timestamp, match count
- [ ] Can click any history item to revisit matches

**Navigation:**
- [ ] Sidebar navigation works across all pages
- [ ] Active page highlighted in navigation
- [ ] Can navigate: Dashboard → Grants → History → back
- [ ] UI looks professional and responsive on all pages

### Demo Flow Ready:
- [ ] Can quickly enter new search query on dashboard
- [ ] Can show pre-loaded matches with various scores
- [ ] Can demonstrate mini AI explainer on match card
- [ ] Can navigate to grant detail page from match
- [ ] Can demonstrate full AI explainer on grant detail
- [ ] Can browse all grants on /grants page
- [ ] Can filter/sort grants
- [ ] Can view search history on /history page
- [ ] Can navigate to previous search from history
- [ ] Can explain technical architecture (vector search, embeddings, AI reasoning, intent analysis)
- [ ] Can articulate value proposition (discovery + matching + insights + decision support)

### Presentation Ready:
- [ ] Slides complete
- [ ] Demo script practiced
- [ ] Team roles assigned
- [ ] Time management planned
- [ ] Q&A prepared
- [ ] Backup screenshots ready

---

## 🚀 Key Success Factors

1. **Focus on the core insight**: This is a decision-making problem, not a search problem
2. **Show, don't tell**: Let the demo speak for itself with multiple user flows
3. **Emphasize uniqueness**: Intent understanding, not just matching
4. **Comprehensive platform**: Search, browse, history, and deep insights all in one place
5. **Demonstrate impact**: Time saved + better decisions + grant discovery = clear ROI
6. **Technical depth**: Show off vector search, AI analysis, structured outputs, conversational AI
7. **Professional polish**: Clean UI with intuitive navigation matters for credibility

## 🎯 What Makes This Special

**Beyond Simple Matching:**
- Not just "search and filter" - we understand grant intent
- Not just similarity scores - we explain why grants match
- Not just results - we help you understand each grant deeply
- Not just one-time search - track history and browse all grants

**AI-Powered Intelligence:**
- Vector embeddings for semantic search
- Intent analysis reveals hidden grant requirements
- Match reasoning explains the "why" behind scores
- Conversational AI answers specific questions about grants

**Complete Platform:**
- **Search Flow**: Natural language → matched grants
- **Browse Flow**: Discover grants you didn't know existed
- **Detail Flow**: Deep dive into any grant with AI assistance
- **History Flow**: Track and revisit past searches

This is a complete grant discovery and decision support platform, not just a search tool.
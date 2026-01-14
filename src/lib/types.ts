// TypeScript interfaces for Grant Intent Advisor

export interface Grant {
  id: string;  // UUID string
  title: string;  // Exact grant title with proper casing
  description: string;  // Short 1-2 sentence summary
  embedding?: number[];  // Optional: Vector embedding (not typically used in frontend)
  grant_url: string | null;

  // Content fields
  about_grant: string | null;
  full_description: string | null;

  // Eligibility & Funding
  who_can_apply: string | null;
  funding_info: string | null;
  application_status: string | null;

  // Application Process
  how_to_apply: string | null;
  when_can_apply: string | null;
  documents_required: string | null;  // JSON string with {text, items, links}

  // Metadata & Links
  links: string[];  // Array of URLs to document downloads
  metadata?: any;  // JSONB from scraper
}

// Helper type for parsed documents_required field
export interface ParsedDocuments {
  text: string;
  items: string[];
  links: string[];
}

// Types for results architecture
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
  similarity_score: number;  // From vector search (0-1)
  match_score: number;  // From LLM (0-100)
  match_reasoning: string;
  why_fits: string[];
  concerns: string[];
  decision_recommendation: 'APPLY' | 'WATCH' | 'SKIP';
  win_probability: number;  // 0.0-1.0
  // Populated on frontend/API response
  grant?: Grant;
}

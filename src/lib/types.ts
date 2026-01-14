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

  created_at?: string;
  updated_at?: string;
}

// Helper type for parsed documents_required field
export interface ParsedDocuments {
  text: string;
  items: string[];
  links: string[];
}

export interface GrantIntentProfile {
  id: number;
  grant_id: number;
  primary_intent: string;
  focus_areas: string[];
  philosophical_stance: {
    values: string[];
    priorities: string[];
    approach: string;
  };
  ideal_applicant: {
    organization_type: string[];
    size: string;
    experience_level: string;
    characteristics: string[];
  };
  kpi_nature: {
    type: string;
    flexibility: string;
    expectations: string[];
  };
  realistic_project: {
    scope: string;
    timeline: string;
    budget_range: string;
    examples: string[];
  };
  potential_concerns: string[];
  application_tips: string[];
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceIdea {
  id: number;
  title: string;
  description: string;
  estimated_cost?: number;
  timeline_months?: number;
  target_beneficiaries?: string;
  expected_outcomes?: string;
  created_at: string;
  updated_at: string;
}

export interface GrantMatch {
  id: number;
  service_idea_id: number;
  grant_id: string;  // UUID string to match Grant.id
  similarity_score: number;
  alignment_score?: number;
  match_reasoning?: string;
  why_fits?: string[];
  concerns?: string[];
  decision_recommendation?: 'APPLY' | 'WATCH' | 'SKIP';
  recommended_effort?: 'LOW' | 'MEDIUM' | 'HIGH';
  win_probability?: number;
  next_steps?: string[];
  reframing_needed?: boolean;
  created_at: string;
  updated_at: string;
  // Related data
  grant?: Grant;
  service_idea?: ServiceIdea;
  grant_intent_profile?: GrantIntentProfile;
}

// TypeScript interfaces for Grant Intent Advisor

export interface Grant {
  id: number;
  title: string;
  source: string;
  description: string;
  funding_min?: number;
  funding_max?: number;
  deadline?: string;
  duration_months?: number;
  raw_content: string;
  url?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'UPCOMING';
  created_at: string;
  updated_at: string;
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
  grant_id: number;
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

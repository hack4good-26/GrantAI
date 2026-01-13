import { Grant, GrantMatch, ServiceIdea } from "./types";

export const MOCK_GRANTS: Grant[] = [
  {
    id: 1,
    title: "Digital Transformation Grant for Non-Profits",
    source: "NCSS",
    description: "Support for social service agencies to adopt digital solutions to improve productivity and service delivery.",
    funding_min: 10000,
    funding_max: 50000,
    deadline: "2026-06-30",
    duration_months: 12,
    raw_content: "Full details about digital transformation...",
    status: "ACTIVE",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z"
  },
  {
    id: 2,
    title: "Community Impact Fund",
    source: "Toteboard",
    description: "Funding for projects that meet community needs and create positive social impact.",
    funding_min: 5000,
    funding_max: 100000,
    deadline: "2026-12-31",
    duration_months: 24,
    raw_content: "Full details about community impact...",
    status: "ACTIVE",
    created_at: "2026-01-05T00:00:00Z",
    updated_at: "2026-01-05T00:00:00Z"
  },
  {
    id: 3,
    title: "Youth Mental Health Initiative",
    source: "MOH",
    description: "Grants for programs targeting youth mental wellness and preventive care.",
    funding_min: 20000,
    funding_max: 80000,
    deadline: "2026-09-15",
    duration_months: 18,
    raw_content: "Full details about youth mental health...",
    status: "ACTIVE",
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z"
  },
  {
    id: 4,
    title: "Elderly Care Innovation Grant",
    source: "AIC",
    description: "Supporting innovative approaches to elderly care and active aging in the community.",
    funding_min: 50000,
    funding_max: 200000,
    deadline: "2026-05-20",
    duration_months: 36,
    raw_content: "Full details about elderly care...",
    status: "ACTIVE",
    created_at: "2026-01-12T00:00:00Z",
    updated_at: "2026-01-12T00:00:00Z"
  },
  {
    id: 5,
    title: "Arts for All Fund",
    source: "NAC",
    description: "Promoting inclusivity in the arts sector for persons with disabilities.",
    funding_min: 5000,
    funding_max: 25000,
    deadline: "2026-04-01",
    duration_months: 6,
    raw_content: "Full details about arts for all...",
    status: "ACTIVE",
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z"
  },
  {
    id: 6,
    title: "Sustainability Start-up Grant",
    source: "ESG",
    description: "For new initiatives focusing on environmental sustainability and green practices.",
    funding_min: 15000,
    funding_max: 60000,
    deadline: "2026-08-30",
    duration_months: 12,
    raw_content: "Full details about sustainability...",
    status: "ACTIVE",
    created_at: "2026-01-20T00:00:00Z",
    updated_at: "2026-01-20T00:00:00Z"
  },
  {
    id: 7,
    title: "Volunteer Capability Building",
    source: "NVPC",
    description: "Training and systems to manage and retain volunteers effectively.",
    funding_min: 8000,
    funding_max: 30000,
    deadline: "2026-07-15",
    duration_months: 12,
    raw_content: "Full details about volunteer capability...",
    status: "ACTIVE",
    created_at: "2026-01-22T00:00:00Z",
    updated_at: "2026-01-22T00:00:00Z"
  }
];

export const MOCK_HISTORY: ServiceIdea[] = [
  {
    id: 101,
    title: "Mental health workshops for teenagers",
    description: "A series of workshops in schools...",
    estimated_cost: 15000,
    timeline_months: 6,
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-01-20T10:00:00Z"
  },
  {
    id: 102,
    title: "Digital literacy for seniors",
    description: "Teaching seniors how to use smartphones...",
    estimated_cost: 25000,
    timeline_months: 12,
    created_at: "2026-01-18T14:30:00Z",
    updated_at: "2026-01-18T14:30:00Z"
  },
  {
    id: 103,
    title: "Community garden project",
    description: "Setting up a garden in the neighborhood...",
    estimated_cost: 5000,
    timeline_months: 3,
    created_at: "2026-01-15T09:15:00Z",
    updated_at: "2026-01-15T09:15:00Z"
  }
];

export const MOCK_MATCHES: GrantMatch[] = [
  {
    id: 1,
    service_idea_id: 101,
    grant_id: 3,
    similarity_score: 0.95,
    match_reasoning: "This grant specifically targets youth mental wellness, which aligns perfectly with your workshop goals.",
    grant: MOCK_GRANTS[2],
    decision_recommendation: "APPLY",
    created_at: "2026-01-20T10:05:00Z",
    updated_at: "2026-01-20T10:05:00Z"
  },
  {
    id: 2,
    service_idea_id: 101,
    grant_id: 2,
    similarity_score: 0.82,
    match_reasoning: "While broad, the Community Impact Fund supports projects meeting community needs, which your workshops address.",
    grant: MOCK_GRANTS[1],
    decision_recommendation: "APPLY",
    created_at: "2026-01-20T10:05:00Z",
    updated_at: "2026-01-20T10:05:00Z"
  },
  {
    id: 3,
    service_idea_id: 101,
    grant_id: 5,
    similarity_score: 0.45,
    match_reasoning: "This grant is for arts inclusivity, which may not directly relate to mental health workshops unless an arts component is added.",
    grant: MOCK_GRANTS[4],
    decision_recommendation: "SKIP",
    created_at: "2026-01-20T10:05:00Z",
    updated_at: "2026-01-20T10:05:00Z"
  }
];

export const MOCK_CHAT_HISTORY = [
  { role: "user", content: "What are the key KPIs for this grant?" },
  { role: "assistant", content: "For the Youth Mental Health Initiative, key KPIs typically include the number of youths engaged (target: 200+), percentage of participants reporting improved well-being (target: 75%), and number of follow-up sessions conducted." }
];

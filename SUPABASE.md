This documentation describes the schema for the `grants` table in the Supabase database. This data is populated by a scraper and is designed to support both standard queries and semantic (AI) searches.

---

## Core Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | UUID | Unique identifier for each grant record. |
| `title` | String | Title of the grant name |
| `embedding` | Vector | A 3072-dimension vector (Gemini/similar) representing the grant content for semantic search. |
| `grant_url` | String | The direct URL to the official grant page. |

---

## Grant Content

| Field | Type | Description |
| --- | --- | --- |
| `description` | String | A short, one-to-two sentence summary of what the grant offers. |
| `about_grant` | String | A more detailed overview of the grant's goals and project requirements. |
| `full_description` | String | The complete text extracted from the source page, containing all relevant details. |

---

## Eligibility & Funding

| Field | Type | Description |
| --- | --- | --- |
| `who_can_apply` | String | Eligibility criteria (e.g., age range, citizenship, type of organization). |
| `funding_info` | String | Details on the funding amount, caps, and percentage of project costs covered. |
| `application_status` | String | Current status (e.g., "Open for Applications") and the target audience type. |

---

## Application Process

| Field | Type | Description |
| --- | --- | --- |
| `how_to_apply` | String | Step-by-step instructions and estimated time to complete the application. |
| `when_can_apply` | String | Deadlines or timeline requirements (e.g., "3 months before project start"). |
| `documents_required` | String | A detailed list of forms, templates, and IDs required for submission. |

---

## Metadata & Links

| Field | Type | Description |
| --- | --- | --- |
| `links` | Array | A list of URLs for downloadable forms (e.g., `.docx`, `.xlsx`, `.pdf`). |
| `metadata` | JSONB | The raw object from the scraper containing the original page title, URL, and nested description fields. |

---

> **Note for Developers**:
> Most fields are stored as `text` to maintain the formatting (bullet points, newlines) of the original source. Use the `embedding` field with the `pgvector` extension for RAG-based search queries.

Would you like me to generate a TypeScript interface or a Zod schema based on this documentation to use in your Next.js frontend?
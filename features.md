# Features & Status

A quick snapshot of platform capabilities, progress, and next steps.

## Features status

| Feature | Status | % Done |
|---|---|---|
| Core scaffold (Next.js + Tailwind + Inter + black/neon theme) | Implemented | 100% |
| Architecture/README | Complete | 100% |
| Email templating (React Email) + example template + send endpoint | MVP | 70% |
| Resend integration (send + webhook skeleton) | In progress | 60% |
| Shopify Admin GraphQL client (fetch-based) | Wrapper only | 40% |
| Shopify data sync (customers, products, orders) + webhook handlers | Planned | 10% |
| Supabase schema & migrations | Spec’d in README | 20% |
| Segment builder (JSON → SQL) & materializer | Planned | 0% |
| Kanban board UI (drag/drop, swimlanes, statuses) | Prototype tiles | 20% |
| Delivery analytics (events ingestion, dashboards) | Planned | 0% |
| Security & compliance (RLS, suppression, unsubscribe) | Partial (docs) | 10% |
| Jobs/Cron (sync, segment refresh, scheduled sends) | Planned | 0% |
| Linting/TypeScript/CI | Basic lint + TS | 20% |


## To-do

- Database & migrations
  - Create Supabase migrations for tables in README (`campaigns`, `email_templates`, `campaign_emails`, `segments`, `segment_members`, `shopify_customers`, `shopify_products`, `shopify_orders`, `email_sends`, `email_events`).
  - Add RLS policies and roles; seed initial data.
- Shopify integration
  - Implement sync jobs for customers, products, orders (nightly + on-demand).
  - Finish webhook handlers for `customers/*`, `products/*`, `orders/*` with retry and idempotency.
- Segmentation
  - Define JSON rule schema; implement compiler to SQL and materializer job into `segment_members`.
  - Add manual refresh + scheduled refresh.
- Email pipeline
  - Add unsubscribe link and preference center (per-campaign and global suppression lists).
  - Verify Resend webhooks (signature) and persist events to `email_events`.
  - Add metrics aggregation (delivered, opens, clicks, bounces, complaints, unsubscribes).
- Kanban UI
  - Implement board with columns: Backlog → Plan → Build → QA → Approve → Scheduled → Sent → Analyze.
  - Add swimlanes for funnel: Awareness | Acquisition | Conversion | Care.
  - Card details: subject, segment(s), schedule, owner, links to drafts and dashboards.
- Background jobs
  - Vercel Cron for nightly sync + segment refresh + scheduled sends.
  - Queue-based batch send with rate limiting and retries.
- Security & compliance
  - Enforce RLS on user-facing tables; minimize PII; HMAC verify all webhooks.
  - Add rate limiting to API routes; implement suppression enforcement.
- DX & quality
  - Add Prettier, stricter ESLint rules, and CI workflow.
  - Add unit tests for segment compiler; integration tests for API routes.


## Recommendations

- Design system
  - Keep tokens as the source of truth; emit CSS variables for app and inline styles for emails.
  - Maintain the Inter + black theme with neon accents for strong brand contrast.
- Data & segments
  - Start with tag- and recency-based rules; expand to RFM or product-type segmentation over time.
  - Materialize segments for fast send-time resolution; track versioning of segment definitions.
- Deliverability
  - Configure Resend DKIM + custom tracking domain; add auto-suppression on bounces/complaints.
  - Warm up new sender domains gradually; start with smaller sends.
- Observability
  - Store raw webhook events in `email_events`; build a dashboard for deliverability and CTR.
  - Add structured logs for syncs and sends.
- DevOps
  - Manage DB via Supabase migrations (or MCP); keep schema changes reviewable.
  - Use Vercel environments (Preview/Prod) with separate Supabase projects/branches.

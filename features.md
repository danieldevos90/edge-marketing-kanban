# Features & Status

A quick snapshot of platform capabilities, progress, and next steps.

## Features status

| Feature | Status | % Done |
|---|---|---|
| Core scaffold (Next.js + Tailwind + Inter + black/neon theme) | Implemented | 100% |
| Architecture/README | Complete | 100% |
| Email templating (React Email) + example template + send endpoint | MVP | 70% |
| Resend integration (send + webhook skeleton) | In progress | 60% |
| Resend previous emails listing (filters: subject/from/date) | Implemented API + UI | 70% |
| Shopify Admin GraphQL client (fetch-based) | Wrapper only | 40% |
| Shopify data sync (customers, products, orders) + webhook handlers | Planned | 10% |
| Supabase schema & migrations | Spec’d in README | 20% |
| Segment builder (JSON → SQL) & materializer | Planned | 0% |
| Kanban board UI (drag/drop, swimlanes, statuses) | Prototype + controls | 35% |
| Delivery analytics (events ingestion, dashboards) | Planned | 0% |
| Security & compliance (RLS, suppression, unsubscribe) | Partial (docs) | 10% |
| Jobs/Cron (sync, segment refresh, scheduled sends) | Planned | 0% |
| Linting/TypeScript/CI | Basic lint + TS | 20% |


## To-do

- Resend
  - Verify list endpoint support and extend filters (status, tags) if available.
  - Persist events and sends into Supabase for richer analytics and history.
- Database & migrations
  - Create Supabase migrations for tables in README and add RLS policies.
- Shopify integration
  - Implement sync jobs for customers, products, orders (nightly + on-demand) and finish webhooks.
- Segmentation
  - Define JSON rule schema; implement compiler to SQL and materializer job into `segment_members`.
- Email pipeline
  - Add unsubscribe link and preference center; verify Resend webhooks signature and persist events.
- Kanban UI
  - Add board drag/drop, card detail drawer, and phase/status editing.
- Background jobs
  - Vercel Cron for nightly sync + segment refresh + scheduled sends.
- DX & quality
  - Add Prettier, stricter ESLint, and CI workflow with type/lint checks.


## Recommendations

- Keep the black theme with neon accents; ensure AA+ contrast in emails.
- Start with subject/from/date filters; iterate to segments/status once DB is wired.
- Record all sends locally (Supabase) to own analytics and not depend on external listing APIs.

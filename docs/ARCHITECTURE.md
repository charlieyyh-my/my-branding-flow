# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) — deployed on Vercel
- **Database & Auth:** Supabase (Postgres + RLS + Storage)
- **Styling:** Tailwind CSS
- **File assets:** Supabase Storage (URLs stored in `marketing_assets.file_url`)

## Now vs Later
| Now (v1) | Later |
|---|---|
| Content CRUD + approval workflow | Social API publishing |
| Calendar week view | AI caption drafting |
| Campaign + theme tracking | Cross-platform analytics pull |
| Asset library (URL-based) | Automated publish reminders |
| Keywords bank, brand guidelines | SEO gap scoring |
| Leads log, dashboard | Per-user RLS lock-down |

## Key Action Flow — Publish One Piece of Content
1. **Capture** — Creator fills content item form (title, platform, copy, campaign, theme, scheduled date)
2. **Store** — Form submits to `content_items` table; status defaults to `draft`
3. **Show** — Content item appears on the calendar and in the "Draft" column of the dashboard
4. **Advance** — Creator sets status to `in_review`; Approver sees it in the Pending Approvals list
5. **Approve** — Approver sets status to `approved`; action written to `audit_logs`
6. **Publish** — Creator adds `published_url`, sets status to `published`; item moves to Published column
7. **Learn** — Performance figures entered in `social_performance`; enquiries logged in `leads_enquiries`

## Layer Sequencing
1. **Data layer** — tables, constraints, seed data, open RLS (Sprint 1)
2. **App logic** — CRUD forms, status machine, calendar, dashboard (Sprints 1–3)
3. **Smart features** — AI caption drafting, keyword scoring (Sprint 5+)

The core approval and publishing workflow runs entirely on Postgres queries. No AI dependency.

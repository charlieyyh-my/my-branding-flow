# PRD — BrandOS (Century Mark Pacific Marketing)

## Problem
The Sales & Marketing and Content & Social Media teams have no single system to plan, create, approve, publish, and distribute branded content consistently. Messaging drifts across platforms, approvals happen in chat threads, and there is no audit trail linking content to campaigns or enquiries.

## Target Users
- **Brand Manager** — owns campaigns, approves content, reviews performance
- **Content Creator** — creates and submits content items for approval
- **Approver** — reviews and advances content through the approval workflow
- **Viewer** — read-only access to calendar and brand guidelines

## Core Objects
`campaigns` · `weekly_themes` · `content_items` · `marketing_assets` · `seo_keywords` · `brand_guidelines` · `leads_enquiries` · `social_performance` · `audit_logs`

## MVP Must-Haves
- [ ] Content item form: title, platform, copy, campaign, weekly theme, scheduled date, status
- [ ] Approval workflow: Draft → In Review → Approved → Published
- [ ] Content calendar — week grid by date and platform
- [ ] Campaign tracker with linked content count
- [ ] Weekly theme planner with guiding message
- [ ] Marketing assets library (upload URL, type, campaign tag)
- [ ] SEO & AI search keyword bank
- [ ] Brand guidelines reference panel
- [ ] Leads & enquiries log
- [ ] Operational dashboard: this week's content by status, pending approvals, active campaigns
- [ ] All screens render with seed data; no login wall in v1

## Non-Goals (v1)
CRM, inventory, finance, HR, e-commerce, marketing automation, AI chatbot, social API publishing, advanced analytics, multi-tenant access.

## Success Criteria
**End-to-end scenario:** A Content Creator opens the app, creates a new Instagram post linked to the "CNY Heritage Series" campaign and this week's theme, submits it for review, the Brand Manager changes status to Approved, the item appears in the Published column of the weekly calendar, and a new lead enquiry is logged — all persisted to the database and visible after a page refresh without login.

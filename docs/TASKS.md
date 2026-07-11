# Tasks & Sprints

## Sprint 1 — Database, seed data & core content engine
**Goal:** The app renders with real data, and a content item can be created, edited, and moved through the approval workflow — all persisted to Supabase.

- [ ] Apply migration SQL to Supabase project
- [ ] Confirm all tables exist and seed rows are visible in Supabase Table Editor
- [ ] Scaffold Next.js project with Tailwind; configure Supabase client
- [ ] `/` home page = operational dashboard shell (not a login redirect)
- [ ] Content items list page: fetch from DB, show title / platform / status / scheduled date
- [ ] Content item create/edit form: all fields, saves to DB, redirects to list
- [ ] Approval status control: dropdown or button set (Draft → In Review → Approved → Published), writes to DB
- [ ] Content calendar: week grid, slots content items by `scheduled_date` and `platform`
- [ ] Loading, empty, error, and seeded-data states on list and calendar
- [ ] All screens accessible without login

**Definition of Done:** A new content item created via the form appears on the calendar and in the list; changing its status persists after a hard refresh; the calendar shows the 5 seeded items in correct date slots. No login required.

---

## Sprint 2 — Campaigns, themes, assets & keywords
**Goal:** Content items are linked to campaigns and weekly themes; assets and keywords are manageable.

- [ ] Campaigns CRUD page: create, edit, list with linked content count
- [ ] Weekly themes CRUD page: create, edit, link to campaign
- [ ] Campaign + weekly theme selects wired into content item form
- [ ] Marketing assets library: list, upload (URL entry), edit, delete
- [ ] SEO & AI search keyword bank: list, add, edit, set priority
- [ ] Empty and error states on all new pages

**Definition of Done:** A content item can be created and linked to a campaign and weekly theme via the form; the campaign detail shows a count of linked items; a keyword can be added and edited.

---

## Sprint 3 — Dashboard, leads log & brand guidelines ✅ v1 FUNCTIONAL
**Goal:** The full end-to-end success scenario is usable. This is the v1 functional milestone.

- [ ] Operational dashboard: content items by status this week, active campaigns count, pending approvals list, recent leads
- [ ] Leads & enquiries log: create, list, update status, set follow-up date
- [ ] Brand guidelines panel: sections listed in order, edit content, add new section
- [ ] Audit log table: write a row on every status change and lead status update
- [ ] All five UI states (loading / empty / partial / error / ready) verified on every screen
- [ ] Full end-to-end scenario walkthrough (see PRD success criteria)

**Definition of Done:** The success scenario in the PRD passes from start to finish — content item created, approved, published, lead logged — all visible after page refresh. Dashboard counts are live from DB.

---

## Sprint 4 — Lock it down (auth + per-user RLS)
**Goal:** Real users can log in; data is isolated by owner and role.

- [ ] Supabase Auth email/password login and signup pages
- [ ] Role field added to user profiles (brand_manager / content_creator / approver / viewer)
- [ ] Replace all `v1` RLS policies with `auth.uid() = user_id` for writes
- [ ] Approval status changes restricted to `approver` and `brand_manager` roles in app logic
- [ ] Audit log append-only (no delete policy)
- [ ] Redirect unauthenticated users from write routes; read routes remain accessible

**Definition of Done:** A logged-in Content Creator cannot change approval status to Approved; an Approver can; a logged-out visitor can view the calendar but cannot submit a form.

---

## Sprint 5 — Social performance, partnerships & events
**Goal:** Post-publish tracking and relationship records added.

- [ ] Social performance entry form per content item (reach, impressions, clicks, enquiries)
- [ ] Performance summary on content item detail page
- [ ] Corporate customers registry: company, contact, tier, notes
- [ ] Partnerships table: partner name, type, active status, notes
- [ ] Events & sponsorships planner: event name, date, budget, linked campaign, outcome

**Definition of Done:** Performance figures entered for a published item appear on its detail page; a corporate customer record can be created and listed.

---

## Gantt (sprint → week)
```
Sprint 1 — Week 1
Sprint 2 — Week 2
Sprint 3 — Week 3  ← v1 functional
Sprint 4 — Week 4  ← lock-down
Sprint 5 — Week 5+
```

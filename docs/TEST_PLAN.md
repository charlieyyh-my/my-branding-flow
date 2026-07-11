# Test Plan

## End-to-End Success Scenario (manual)

### Precondition
App is running. Seed data is loaded. No login required.

### Steps
1. Open `/` — dashboard loads; confirm seeded content items and campaigns appear. No blank screen.
2. Navigate to Content Calendar — confirm week grid shows seeded items in correct date columns.
3. Click **New Content Item** — form opens with all fields (title, platform, copy, campaign, theme, date).
4. Fill in: title = "Test Post", platform = Instagram, copy = "Test copy", campaign = CNY Heritage Series, theme = Authenticity You Can Trust, scheduled date = this Monday.
5. Submit — item appears in list and on the calendar in the correct date slot.
6. Open the item — change status to **In Review** — save. Reload page — status shows "in_review".
7. Change status to **Approved** — save. Reload — status shows "approved".
8. Change status to **Published**, add a `published_url` — save. Reload — item appears in Published column on dashboard.
9. Navigate to **Leads & Enquiries** — click **New Lead** — fill contact name, company, source = Instagram DM, type = Corporate gifting.
10. Submit — lead appears in list with status "new".
11. Open lead — change status to **In Progress** — save. Reload — status persists.
12. Check `audit_logs` table in Supabase — confirm rows exist for step 6, 7, 8, and 11 status changes.

**Pass:** All data persists after reload. Dashboard counts update. Calendar slot is correct. Audit rows exist.

---

## Empty State Tests
- Delete all content items → calendar shows "No content scheduled this week" message, not a blank grid.
- Delete all leads → leads list shows "No enquiries yet. Add your first lead." not a blank page.
- Delete all campaigns → campaign selector in content form shows "No campaigns yet" placeholder.

## Error State Tests
- Submit content item form with title blank → inline validation error, no DB write.
- Simulate Supabase offline (wrong URL) → list page shows "Unable to load content. Please try again." not a crash.
- Upload an asset with no URL entered → form blocks submission with field error.

## Loading State Tests
- Throttle network to Slow 3G — list pages show skeleton or spinner before data arrives.

## Permissions Smoke Test (post Sprint 4)
- Logged-in Content Creator: cannot see the Approve button on a content item.
- Logged-in Approver: can advance status to Approved.
- Logged-out visitor: calendar and brand guidelines visible; New Content Item form is disabled or redirects to login.

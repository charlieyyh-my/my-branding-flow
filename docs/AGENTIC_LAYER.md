# Agentic Layer

## Risk Levels & Actions

### Low — Auto (no approval needed)
- `tag_content_item` — auto-suggest platform tags from copy text
- `draft_caption` — generate Instagram/LinkedIn caption from copy_body; stored with `caption_review_status = unreviewed`
- `score_keyword_relevance` — compute relevance_score for seo_keywords
- `summarise_weekly_performance` — aggregate social_performance into a week summary card

### Medium — Light approval (human confirms before write)
- `suggest_status_advance` — flag content items ready to move from draft → in_review based on completeness check
- `create_lead_followup_task` — propose a follow-up note on a lead with a suggested date

### High — Always approval before action
- `send_approval_request` — notify approver that content is ready for review (requires confirm before any message send)
- `bulk_status_update` — change multiple content items to published in one action

### Critical — Human only, never automated
- Delete campaign and all linked content items
- Delete leads or audit log entries
- Change brand guidelines (requires Brand Manager confirmation in UI)

## Named Tools (approved)
- `supabase_query` — read/write to own tables only
- `openai_chat` — caption drafting and keyword scoring only
- `supabase_storage_upload` — marketing assets only

No `run_any`, `exec_sql`, or `send_any` tools permitted.

## Audit Log Fields
`actor · action · object_type · object_id · old_value · new_value · risk_level · created_at`

Every status change, AI draft acceptance, and approval action writes a row to `audit_logs`.

## v1 vs Later
- **v1:** manual workflow only; audit logging on status changes; no AI writes without review
- **Next:** caption drafting with one-click accept/reject
- **Later:** auto-flag brand voice violations; scheduled publish suggestions

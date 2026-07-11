# Security

## Secret Handling
- Supabase service role key: server-side only (`SUPABASE_SERVICE_ROLE_KEY` in Vercel env, never in browser bundle)
- Supabase anon key: client-safe, used only for RLS-gated queries
- OpenAI API key: server-side only (Next.js API route), never exposed to frontend
- No secrets in `.env.local` committed to repo; `.gitignore` enforced

## Permission Model (v1 → lock-down)
| Phase | Read | Write | Approve |
|---|---|---|---|
| v1 (demo) | Anyone | Anyone | Anyone |
| Lock-down | auth.uid() match | auth.uid() match | Approver role only |

At lock-down sprint:
- Replace all `v1` RLS policies with `auth.uid() = user_id` for writes
- Add `role` column to users; approval status changes gated to `approver` and `brand_manager` roles
- Audit log rows are append-only — no UPDATE or DELETE policy on `audit_logs`

## Approved Tools Rule
Agents may only call named tools: `supabase_query`, `openai_chat`, `supabase_storage_upload`. Any tool not on the approved list is blocked. The agent inherits the calling user's RLS context — it cannot elevate its own permissions.

## Audit Principle
Every meaningful mutation (status change, approval, deletion request, AI draft acceptance) writes to `audit_logs` with actor, action, object reference, old/new values, and risk level. Audit rows are never deleted. If an action is genuinely high-stakes (bulk delete, legal document), the plan says: stop and get a human.

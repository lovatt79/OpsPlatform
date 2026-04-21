# Ops Platform: Build Plan

Staged plan for taking the app from "all mock data" to "all 11 pages actually work", informed by a survey of popular competitor tools (Deputy, 7shifts, Sling, Homebase, Connecteam, Origin) and the Phase 1 MVP in `REQUIREMENTS.md`.

Track per-feature progress in `FEATURES.md`; this file is the execution roadmap.

---

## Competitor-inspired patterns to fold in (all four)

| Pattern | Inspired by | Where it lands |
|---|---|---|
| Self-serve open shifts — staff claim/apply from mobile, manager approves | Sling | Iteration 4 |
| Rules-based compliance — real-time validation during schedule edits; hard violations block publish, soft warnings require ack | Connecteam, Deputy | Iteration 3 |
| Copy-previous-week + click-to-edit shifts (drag-drop optional) | Deputy | Iteration 3 |
| Tours-native "emergency replan" — callout triggers a one-screen view of available staff + assets, reassign + notify via sms/tel/mailto | Gap in market (Origin is closest but no replan) | Iteration 5 |

## Gaps left for later (noted, not scoped now)

- OTA sync (FareHarbor, Peek, Viator) → Phase 4.
- AI-assisted auto-scheduling from demand signals (Deputy pattern) → Phase 4.
- Multi-day trip continuity + guide-fatigue tracking → Phase 4.
- Automated notifications (Twilio, Resend) — explicitly deferred per REQUIREMENTS.

---

## Iteration 0 — already shipped

- UI scaffolds for all 11 routes with realistic mock data matching REQUIREMENTS.
- `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` exist but are unused.
- `supabase/migrations/001_initial_schema.sql` — full schema with RLS **enabled** but **no policies defined**.
- `supabase/seed.sql` — sample org with staff, roles, locations.
- `src/types/database.ts` — generated types; unused.

## Iteration 1 — Foundation (this pass)

Unblocks every following iteration. Keep UI mock for now; switch real auth on.

- `.env.example` documenting `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- `src/lib/supabase/middleware.ts` — session-refresh helper using `@supabase/ssr`.
- `src/middleware.ts` — runs on every request: refreshes session, redirects unauthenticated users to `/login`, redirects authenticated users away from `/login`, splits manager vs staff routes based on `staff.is_manager`.
- `src/lib/auth.ts` — `getCurrentUser()`, `getCurrentStaff()` (joins `staff` row by `auth_user_id`), `requireManager()` server helpers.
- `src/app/(auth)/login/page.tsx` — real `supabase.auth.signInWithPassword`; redirect on success based on role.
- `src/app/auth/logout/route.ts` — sign-out route handler.
- `supabase/migrations/002_rls_policies.sql` — org-scoped RLS for all tables + staff-self-access policies.
- README env section: show exact `.env.local` setup.

**Verification:** user signs in with a Supabase-Auth user that has a matching `staff.auth_user_id`; they land on the correct section; middleware blocks unauthenticated access.

## Iteration 2 — Dashboard + Staff CRUD

- Server component `/manager/dashboard` reads real data: today's shifts, callouts, pending vacation requests, asset count in_use.
- `/manager/staff` — list staff from DB with search; add/edit via server action modals; soft-delete (status → inactive).
- Seed helper to link a Supabase Auth user to a `staff` row.
- Activity log entries written via a server-only `logActivity()` util.

## Iteration 3 — Schedule builder + compliance (competitor pattern #2 and #3)

- `/manager/schedule` — reads `schedules` + `shifts` for a selected week; server actions to:
  - Create/edit/delete shifts (click cell → modal).
  - **Copy previous week** — clones shifts forward in one transaction.
  - Publish schedule → sets status, stamps `published_at`, writes activity log.
- `/staff/schedule` — staff's own shifts read from DB.
- **Compliance engine** (`src/lib/compliance.ts`): pure functions taking a week of shifts + a `compliance_rules` row; returns `{ violations, warnings, overrides }`. Called on every mutation. Hard violations block publish; warnings require `compliance_overrides` rows before publish.
- Seed a California preset into `compliance_rules` on first run.
- (Drag-drop deferred to Iteration 3b; click-to-edit + copy-week cover the main value.)

## Iteration 4 — Open shifts (competitor pattern #1)

- `/manager/open-shifts` — create open shift (role, location, date, time, rule: first-come vs. application). List + cancel.
- `/staff/open-shifts` — browse open shifts matching staff role. Two actions:
  - First-come → server action claims atomically (`UPDATE open_shifts SET status='filled', filled_by=... WHERE status='open'`).
  - Application → inserts `open_shift_applications` row.
- Manager review panel — approve/deny applications (approve auto-fills the shift).
- Both flows create a corresponding `shifts` row in the current schedule on fill.

## Iteration 5 — Vacation + callouts + emergency replan (competitor pattern #4)

- `/staff/requests` — submit vacation request (partial-day supported); PTO balance updates `pending`.
- `/manager/requests` — approve/deny; approved requests decrement `pto_balances.used`.
- "I Can't Make It" on `/staff/schedule` → inserts `callouts` + updates shift status.
- **Emergency replan screen** (`/manager/replan/[shiftId]`):
  - Shift details + impacted location/asset.
  - List of staff free that day (no conflicting shift, availability preference ≠ unavailable, matching role).
  - List of assets free that day.
  - Click a staff member → reassign shift + mark callout covered + surface `sms:` / `tel:` / `mailto:` quick actions pre-filled with shift details.

## Iteration 6 — Assets + issues

- `/manager/assets` — real asset list with type tiles and open issues, CRUD for assets.
- Staff can report issues from `/staff/schedule` on their assigned asset.
- Issue urgency surfaces on manager dashboard.

## Iteration 7 — HR, activity log, settings

- `/manager/hr` — documents + certifications expiry calculations, onboarding progress, incidents.
- `/manager/activity` — reads `activity_log` with filters.
- `/manager/settings` — org/locations/roles CRUD; swap compliance preset.
- `/staff/profile` — staff self-edit of limited fields + certifications view + document upload (Supabase Storage).

## Iteration 8 — Timesheets (REQUIREMENTS Phase 3)

- Clock in/out from `/staff/schedule`.
- Pay-period timesheets auto-aggregate.
- Staff signs (typed or canvas) → manager signs → lock.
- Dispute flow.

## Iteration 9 — Polish

- Manager department-scoped permissions.
- Drag-drop on schedule builder.
- Weather API on dashboard + staff schedule.
- Booking platform webhooks (prototype).

---

## Definition of done per iteration

Every iteration ends with:
- `npm run build` passes.
- Feature is testable against the real Supabase project via `npm run dev`.
- FEATURES.md entry for each feature updated with status `Shipped`, key files, and "How to test".
- Commit to `claude/fix-404-navigation-BiQoY` (current working branch) or a new feature branch.

## Critical files touched most often

- `src/middleware.ts`
- `src/lib/supabase/{client,server,middleware}.ts`
- `src/lib/auth.ts`, `src/lib/compliance.ts`, `src/lib/activity.ts`
- `src/app/(manager)/manager/*/page.tsx` (convert mock → server components)
- `src/app/(staff)/staff/*/page.tsx`
- `supabase/migrations/002_rls_policies.sql` and onwards (additive)

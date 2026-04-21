# Ops Platform: Features Log

Living document tracking every feature shipped during the build. Update this file whenever a feature is added, updated, or removed.

Companion to `REQUIREMENTS.md` — that file describes the target product; this file describes what has actually been built.

## How to maintain this file

Whenever you add or change a feature:

1. Add / update an entry under the appropriate **App section** below.
2. Set the **Status** (see legend).
3. Fill in **Route**, **Key files**, **How it works**, and **How to use / test**.
4. Add an entry to the **Changelog** at the bottom with the date and a one-line summary.

### Status legend

- `Shipped` — implemented with real data / working backend.
- `UI scaffold` — page exists with mock data; backend not wired.
- `Planned` — not yet built; listed for visibility.

---

## Project structure

```
src/
  app/
    (auth)/login/                        # login page
    (manager)/
      layout.tsx                         # wraps manager pages with sidebar
      manager/
        dashboard/                       # daily operations view
        schedule/                        # weekly schedule builder
        staff/                           # roster
        open-shifts/                     # post/review open shifts
        requests/                        # vacation + callouts
        assets/                          # equipment + issues
        hr/                              # documents, onboarding, PTO
        activity/                        # audit trail
        settings/                        # org, locations, roles, compliance
    (staff)/
      layout.tsx                         # mobile layout with bottom nav
      staff/
        schedule/                        # my shifts
        open-shifts/                     # browse / claim / apply
        requests/                        # submit time off
        profile/                         # contact, certs, documents
    page.tsx                             # root redirect -> /login
    layout.tsx                           # root layout
  components/
    manager/sidebar.tsx                  # manager side nav
    ui/                                  # Button, Card, Badge, Input
  lib/                                   # utilities (cn, etc.)
  types/                                 # shared TS types
```

Route groups `(auth)`, `(manager)`, `(staff)` are Next.js App Router groupings — they do not appear in the URL but let each section share a layout.

---

## Auth

### Login
- **Status:** UI scaffold
- **Route:** `/login`
- **Key files:** `src/app/(auth)/login/page.tsx`
- **How it works:** Email + password form. On submit, currently redirects to `/manager/dashboard` without calling Supabase. Supabase Auth is the intended backend (see `REQUIREMENTS.md` → Tech Stack).
- **How to use / test:** Visit `/login`, fill in any values, click **Sign in** — you land on the manager dashboard.

---

## Manager Web App

### Dashboard
- **Status:** UI scaffold
- **Route:** `/manager/dashboard`
- **Key files:** `src/app/(manager)/manager/dashboard/page.tsx`
- **How it works:** Daily-operations landing page. Shows summary stats (staff on shift, locations active, assets in use), an alerts panel (callouts, asset issues), a "Who's Working Today" panel grouped by role with inline `mailto:` / `sms:` / `tel:` contact icons, and a pending-requests sidebar. All data is mock data inline in the page.
- **Requirements ref:** Manager Web App → Dashboard.
- **How to use / test:** Log in → land on `/manager/dashboard`. Click the email/text/call icons next to a staff member to launch the native app.

### Schedule Builder
- **Status:** UI scaffold
- **Route:** `/manager/schedule`
- **Key files:** `src/app/(manager)/manager/schedule/page.tsx`
- **How it works:** Weekly grid with days as columns and staff as rows, grouped by role. Empty cells show a `+` placeholder, shifts show time / location / asset, days off and vacation are visually distinct. Side panels show compliance warnings (OT acknowledgment pattern) and an availability helper with a "Post Open Shift" shortcut. Header actions: Copy Previous Week, Publish Schedule.
- **Requirements ref:** Manager Web App → Schedule Builder; Compliance Rules.
- **How to use / test:** Navigate from the sidebar → Schedule. Scroll the grid horizontally on narrow screens. Compliance warnings and buttons are non-functional placeholders.

### Staff
- **Status:** UI scaffold
- **Route:** `/manager/staff`
- **Key files:** `src/app/(manager)/manager/staff/page.tsx`
- **How it works:** Team roster with search bar, per-staff status badge (active / on vacation / inactive), weekly hours, and native-action contact icons. Each row has a **View** button placeholder for drilling into the staff profile.
- **Requirements ref:** Manager Web App → Staff Management.
- **How to use / test:** Sidebar → Staff. Search box is cosmetic; contact icons work via `mailto:` / `sms:` / `tel:`.

### Open Shifts
- **Status:** UI scaffold
- **Route:** `/manager/open-shifts`
- **Key files:** `src/app/(manager)/manager/open-shifts/page.tsx`
- **How it works:** Lists posted open shifts with rule (first-come vs. applications), applicant count, and filled-state badge. A second card shows applicants for a selected shift with Approve / Deny buttons — matching the REQUIREMENTS flow where managers can configure either mode.
- **Requirements ref:** Manager Web App → Open Shifts.
- **How to use / test:** Sidebar → Open Shifts. Buttons are placeholders.

### Requests
- **Status:** UI scaffold
- **Route:** `/manager/requests`
- **Key files:** `src/app/(manager)/manager/requests/page.tsx`
- **How it works:** Two stacked panels:
  - **Active Callouts** — highlighted yellow, with **Post as Open Shift** and **Find Cover** actions.
  - **Time Off Requests** — shows PTO type, dates (with partial-day support), requested hours, coverage impact, and Approve / Deny actions.
- **Requirements ref:** Manager Web App → Requests; PTO / Vacation.
- **How to use / test:** Sidebar → Requests.

### Assets
- **Status:** UI scaffold
- **Route:** `/manager/assets`
- **Key files:** `src/app/(manager)/manager/assets/page.tsx`
- **How it works:** Overview cards per asset type (Bus, Van, Kayak, Radio, ...) with in-use and maintenance counts. Below:
  - **Open Issues** panel with severity badges (low / medium / high / critical) and reporter / timestamp.
  - **All Assets** list with status badge (available / in_use / maintenance / retired) and current assignment.
- **Requirements ref:** Manager Web App → Assets.
- **How to use / test:** Sidebar → Assets.

### HR
- **Status:** UI scaffold
- **Route:** `/manager/hr`
- **Key files:** `src/app/(manager)/manager/hr/page.tsx`
- **How it works:** Summary tiles for expiring documents, onboarding in progress, pending PTO hours, and open incidents. Dedicated panels for each:
  - Expiring documents / certifications with days-left badge.
  - Onboarding progress bars per new hire (tasks completed / total).
  - Incidents list with status.
- **Requirements ref:** Manager Web App → HR Module.
- **How to use / test:** Sidebar → HR.

### Activity Log
- **Status:** UI scaffold
- **Route:** `/manager/activity`
- **Key files:** `src/app/(manager)/manager/activity/page.tsx`
- **How it works:** Filter bar plus a chronological feed of manager actions. Each entry shows timestamp, actor, action badge (approved / published / override / created / resolved, color-coded), entity type, and a human-readable description. Colors match the intent: success for approvals, info for publish/create, warning for overrides.
- **Requirements ref:** Manager Web App → Activity Log.
- **How to use / test:** Sidebar → Activity Log.

### Settings
- **Status:** UI scaffold
- **Route:** `/manager/settings`
- **Key files:** `src/app/(manager)/manager/settings/page.tsx`
- **How it works:** Sections for:
  - **Organization** — name, contact email, time zone, brand color (white-label hooks).
  - **Locations** — list with add / edit.
  - **Roles** — with license-required flag and staff count.
  - **Compliance Preset** — choice of California / Federal (FLSA) / NY / EU / UK / Australia, with an Active badge.
- **Requirements ref:** Manager Web App → Settings; Compliance Rules.
- **How to use / test:** Sidebar → Settings.

### Manager shell / navigation
- **Status:** Shipped (UI only)
- **Key files:** `src/app/(manager)/layout.tsx`, `src/components/manager/sidebar.tsx`
- **How it works:** Responsive sidebar (fixed on desktop, drawer on mobile). Active nav item highlighted via `pathname.startsWith(item.href)`. Links cover all nine manager pages.
- **How to use / test:** Resize window to below `lg` breakpoint to trigger the mobile drawer.

---

## Staff Mobile Web App

The staff app is designed as a mobile-first PWA (see `REQUIREMENTS.md` → Staff Mobile Web App). All pages live under `/staff/*` and share a bottom-nav layout.

### My Schedule
- **Status:** UI scaffold
- **Route:** `/staff/schedule`
- **Key files:** `src/app/(staff)/staff/schedule/page.tsx`
- **How it works:** Vertical list of upcoming days. Each card shows start / end time, location, assigned asset (if any), coworkers and roles. Today's shift shows an **I Can't Make It** button (callout flow). Off days render a simple **Off** badge. Header includes a weather glance.
- **Requirements ref:** Staff Mobile Web App → My Schedule.
- **How to use / test:** After login (or directly via `/staff/schedule`), scroll through the day cards.

### Open Shifts
- **Status:** UI scaffold
- **Route:** `/staff/open-shifts`
- **Key files:** `src/app/(staff)/staff/open-shifts/page.tsx`
- **How it works:** Cards per available shift with date, time, role badge, location. Action button shifts based on rule: **Claim Shift** (first-come) vs. **Apply** (applications). Shifts already applied to show **Application pending** + Withdraw.
- **Requirements ref:** Staff Mobile Web App → Open Shifts.
- **How to use / test:** Bottom nav → Open.

### Requests
- **Status:** UI scaffold
- **Route:** `/staff/requests`
- **Key files:** `src/app/(staff)/staff/requests/page.tsx`
- **How it works:** PTO balance grid (vacation / sick / personal, tracked in hours) plus a list of past / pending requests with status badges. **New Request** button in header.
- **Requirements ref:** Staff Mobile Web App → Requests; PTO / Vacation.
- **How to use / test:** Bottom nav → Requests.

### Profile
- **Status:** UI scaffold
- **Route:** `/staff/profile`
- **Key files:** `src/app/(staff)/staff/profile/page.tsx`
- **How it works:** Avatar (generated from initials), contact card with `mailto:` / `tel:` links, certifications list with validity badges, documents list with upload button.
- **Requirements ref:** Staff Mobile Web App → Profile.
- **How to use / test:** Bottom nav → Profile.

### Staff shell / bottom navigation
- **Status:** Shipped (UI only)
- **Key files:** `src/app/(staff)/layout.tsx`
- **How it works:** Sticky header + sticky bottom navigation with four tabs (Schedule, Open, Requests, Profile). Active tab highlighted via `pathname.startsWith(item.href)`.

---

## Shared UI primitives

### Components
- **Status:** Shipped
- **Key files:** `src/components/ui/button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `index.ts`
- **How it works:** Small Tailwind-based primitives used across the app.
  - `Button` — variants: `primary`, `secondary`, `outline`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`.
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
  - `Badge` — variants: `default`, `success`, `warning`, `danger`, `info`.
  - `Input` — with optional `label` and `error` props.
- **How to use / test:** Import from `@/components/ui/*`. Visible in every page in this repo.

### Root redirect
- **Status:** Shipped
- **Key files:** `src/app/page.tsx`
- **How it works:** `/` redirects to `/login`.

---

## Not yet built

Features from `REQUIREMENTS.md` that have no scaffold yet. Add a section above when you implement one.

- Supabase Auth wiring (login is a redirect stub today).
- Supabase data layer: all pages use inline mock data.
- Row-level security / multi-tenant `organization_id` scoping.
- Compliance rules engine (real validation during schedule edits).
- Timesheets + digital signature capture.
- Department-manager scoped permissions.
- Weather API for staff-schedule and dashboard.
- Automated notifications (Twilio / Resend) — explicitly deferred per REQUIREMENTS.
- Booking-platform integrations (FareHarbor, Peek, Viator) for demand forecasting.

---

## Changelog

- **2026-04-21** — Created placeholder pages for all nine manager routes and the three missing staff routes. Fixed 404s caused by sidebar links pointing to non-existent pages.
- **2026-04-21** — Rebuilt all placeholder pages as UI scaffolds with mock data matching REQUIREMENTS.md (schedule grid, roster, open shifts, requests + callouts, assets + issues, HR, activity log, settings; staff open-shifts / requests / profile).
- **2026-04-21** — Added this `FEATURES.md` tracking document.

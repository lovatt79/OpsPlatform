# Ops Platform: Requirements & Design Document

## Overview

An operations platform for the tours and activities industry that complements booking platforms by handling the operational fulfillment layer after sales are made.

---

## Discovery Q&A

### Market & Positioning

**Q: What is the core problem this platform solves?**
A: Booking platforms handle demand capture (selling tickets). This platform handles demand fulfillment—the messy reality of actually delivering the experience. Operators currently bridge this gap with spreadsheets, WhatsApp groups, and gut feel.

**Q: Are you competing with booking platforms?**
A: No. The platform complements them and potentially integrates with them for bookings to understand operational demands. It sits alongside FareHarbor, Peek, Viator, etc.—not competing with them.

**Q: What operator size are you targeting?**
A: Start with smaller operators (5-20 staff) who may be less likely to have a system in place, with scope to expand to the needs of bigger operators. Solo owner-operators have less pain; operators with staff feel it acutely.

**Q: What would make operators pay for this?**
A: Less stress, more focus on customer experience. Not just time savings—peace of mind.

---

### Operational Experience (From Running 40-Bus Hop-On Hop-Off Operation)

**Q: What scale operation did you run?**
A: 3 routes, around 27 stops with buses departing every 15 mins in summer to every 30 mins in winter.

**Q: What booking sources fed into the operation?**
A: OTAs, website, local resellers, walk-ups, street sales team, hotel concierges. Roughly 50/50 pre-booked vs walk-up.

**Q: How did you determine staffing levels?**
A: In winter, number of buses was based on running a minimum schedule even when not busy. In summer, it's as many as possible, especially on weekends. Factors were historical trends and weather forecasts.

**Q: What happened with demand spikes or drops?**
A: Spikes result in long lines at bus stops. Drops in demand result in demoralized staff.

**Q: How were schedules communicated?**
A: Schedule was sent out on a Saturday for the following week. Tried to keep people on a consistent schedule for quality of life but had people I could rely on to do extra when in peak times.

**Q: How were real-time issues handled?**
A: A lot of phone calls between drivers, maintenance teams, front desk, etc. to solve the issue and keep people in the loop who were customer facing.

**Q: What information did you wish you had in the moment?**
A: Where customers were waiting and what buses and drivers were free in their schedules at the time to help.

**Q: What tools were used?**
A: Spreadsheet for scheduling and phone for most other things.

**Q: How reliable were different staff types?**
A: Drivers for the most part are reliable—they have a commercial license that took effort to get. Front desk staff and tour guides are less so.

**Q: If you could have built one tool, what would it do?**
A: A smart scheduler that can react to in-the-moment issues by just typing in what's happened in plain text. A way for staff to opt in to extra shifts, add their names to the pool of availability. A tool for drivers to report problems with vehicles that goes to the maintenance team with urgency levels. Allow for nuances like drivers not liking certain guides or vice versa, vehicle preferences, seniority, family commitments, etc.

---

## Feature Requirements

### Manager Web App

#### Dashboard
- Daily operations view showing who is working that day
- Tools to email, message, or call staff (using native device actions: `mailto:`, `sms:`, `tel:`)
- Summary stats: staff on shift, locations active, assets in use
- Alerts panel: callouts needing coverage, asset issues, schedule gaps
- Pending requests: vacation approvals, open shift applications

#### Schedule Builder
- Weekly grid view with staff grouped by role
- Assign shifts with staff, role, location, asset, time
- Visual indicators for days off, approved vacation, conflicts
- Copy previous week functionality
- Publish schedule to staff app
- Availability helper sidebar showing who's free each day

#### Staff Management
- Staff roster with contact info, role, status
- Availability preferences per staff member
- Staff profile with HR details (see HR section)

#### Open Shifts
- Manager posts extra shifts as needed
- Set criteria: role required, license required, seniority
- Choose: first-come-first-served OR applications (manager approves)
- View applicants and approve/deny

#### Requests
- View vacation/time-off requests
- See calendar impact: who else is off, coverage gaps
- Approve/deny with optional note
- Handle callouts: see gap, post as open shift or contact available staff

#### Assets
- Track vehicles, equipment (buses, vans, kayaks, scooters, bikes, life jackets, radios, etc.)
- Asset types: some require assignment to shifts (vehicles), some are pooled (life jackets)
- Asset status: available, in_use, maintenance, retired
- Issue reporting: staff report problems with urgency levels (low, medium, high, critical)
- Assign assets to shifts

**Q: Does assets cover rentals like bikes, scooters, etc.?**
A: Yes—the asset system covers any equipment including rental items like bikes and scooters.

#### HR Module
- Employee records: personal info, emergency contacts, employment details
- Documents: licenses, certifications, contracts, IDs, waivers
- Document expiry tracking with alerts
- Certifications: track what's required per role, expiry dates
- Onboarding: templates with task checklists per role
- Time tracking: hours worked, overtime
- PTO balances: vacation, sick, personal (tracked in hours for partial day support)
- Performance notes: positive, coaching, warning, incident, review
- Incidents: report, track, resolve workplace incidents

#### Timesheets
- Time entries per shift (clock in/out, breaks)
- Staff reviews and signs their timesheet (digital signature)
- Manager reviews and countersigns
- Dispute flow: staff can dispute entries, manager resolves
- Lock for payroll export after approval
- Signature capture: canvas for finger/mouse drawing OR typed name confirmation

#### Compliance Rules
- Configure labor law rules per organization
- Presets available: California, Federal (FLSA), New York, EU Working Time Directive, UK, Australia
- Rules include:
  - Max daily hours
  - Max weekly hours
  - Overtime thresholds (daily and weekly)
  - Required breaks (duration and after how many hours)
  - Minimum hours between shifts
  - Max consecutive days
  - Minor rules (under 18): different limits, no late shifts
- Real-time validation in schedule builder
- Hard violations block publishing; soft warnings (overtime) require acknowledgment
- Manager overrides logged to activity log

#### Activity Log
- Audit trail of all manager actions
- Track: who did what, when, to which record
- Filter by manager, action type, entity type, date range
- Department managers see only activity within their scope

#### Department Manager Permissions
- Manager roles with scoped access
- Scope types: all (admin), role-based (Drivers Manager), location-based (Downtown Manager)
- Permissions per area: dashboard, schedule, staff, open_shifts, requests, assets, settings, HR
- Can view/edit/approve only within their scope

#### Settings
- Organization details, logo, colors (white-label ready)
- Locations management
- Roles management
- Compliance rules configuration
- Pay period settings

---

### Staff Mobile Web App

**Q: Native iOS/Android app needed?**
A: No—mobile web app (PWA) for now. Keep option open for native apps in future. Architecture should be API-first to support native apps later.

#### My Schedule
- View upcoming shifts
- See shift details: time, location, assigned asset, coworkers
- Weather forecast for shift days
- "I Can't Make It" button to report callout

#### Open Shifts
- View available extra shifts
- Filter by date, role
- One tap to claim (first-come) or apply (approval needed)
- See application status

#### Requests
- Submit vacation/time-off requests
- Support partial days (not just full days)
- Select PTO type: vacation, sick, personal
- Track request status: pending, approved, denied
- View past callouts

#### Availability
- Set recurring preferences by day of week
- Mark days as preferred, available, or unavailable
- Add notes (e.g., "After 2pm only")

#### Profile
- View/edit contact info
- View certifications and document status
- Upload new documents

#### Timesheets
- Review time entries for pay period
- Dispute incorrect entries
- Sign timesheet with digital signature

---

### Notifications

**Q: How should notifications work?**
A: Use native device actions rather than third-party services (Twilio, etc.) to keep costs at zero during build phase.

- SMS: `sms:+1234567890?body=message`
- Call: `tel:+1234567890`
- Email: `mailto:email@example.com?subject=X&body=Y`

Manager taps button, phone opens native app with details pre-filled, manager sends manually.

Later (when paying customers exist): Add automated notifications via Twilio/Resend for key events like schedule published, shift approved, etc.

---

### PTO / Vacation

**Q: Does PTO cover partial days?**
A: Yes. Track PTO in hours, not days. This handles:
- Full day = 8 hours (or standard shift length)
- Half day = 4 hours
- Leave early for appointment = 2-3 hours

Vacation request includes optional start_time and end_time for partial days.

---

## Technical Architecture

### Stack (Zero Cost for Build Phase)

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Hosting | Vercel (free tier) |
| Database | Supabase (free tier, PostgreSQL) |
| Auth | Supabase Auth |
| Notifications | Native device actions (mailto, sms, tel) |
| Repository | GitHub |

### Key Architectural Decisions

- **Multi-tenant from day one**: `organization_id` on all tables
- **White-label ready**: theming config per tenant, custom domains later (Vercel Pro)
- **API-first**: Clean API backend for future native apps
- **Mobile web app**: PWA for staff, not native apps initially
- **Row-level security**: Supabase RLS for tenant isolation

### When Costs Kick In

| Trigger | What's Needed | Rough Cost |
|---------|---------------|------------|
| Custom domain | Vercel Pro | ~$20/month |
| Multiple tenants (white-label) | Vercel Pro for custom domains | $20/month |
| Automated notifications | Twilio, Resend | Pay as you go |
| Database growth | Supabase Pro | $25/month |

---

## Database Schema Summary

### Core Tables
- `organizations` - Tenants
- `staff` - All employees
- `staff_details` - Extended HR info
- `roles` - Job roles (Driver, Guide, Front Desk)
- `locations` - Work locations
- `manager_roles` - Permission sets with scope

### Scheduling Tables
- `schedules` - Weekly schedules
- `shifts` - Individual shift assignments
- `open_shifts` - Available extra shifts
- `open_shift_applications` - Staff applications for open shifts
- `availability` - Staff availability preferences

### Requests & Callouts
- `vacation_requests` - Time-off requests (supports partial days)
- `callouts` - Sick calls, no-shows

### Assets
- `asset_types` - Categories (Bus, Van, Kayak, Radio, etc.)
- `assets` - Individual items
- `shift_assets` - Asset assignments to shifts
- `asset_issues` - Problem reports

### Compliance
- `compliance_rules` - Labor law configurations
- `compliance_overrides` - Acknowledged violations

### HR & Documents
- `certification_types` - What certs exist and who needs them
- `staff_documents` - Uploaded documents
- `staff_certifications` - Staff cert records
- `onboarding_templates` - Task lists per role
- `staff_onboarding` - Onboarding progress
- `staff_onboarding_tasks` - Individual task completion
- `pto_balances` - PTO accrual/usage by type
- `performance_notes` - Manager notes on staff
- `incidents` - Workplace incident reports

### Time Tracking
- `pay_period_settings` - Pay period configuration
- `time_entries` - Clock in/out records
- `timesheets` - Pay period summaries with signatures
- `timesheet_entries` - Links time entries to timesheets
- `timesheet_disputes` - Staff disputes on entries

### Audit
- `activity_log` - All manager actions

---

## Build Phases

### Phase 1: MVP Core
- [ ] Authentication (Supabase Auth)
- [ ] Staff roster CRUD
- [ ] Basic schedule builder
- [ ] Staff mobile schedule view
- [ ] Open shifts posting/claiming
- [ ] Vacation requests

### Phase 2: Operations
- [ ] Compliance rules engine with warnings
- [ ] Asset management
- [ ] Callout flow with coverage
- [ ] Daily dashboard
- [ ] Email notifications (native device actions)

### Phase 3: HR & Timesheets
- [ ] HR module (documents, onboarding)
- [ ] Timesheets with digital signatures
- [ ] Activity log
- [ ] Department manager permissions

### Phase 4: Scale
- [ ] Booking platform integrations
- [ ] Demand forecasting
- [ ] Native mobile apps (if needed)
- [ ] White-label theming per tenant

---

## UI/UX Notes

### Manager Dashboard
- First thing manager sees each morning
- Quick glance: who's working, any problems, pending decisions
- Contact actions use native device (tap to call/text/email)
- Grouped by role (Drivers, Guides, Front Desk)
- Visual flags for callouts, issues

### Schedule Builder
- Week grid with days as columns, staff as rows
- Grouped by role
- Click cell to add/edit shift
- Side panel for shift details
- Availability helper shows who's free
- Compliance warnings inline and in summary panel
- Copy previous week for efficiency

### Staff Mobile App
- Bottom navigation: Schedule, Open, Requests, Profile
- Large tap targets for mobile
- Cards for shifts with key info visible
- Simple flows for claiming shifts, requesting time off
- Signature capture on canvas

### Notifications
- Keep it human—manager initiates contact
- Pre-filled messages save time
- No automation until there's budget for it

---

## Contacts & Validation

The founder has extensive contacts in the industry:
- Walking tour companies
- Scooter rentals
- Food tours
- Observation decks
- And more

These will be used for validation interviews and pilot customers.

---

## Success Criteria for MVP

- Manager can build and publish a weekly schedule in under 30 minutes
- Staff can see their schedule, pick up open shifts, request time off—all from their phone
- Callouts trigger coverage flow without phone tag
- Pilot operators say: "This is already better than what I had"

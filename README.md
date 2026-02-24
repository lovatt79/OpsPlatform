# Ops Platform

Operations platform for tours and activities industry. Handles scheduling, staff management, assets, compliance, and HR.

## Features

### Manager Web App
- **Dashboard** - Daily ops view with who's working, alerts, pending requests
- **Schedule Builder** - Weekly schedule with drag-drop, compliance warnings
- **Staff Management** - Roster, availability, permissions
- **Open Shifts** - Post and manage extra shifts
- **Requests** - Vacation, callouts, shift applications
- **Assets** - Vehicles, equipment tracking, issue reporting
- **HR** - Documents, certifications, onboarding, timesheets
- **Activity Log** - Audit trail of all changes
- **Compliance** - Labor law rules, overtime, break requirements

### Staff Mobile Web App
- **My Schedule** - Upcoming shifts, coworkers, assigned assets
- **Open Shifts** - View and claim/apply for extra shifts
- **Requests** - Submit vacation requests, report callouts
- **Profile** - Personal info, availability preferences
- **Timesheets** - Review and sign timesheets

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier)

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd ops-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API to get your URL and anon key

4. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Run database migrations:
   - Go to Supabase Dashboard > SQL Editor
   - Copy and run `supabase/migrations/001_initial_schema.sql`
   - Then run `supabase/seed.sql` for test data

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ops-platform/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth routes (login)
│   │   ├── (manager)/            # Manager web app
│   │   └── (staff)/              # Staff mobile web app
│   ├── components/
│   │   ├── ui/                   # Shared UI components
│   │   ├── manager/              # Manager-specific components
│   │   └── staff/                # Staff-specific components
│   ├── lib/
│   │   ├── supabase/             # Supabase client config
│   │   └── utils/                # Utility functions
│   └── types/                    # TypeScript types
├── supabase/
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Test data
└── public/                       # Static assets
```

## Database Schema

Key tables:
- `organizations` - Tenants (white-label support)
- `staff` - All employees
- `roles` - Job roles (Driver, Guide, etc.)
- `locations` - Work locations
- `schedules` - Weekly schedules
- `shifts` - Individual shift assignments
- `open_shifts` - Available shifts to claim
- `vacation_requests` - Time-off requests
- `assets` - Vehicles, equipment
- `timesheets` - Time tracking with signatures
- `activity_log` - Audit trail

See `supabase/migrations/001_initial_schema.sql` for complete schema.

## Roadmap

### MVP (Phase 1)
- [x] Database schema
- [x] Project scaffolding
- [ ] Authentication
- [ ] Staff roster CRUD
- [ ] Basic schedule builder
- [ ] Staff mobile schedule view
- [ ] Open shifts posting/claiming
- [ ] Vacation requests

### Phase 2
- [ ] Compliance rules engine
- [ ] Asset management
- [ ] Callout flow
- [ ] Email notifications

### Phase 3
- [ ] HR module (documents, onboarding)
- [ ] Timesheets with signatures
- [ ] Activity log
- [ ] Department manager permissions

### Phase 4
- [ ] Booking platform integrations
- [ ] Demand forecasting
- [ ] Native mobile apps (if needed)
- [ ] White-label theming

## License

Private - All rights reserved

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lovatt79/OpsPlatform&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20credentials%20required&envLink=https://supabase.com/dashboard/project/_/settings/api)

### Manual Deploy

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Environment Variables

Set these in Vercel Dashboard > Project > Settings > Environment Variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | (Optional) For server-side admin operations |

### Custom Domain

1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add your custom domain
3. Update DNS as instructed

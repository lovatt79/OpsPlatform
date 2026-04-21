import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, GraduationCap, ClipboardList, AlertTriangle, UserPlus } from 'lucide-react'

// Mock data - replace with real data from Supabase
const summary = {
  expiringSoon: 3,
  onboardingInProgress: 2,
  ptoPendingHours: 48,
  incidentsOpen: 1,
}

const expiringDocuments = [
  {
    id: 1,
    staff: 'John Smith',
    document: 'Commercial Driver License',
    expiresOn: 'Feb 14, 2025',
    daysLeft: 24,
  },
  {
    id: 2,
    staff: 'Maria Lopez',
    document: 'First Aid Certification',
    expiresOn: 'Mar 3, 2025',
    daysLeft: 41,
  },
  {
    id: 3,
    staff: 'Mike Rodriguez',
    document: 'DOT Medical Card',
    expiresOn: 'Feb 28, 2025',
    daysLeft: 38,
  },
]

const onboarding = [
  {
    id: 1,
    staff: 'Jess Baker',
    role: 'Guide',
    progress: 5,
    total: 8,
  },
  {
    id: 2,
    staff: 'Ryan Choi',
    role: 'Front Desk',
    progress: 2,
    total: 6,
  },
]

const incidents = [
  {
    id: 1,
    staff: 'Tom Harris',
    type: 'Minor vehicle incident',
    date: 'Jan 18, 2025',
    status: 'open',
  },
]

export default function ManagerHrPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR</h1>
          <p className="mt-1 text-sm text-gray-500">
            Documents, certifications, onboarding, and PTO.
          </p>
        </div>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Start Onboarding
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-bold">{summary.expiringSoon}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Onboarding</p>
              <p className="text-2xl font-bold">{summary.onboardingInProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-100 p-3">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">PTO Pending</p>
              <p className="text-2xl font-bold">{summary.ptoPendingHours}h</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Open Incidents</p>
              <p className="text-2xl font-bold">{summary.incidentsOpen}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-gray-500" />
            Documents & Certifications Expiring Soon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {expiringDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900">{doc.staff}</div>
                <div className="mt-1 text-sm text-gray-600">{doc.document}</div>
                <div className="text-xs text-gray-500">
                  Expires {doc.expiresOn} ({doc.daysLeft} days)
                </div>
              </div>
              <Badge variant={doc.daysLeft <= 30 ? 'warning' : 'info'}>
                {doc.daysLeft} days
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Onboarding In Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {onboarding.map((o) => {
            const pct = Math.round((o.progress / o.total) * 100)
            return (
              <div key={o.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-gray-900">{o.staff}</div>
                    <div className="text-xs text-gray-500">{o.role}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {o.progress} / {o.total} tasks
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Incidents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div>
                <div className="font-medium text-gray-900">{incident.staff}</div>
                <div className="mt-1 text-sm text-gray-600">{incident.type}</div>
                <div className="text-xs text-gray-500">{incident.date}</div>
              </div>
              <Badge variant="warning">Open</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  MapPin, 
  Truck, 
  AlertTriangle,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Wrench,
} from 'lucide-react'

// Mock data - replace with real data from Supabase
const todayStats = {
  staffOnShift: 12,
  locations: 3,
  assetsInUse: 8,
}

const alerts = [
  {
    id: 1,
    type: 'callout',
    message: 'Maria L. (Guide) - 9am tour',
    severity: 'warning',
  },
  {
    id: 2,
    type: 'asset',
    message: 'Bus 7 - issue reported yesterday',
    severity: 'info',
  },
]

const staffOnShift = [
  {
    id: 1,
    name: 'John S.',
    role: 'Driver',
    shift: '6am-2pm',
    asset: 'Bus 12',
    location: 'Route 1',
    status: 'active',
  },
  {
    id: 2,
    name: 'Mike R.',
    role: 'Driver',
    shift: '7am-3pm',
    asset: 'Bus 3',
    location: 'Route 2',
    status: 'active',
  },
  {
    id: 3,
    name: 'Maria L.',
    role: 'Guide',
    shift: '9am-5pm',
    asset: null,
    location: 'Downtown Tour',
    status: 'callout',
  },
  {
    id: 4,
    name: 'Sarah K.',
    role: 'Guide',
    shift: '10am-6pm',
    asset: null,
    location: 'Downtown Tour',
    status: 'active',
  },
  {
    id: 5,
    name: 'Alex T.',
    role: 'Front Desk',
    shift: '8am-4pm',
    asset: null,
    location: 'Main Office',
    status: 'active',
  },
]

const pendingRequests = [
  {
    id: 1,
    type: 'vacation',
    staff: 'Tom H.',
    details: 'Jan 28-30',
  },
  {
    id: 2,
    type: 'open_shift',
    details: '2 applicants for Sat 9am Guide',
  },
]

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  // Group staff by role
  const staffByRole = staffOnShift.reduce((acc, staff) => {
    if (!acc[staff.role]) acc[staff.role] = []
    acc[staff.role].push(staff)
    return acc
  }, {} as Record<string, typeof staffOnShift>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Message All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Staff on Shift</p>
              <p className="text-2xl font-bold">{todayStats.staffOnShift}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-100 p-3">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Locations Active</p>
              <p className="text-2xl font-bold">{todayStats.locations}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-purple-100 p-3">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Assets in Use</p>
              <p className="text-2xl font-bold">{todayStats.assetsInUse}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  {alert.type === 'callout' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Wrench className="h-5 w-5 text-blue-500" />
                  )}
                  <span className="text-sm">{alert.message}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  {alert.type === 'callout' && (
                    <Button size="sm">Find Cover</Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Who's Working Today */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Who&apos;s Working Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(staffByRole).map(([role, staff]) => (
                <div key={role}>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {role}s
                  </h3>
                  <div className="space-y-2">
                    {staff.map((person) => (
                      <div
                        key={person.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          person.status === 'callout' ? 'border-yellow-300 bg-yellow-50' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{person.name}</span>
                            {person.status === 'callout' && (
                              <Badge variant="warning">Called Out</Badge>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-500">
                            <span>{person.shift}</span>
                            {person.asset && <span>{person.asset}</span>}
                            <span>{person.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <a
                            href={`mailto:${person.name.toLowerCase().replace(' ', '.')}@citytours.com`}
                            className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                          <a
                            href={`sms:+15551234567`}
                            className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </a>
                          <a
                            href={`tel:+15551234567`}
                            className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                          {person.status === 'callout' && (
                            <Button size="sm" className="ml-2">
                              Find Cover
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    {request.type === 'vacation' ? (
                      <Calendar className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Users className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium">
                      {request.type === 'vacation' ? 'Vacation' : 'Open Shift'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {request.staff && `${request.staff} • `}
                    {request.details}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {request.type === 'vacation' ? (
                      <>
                        <Button size="sm" variant="outline">Deny</Button>
                        <Button size="sm">Approve</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline">Review</Button>
                    )}
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <p className="text-sm text-gray-500">No pending requests</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

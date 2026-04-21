import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, AlertTriangle } from 'lucide-react'

// Mock data - replace with real data from Supabase
const vacationRequests = [
  {
    id: 1,
    staff: 'Tom Harris',
    type: 'vacation',
    dates: 'Jan 28 – Jan 30',
    hours: 24,
    ptoType: 'vacation',
    note: 'Family trip',
    coverageImpact: 'No other drivers off these days',
    status: 'pending',
  },
  {
    id: 2,
    staff: 'Kelly Wright',
    type: 'sick',
    dates: 'Jan 22 (partial, 9am–1pm)',
    hours: 4,
    ptoType: 'sick',
    note: 'Doctor appointment',
    coverageImpact: '2 other guides on shift',
    status: 'pending',
  },
]

const callouts = [
  {
    id: 1,
    staff: 'Maria L.',
    shift: 'Today 9am-5pm • Downtown Tour',
    reportedAt: '7:42am',
    reason: 'Sick',
  },
]

export default function ManagerRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review time off, swaps, and handle callouts.
        </p>
      </div>

      {callouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Active Callouts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {callouts.map((callout) => (
              <div
                key={callout.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3"
              >
                <div>
                  <div className="font-medium text-gray-900">{callout.staff}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {callout.shift}
                  </div>
                  <div className="text-xs text-gray-500">
                    Reported {callout.reportedAt} • {callout.reason}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Post as Open Shift
                  </Button>
                  <Button size="sm">Find Cover</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Time Off Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {vacationRequests.map((request) => (
            <div key={request.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-gray-900">{request.staff}</span>
                    <Badge variant="info">{request.ptoType}</Badge>
                  </div>
                  <div className="text-sm text-gray-700">
                    {request.dates} <span className="text-gray-500">({request.hours}h)</span>
                  </div>
                  {request.note && (
                    <div className="text-sm text-gray-500">&ldquo;{request.note}&rdquo;</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Coverage impact: {request.coverageImpact}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Deny
                  </Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            </div>
          ))}
          {vacationRequests.length === 0 && (
            <p className="text-sm text-gray-500">No pending requests.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

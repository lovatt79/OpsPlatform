import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Calendar } from 'lucide-react'

// Mock data - replace with real data from Supabase
const ptoBalances = [
  { type: 'Vacation', remaining: 64, unit: 'h' },
  { type: 'Sick', remaining: 32, unit: 'h' },
  { type: 'Personal', remaining: 8, unit: 'h' },
]

const requests = [
  {
    id: 1,
    type: 'Vacation',
    dates: 'Feb 14 – Feb 16',
    hours: 24,
    status: 'pending',
    submittedAt: '2 days ago',
  },
  {
    id: 2,
    type: 'Sick',
    dates: 'Jan 22 (9am–1pm)',
    hours: 4,
    status: 'approved',
    submittedAt: 'last week',
  },
  {
    id: 3,
    type: 'Personal',
    dates: 'Jan 10',
    hours: 8,
    status: 'denied',
    submittedAt: '2 weeks ago',
    note: 'Short staffed that day',
  },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return <Badge variant="success">Approved</Badge>
  if (status === 'pending') return <Badge variant="warning">Pending</Badge>
  return <Badge variant="danger">Denied</Badge>
}

export default function StaffRequestsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Requests</h2>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          New Request
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">PTO Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {ptoBalances.map((b) => (
              <div key={b.type} className="rounded-lg border p-3 text-center">
                <div className="text-xs text-gray-500">{b.type}</div>
                <div className="text-lg font-bold text-gray-900">
                  {b.remaining}
                  {b.unit}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">{request.type}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    {request.dates} <span className="text-gray-500">({request.hours}h)</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Submitted {request.submittedAt}
                  </div>
                  {request.note && (
                    <div className="mt-2 text-sm text-gray-600">
                      Manager note: {request.note}
                    </div>
                  )}
                </div>
                <StatusBadge status={request.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

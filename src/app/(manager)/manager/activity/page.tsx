import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

// Mock data - replace with real data from Supabase
const entries = [
  {
    id: 1,
    when: 'Today 9:14am',
    who: 'Priya S.',
    action: 'published_schedule',
    entity: 'Schedule',
    details: 'Published schedule for week of Jan 27',
  },
  {
    id: 2,
    when: 'Today 8:52am',
    who: 'Priya S.',
    action: 'approved_request',
    entity: 'Vacation Request',
    details: 'Approved Tom H. vacation Jan 28–30',
  },
  {
    id: 3,
    when: 'Today 8:40am',
    who: 'Priya S.',
    action: 'override_compliance',
    entity: 'Compliance',
    details: 'Acknowledged OT warning for John S.',
  },
  {
    id: 4,
    when: 'Yesterday 5:22pm',
    who: 'Dan K.',
    action: 'created_shift',
    entity: 'Shift',
    details: 'Added Sat Feb 1 Guide shift (Downtown Tour)',
  },
  {
    id: 5,
    when: 'Yesterday 2:10pm',
    who: 'Dan K.',
    action: 'resolved_issue',
    entity: 'Asset Issue',
    details: 'Closed issue on Bus 4 (tire replaced)',
  },
]

function actionVariant(action: string): 'default' | 'info' | 'success' | 'warning' | 'danger' {
  if (action.startsWith('approved')) return 'success'
  if (action.startsWith('published') || action.startsWith('created')) return 'info'
  if (action.startsWith('override') || action.startsWith('resolved')) return 'warning'
  if (action.startsWith('deleted') || action.startsWith('denied')) return 'danger'
  return 'default'
}

export default function ManagerActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="mt-1 text-sm text-gray-500">
          Audit trail of manager actions across the platform.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Filter by manager, action, or entity"
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {entries.map((entry) => (
              <div key={entry.id} className="flex flex-wrap items-start gap-3 p-4">
                <div className="w-36 flex-shrink-0 text-xs text-gray-500">
                  {entry.when}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-900">{entry.who}</span>
                    <Badge variant={actionVariant(entry.action)}>
                      {entry.action.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-xs text-gray-500">{entry.entity}</span>
                  </div>
                  <div className="text-sm text-gray-700">{entry.details}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

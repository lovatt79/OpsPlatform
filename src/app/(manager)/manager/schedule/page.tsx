import { Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Send, AlertTriangle, Plus } from 'lucide-react'

// Mock data - replace with real data from Supabase
const weekDays = [
  { key: 'mon', label: 'Mon', date: 'Jan 27' },
  { key: 'tue', label: 'Tue', date: 'Jan 28' },
  { key: 'wed', label: 'Wed', date: 'Jan 29' },
  { key: 'thu', label: 'Thu', date: 'Jan 30' },
  { key: 'fri', label: 'Fri', date: 'Jan 31' },
  { key: 'sat', label: 'Sat', date: 'Feb 1' },
  { key: 'sun', label: 'Sun', date: 'Feb 2' },
]

type ShiftCell =
  | { kind: 'shift'; start: string; end: string; location: string; asset?: string; warning?: string }
  | { kind: 'off' }
  | { kind: 'vacation' }
  | null

type StaffRow = { id: number; name: string; role: string; week: Record<string, ShiftCell> }

const rosterByRole: Record<string, StaffRow[]> = {
  Drivers: [
    {
      id: 1,
      name: 'John S.',
      role: 'Driver',
      week: {
        mon: { kind: 'shift', start: '6am', end: '2pm', location: 'Route 1', asset: 'Bus 12' },
        tue: { kind: 'shift', start: '6am', end: '2pm', location: 'Route 1', asset: 'Bus 12' },
        wed: { kind: 'off' },
        thu: { kind: 'shift', start: '7am', end: '3pm', location: 'Route 2', asset: 'Bus 3' },
        fri: { kind: 'shift', start: '7am', end: '3pm', location: 'Route 2', asset: 'Bus 3' },
        sat: { kind: 'shift', start: '8am', end: '6pm', location: 'Route 1', asset: 'Bus 12', warning: 'OT' },
        sun: { kind: 'off' },
      },
    },
    {
      id: 2,
      name: 'Mike R.',
      role: 'Driver',
      week: {
        mon: { kind: 'shift', start: '7am', end: '3pm', location: 'Route 2', asset: 'Bus 3' },
        tue: { kind: 'off' },
        wed: { kind: 'shift', start: '7am', end: '3pm', location: 'Route 2', asset: 'Bus 3' },
        thu: { kind: 'shift', start: '7am', end: '3pm', location: 'Route 2', asset: 'Bus 3' },
        fri: { kind: 'off' },
        sat: { kind: 'shift', start: '9am', end: '5pm', location: 'Route 3', asset: 'Bus 7' },
        sun: { kind: 'shift', start: '9am', end: '5pm', location: 'Route 3', asset: 'Bus 7' },
      },
    },
  ],
  Guides: [
    {
      id: 3,
      name: 'Maria L.',
      role: 'Guide',
      week: {
        mon: { kind: 'shift', start: '9am', end: '5pm', location: 'Downtown Tour' },
        tue: { kind: 'shift', start: '9am', end: '5pm', location: 'Downtown Tour' },
        wed: { kind: 'vacation' },
        thu: { kind: 'vacation' },
        fri: { kind: 'vacation' },
        sat: { kind: 'off' },
        sun: { kind: 'off' },
      },
    },
    {
      id: 4,
      name: 'Sarah K.',
      role: 'Guide',
      week: {
        mon: { kind: 'shift', start: '10am', end: '6pm', location: 'Downtown Tour' },
        tue: { kind: 'shift', start: '10am', end: '6pm', location: 'Downtown Tour' },
        wed: { kind: 'shift', start: '10am', end: '6pm', location: 'Harbor Tour' },
        thu: { kind: 'off' },
        fri: null,
        sat: { kind: 'shift', start: '10am', end: '6pm', location: 'Harbor Tour' },
        sun: { kind: 'shift', start: '10am', end: '6pm', location: 'Harbor Tour' },
      },
    },
  ],
  'Front Desk': [
    {
      id: 5,
      name: 'Alex T.',
      role: 'Front Desk',
      week: {
        mon: { kind: 'shift', start: '8am', end: '4pm', location: 'Main Office' },
        tue: { kind: 'shift', start: '8am', end: '4pm', location: 'Main Office' },
        wed: { kind: 'shift', start: '8am', end: '4pm', location: 'Main Office' },
        thu: { kind: 'shift', start: '8am', end: '4pm', location: 'Main Office' },
        fri: { kind: 'shift', start: '8am', end: '4pm', location: 'Main Office' },
        sat: { kind: 'off' },
        sun: { kind: 'off' },
      },
    },
  ],
}

const availabilityToday = [
  { name: 'Tom H.', role: 'Driver', note: 'Prefers morning' },
  { name: 'Jess B.', role: 'Guide', note: 'After 2pm only' },
]

function ShiftCellView({ cell }: { cell: ShiftCell }) {
  if (!cell) {
    return (
      <button className="h-full min-h-16 w-full rounded border border-dashed border-gray-200 text-xs text-gray-400 hover:border-primary-400 hover:text-primary-600">
        +
      </button>
    )
  }
  if (cell.kind === 'off') {
    return (
      <div className="flex h-full min-h-16 items-center justify-center rounded bg-gray-50 text-xs text-gray-500">
        Off
      </div>
    )
  }
  if (cell.kind === 'vacation') {
    return (
      <div className="flex h-full min-h-16 items-center justify-center rounded bg-blue-50 text-xs text-blue-700">
        Vacation
      </div>
    )
  }
  return (
    <div className="flex h-full min-h-16 flex-col gap-0.5 rounded border border-primary-100 bg-primary-50 p-1.5 text-left">
      <div className="text-xs font-semibold text-primary-700">
        {cell.start}–{cell.end}
      </div>
      <div className="truncate text-xs text-gray-700">{cell.location}</div>
      {cell.asset && <div className="truncate text-[11px] text-gray-500">{cell.asset}</div>}
      {cell.warning && (
        <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-yellow-700">
          <AlertTriangle className="h-3 w-3" />
          {cell.warning}
        </div>
      )}
    </div>
  )
}

export default function ManagerSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            Week of Jan 27 – Feb 2, 2025
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Copy className="mr-2 h-4 w-4" />
            Copy Previous Week
          </Button>
          <Button size="sm">
            <Send className="mr-2 h-4 w-4" />
            Publish Schedule
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="w-40 p-3">Staff</th>
                  {weekDays.map((day) => (
                    <th key={day.key} className="p-3">
                      <div>{day.label}</div>
                      <div className="text-[11px] font-normal normal-case text-gray-400">
                        {day.date}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(rosterByRole).map(([role, members]) => (
                  <Fragment key={role}>
                    <tr className="bg-gray-50/60">
                      <td
                        colSpan={weekDays.length + 1}
                        className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {role}
                      </td>
                    </tr>
                    {members.map((person) => (
                      <tr key={person.id} className="border-b last:border-b-0">
                        <td className="p-3 align-top">
                          <div className="font-medium text-gray-900">{person.name}</div>
                          <div className="text-xs text-gray-500">{person.role}</div>
                        </td>
                        {weekDays.map((day) => (
                          <td key={day.key} className="p-1.5 align-top">
                            <ShiftCellView cell={person.week[day.key] ?? null} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Warnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
              <div className="text-sm">
                <div className="font-medium text-yellow-900">Overtime threshold</div>
                <div className="text-yellow-800">
                  John S. exceeds 40 weekly hours after Saturday&apos;s shift. Acknowledgment required.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">No hard violations</div>
                <div className="text-gray-500">Schedule is ready to publish.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Availability Helper</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Post Open Shift
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {availabilityToday.map((person) => (
              <div
                key={person.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium text-gray-900">{person.name}</div>
                  <div className="text-xs text-gray-500">{person.role}</div>
                </div>
                <Badge variant="info">{person.note}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

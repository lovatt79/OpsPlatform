import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock } from 'lucide-react'

// Mock data - replace with real data from Supabase
const shifts = [
  {
    id: 1,
    date: 'Sat, Feb 1',
    time: '9:00am - 5:00pm',
    role: 'Guide',
    location: 'Downtown Tour',
    rule: 'applications',
    applicationStatus: null,
  },
  {
    id: 2,
    date: 'Sun, Feb 2',
    time: '10:00am - 6:00pm',
    role: 'Guide',
    location: 'Harbor Tour',
    rule: 'first_come',
    applicationStatus: null,
  },
  {
    id: 3,
    date: 'Mon, Feb 3',
    time: '8:00am - 4:00pm',
    role: 'Guide',
    location: 'Downtown Tour',
    rule: 'applications',
    applicationStatus: 'pending',
  },
]

export default function StaffOpenShiftsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Open Shifts</h2>
        <p className="mt-1 text-sm text-gray-500">
          Browse and claim extra shifts.
        </p>
      </div>

      <div className="space-y-3">
        {shifts.map((shift) => (
          <Card key={shift.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">{shift.date}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {shift.time}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {shift.location}
                  </div>
                  <div className="mt-2">
                    <Badge variant="info">{shift.role}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-3 border-t pt-3">
                {shift.applicationStatus === 'pending' ? (
                  <div className="flex items-center justify-between">
                    <Badge variant="warning">Application pending</Badge>
                    <Button variant="ghost" size="sm">Withdraw</Button>
                  </div>
                ) : shift.rule === 'first_come' ? (
                  <Button className="w-full">Claim Shift</Button>
                ) : (
                  <Button className="w-full">Apply</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {shifts.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-sm text-gray-500">
              No open shifts right now.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

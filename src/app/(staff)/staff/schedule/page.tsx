import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bus, Users } from 'lucide-react'

// Mock data - replace with real data from Supabase
const schedule = [
  {
    id: 1,
    date: 'Today',
    dateFormatted: 'Thu, Jan 22',
    shift: {
      start: '9:00am',
      end: '5:00pm',
      location: 'Downtown Walking Tour',
      locationAddress: 'Meet at Main Office',
      asset: 'Van 3',
      coworkers: [
        { name: 'Mike R.', role: 'Driver' },
        { name: 'Alex T.', role: 'Front Desk' },
      ],
    },
  },
  {
    id: 2,
    date: 'Tomorrow',
    dateFormatted: 'Fri, Jan 23',
    shift: {
      start: '10:00am',
      end: '6:00pm',
      location: 'Harbor Tour',
      locationAddress: 'Marina Dock',
      asset: null,
      coworkers: [],
    },
  },
  {
    id: 3,
    date: 'Sat, Jan 24',
    dateFormatted: 'Sat, Jan 24',
    shift: null, // Day off
  },
  {
    id: 4,
    date: 'Sun, Jan 25',
    dateFormatted: 'Sun, Jan 25',
    shift: {
      start: '8:00am',
      end: '4:00pm',
      location: 'Route 1',
      locationAddress: null,
      asset: 'Bus 12',
      coworkers: [],
    },
  },
]

export default function StaffSchedulePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">My Schedule</h2>
        <span className="text-sm text-gray-500">☀️ 45°F</span>
      </div>

      <div className="space-y-3">
        {schedule.map((day) => (
          <Card key={day.id}>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-gray-900">{day.date}</span>
                <span className="text-sm text-gray-500">{day.dateFormatted}</span>
              </div>

              {day.shift ? (
                <div className="space-y-3">
                  <div className="text-lg font-medium text-primary-600">
                    {day.shift.start} - {day.shift.end}
                  </div>
                  <div className="text-gray-900">{day.shift.location}</div>

                  {day.shift.locationAddress && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {day.shift.locationAddress}
                    </div>
                  )}

                  {day.shift.asset && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Bus className="h-4 w-4" />
                      {day.shift.asset}
                    </div>
                  )}

                  {day.shift.coworkers.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        Working with:
                      </div>
                      <div className="space-y-1">
                        {day.shift.coworkers.map((coworker) => (
                          <div key={coworker.name} className="text-sm">
                            • {coworker.name} ({coworker.role})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {day.date === 'Today' && (
                    <Button variant="outline" className="mt-2 w-full">
                      I Can&apos;t Make It
                    </Button>
                  )}
                </div>
              ) : (
                <Badge variant="default">Off</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

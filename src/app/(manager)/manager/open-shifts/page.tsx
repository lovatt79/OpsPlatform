import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Users, Clock } from 'lucide-react'

// Mock data - replace with real data from Supabase
const openShifts = [
  {
    id: 1,
    date: 'Sat, Feb 1',
    time: '9:00am - 5:00pm',
    role: 'Guide',
    location: 'Downtown Tour',
    rule: 'applications',
    applicants: 2,
    status: 'open',
  },
  {
    id: 2,
    date: 'Sun, Feb 2',
    time: '10:00am - 6:00pm',
    role: 'Driver',
    location: 'Route 3',
    rule: 'first_come',
    applicants: 0,
    status: 'open',
    requiresLicense: true,
  },
  {
    id: 3,
    date: 'Fri, Jan 31',
    time: '7:00am - 3:00pm',
    role: 'Driver',
    location: 'Route 2',
    rule: 'first_come',
    applicants: 1,
    status: 'filled',
    filledBy: 'Mike R.',
  },
]

const applicants = [
  { id: 1, name: 'Jess B.', role: 'Guide', seniority: '2 yrs', note: 'Preferred morning shifts' },
  { id: 2, name: 'Kelly W.', role: 'Guide', seniority: '8 mo', note: 'Available all day' },
]

export default function ManagerOpenShiftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Open Shifts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Post extra shifts and review applicants.
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Post Open Shift
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Posted Shifts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {openShifts.map((shift) => (
            <div
              key={shift.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-900">{shift.date}</span>
                  <span className="text-sm text-gray-500">{shift.time}</span>
                  {shift.status === 'filled' ? (
                    <Badge variant="success">Filled by {shift.filledBy}</Badge>
                  ) : (
                    <Badge variant="info">
                      {shift.rule === 'first_come' ? 'First come, first served' : 'Applications'}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                  <span>{shift.role}</span>
                  <span>{shift.location}</span>
                  {shift.requiresLicense && (
                    <span className="text-gray-500">• License required</span>
                  )}
                </div>
                {shift.rule === 'applications' && shift.status === 'open' && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    {shift.applicants} applicant{shift.applicants === 1 ? '' : 's'}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {shift.status === 'open' && shift.rule === 'applications' && (
                  <Button variant="outline" size="sm">
                    Review Applicants
                  </Button>
                )}
                {shift.status === 'open' && (
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Applicants: Sat Feb 1 Guide Shift
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div>
                <div className="font-medium text-gray-900">{applicant.name}</div>
                <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-gray-500">
                  <span>{applicant.role}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {applicant.seniority}
                  </span>
                  <span>{applicant.note}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Deny
                </Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

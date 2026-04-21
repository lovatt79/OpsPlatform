import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Mail, MessageSquare, Phone } from 'lucide-react'

// Mock data - replace with real data from Supabase
const staff = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Driver',
    email: 'john.smith@citytours.com',
    phone: '(555) 123-4567',
    status: 'active',
    location: 'Main Office',
    hours: 34,
  },
  {
    id: 2,
    name: 'Mike Rodriguez',
    role: 'Driver',
    email: 'mike.r@citytours.com',
    phone: '(555) 234-5678',
    status: 'active',
    location: 'Main Office',
    hours: 40,
  },
  {
    id: 3,
    name: 'Maria Lopez',
    role: 'Guide',
    email: 'maria.l@citytours.com',
    phone: '(555) 345-6789',
    status: 'vacation',
    location: 'Downtown',
    hours: 16,
  },
  {
    id: 4,
    name: 'Sarah Kim',
    role: 'Guide',
    email: 'sarah.k@citytours.com',
    phone: '(555) 456-7890',
    status: 'active',
    location: 'Downtown',
    hours: 38,
  },
  {
    id: 5,
    name: 'Alex Turner',
    role: 'Front Desk',
    email: 'alex.t@citytours.com',
    phone: '(555) 567-8901',
    status: 'active',
    location: 'Main Office',
    hours: 40,
  },
  {
    id: 6,
    name: 'Tom Harris',
    role: 'Driver',
    email: 'tom.h@citytours.com',
    phone: '(555) 678-9012',
    status: 'inactive',
    location: 'Main Office',
    hours: 0,
  },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'active') return <Badge variant="success">Active</Badge>
  if (status === 'vacation') return <Badge variant="info">On Vacation</Badge>
  return <Badge variant="default">Inactive</Badge>
}

export default function ManagerStaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="mt-1 text-sm text-gray-500">
            {staff.length} team members
          </p>
        </div>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, role, or location"
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Roster</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {staff.map((person) => (
            <div
              key={person.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{person.name}</span>
                  <StatusBadge status={person.status} />
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-500">
                  <span>{person.role}</span>
                  <span>{person.location}</span>
                  <span>{person.hours} hrs this week</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={`mailto:${person.email}`}
                  className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label={`Email ${person.name}`}
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href={`sms:${person.phone.replace(/\D/g, '')}`}
                  className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label={`Text ${person.name}`}
                >
                  <MessageSquare className="h-4 w-4" />
                </a>
                <a
                  href={`tel:${person.phone.replace(/\D/g, '')}`}
                  className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label={`Call ${person.name}`}
                >
                  <Phone className="h-4 w-4" />
                </a>
                <Button variant="outline" size="sm" className="ml-2">
                  View
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

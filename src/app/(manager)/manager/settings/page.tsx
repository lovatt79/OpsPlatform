import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, ShieldCheck, Palette } from 'lucide-react'

// Mock data - replace with real data from Supabase
const locations = [
  { id: 1, name: 'Main Office', address: '123 Harbor Way' },
  { id: 2, name: 'Downtown Meetup', address: '45 Market St' },
  { id: 3, name: 'Harbor Dock', address: 'Pier 4' },
]

const roles = [
  { id: 1, name: 'Driver', requiresLicense: true, count: 8 },
  { id: 2, name: 'Guide', requiresLicense: false, count: 6 },
  { id: 3, name: 'Front Desk', requiresLicense: false, count: 3 },
]

const compliancePresets = [
  { id: 'ca', name: 'California', active: true },
  { id: 'fed', name: 'Federal (FLSA)', active: false },
  { id: 'ny', name: 'New York', active: false },
  { id: 'eu', name: 'EU Working Time Directive', active: false },
  { id: 'uk', name: 'UK', active: false },
  { id: 'au', name: 'Australia', active: false },
]

export default function ManagerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your workspace, locations, roles, and compliance rules.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-gray-500" />
            Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Input label="Organization Name" defaultValue="City Tours Co." />
          <Input label="Primary Contact Email" type="email" defaultValue="ops@citytours.com" />
          <Input label="Time Zone" defaultValue="America/New_York" />
          <Input label="Brand Color" defaultValue="#2563eb" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-gray-500" />
            Locations
          </CardTitle>
          <Button variant="outline" size="sm">Add Location</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {locations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <div className="font-medium text-gray-900">{location.name}</div>
                <div className="text-sm text-gray-500">{location.address}</div>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-gray-500" />
            Roles
          </CardTitle>
          <Button variant="outline" size="sm">Add Role</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-gray-900">{role.name}</span>
                {role.requiresLicense && <Badge variant="info">License required</Badge>}
                <span className="text-sm text-gray-500">{role.count} staff</span>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-gray-500" />
            Compliance Preset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {compliancePresets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{preset.name}</span>
                {preset.active && <Badge variant="success">Active</Badge>}
              </div>
              <Button variant={preset.active ? 'outline' : 'ghost'} size="sm">
                {preset.active ? 'Configure' : 'Activate'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StaffProfilePage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your account and preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Profile settings are under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

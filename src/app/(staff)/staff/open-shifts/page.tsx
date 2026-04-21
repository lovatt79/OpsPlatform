import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StaffOpenShiftsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Open Shifts</h2>
        <p className="mt-1 text-sm text-gray-500">
          Browse and claim available shifts.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Open shift browsing is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

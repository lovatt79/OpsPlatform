import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StaffRequestsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Requests</h2>
        <p className="mt-1 text-sm text-gray-500">
          Submit time-off, swaps, and other requests.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Requests are under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManagerAssetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track vehicles, equipment, and availability.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Asset management is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

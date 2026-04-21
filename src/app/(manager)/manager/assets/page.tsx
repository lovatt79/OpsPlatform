import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Truck, Wrench, AlertTriangle, Plus } from 'lucide-react'

// Mock data - replace with real data from Supabase
const assetTypes = [
  { type: 'Bus', total: 14, inUse: 8, maintenance: 1 },
  { type: 'Van', total: 4, inUse: 2, maintenance: 0 },
  { type: 'Kayak', total: 30, inUse: 12, maintenance: 2 },
  { type: 'Radio', total: 25, inUse: 18, maintenance: 0 },
]

const assets = [
  { id: 1, name: 'Bus 3', type: 'Bus', status: 'in_use', assignedTo: 'Mike R. • Route 2' },
  { id: 2, name: 'Bus 7', type: 'Bus', status: 'maintenance', assignedTo: 'Brake inspection' },
  { id: 3, name: 'Bus 12', type: 'Bus', status: 'in_use', assignedTo: 'John S. • Route 1' },
  { id: 4, name: 'Van 3', type: 'Van', status: 'in_use', assignedTo: 'Downtown Walking Tour' },
  { id: 5, name: 'Van 5', type: 'Van', status: 'available', assignedTo: null },
]

const issues = [
  {
    id: 1,
    asset: 'Bus 7',
    reportedBy: 'Mike R.',
    reportedAt: 'Yesterday 4:12pm',
    severity: 'high',
    description: 'Brakes feel soft on downhill sections.',
    status: 'open',
  },
  {
    id: 2,
    asset: 'Radio 14',
    reportedBy: 'Alex T.',
    reportedAt: '2 days ago',
    severity: 'low',
    description: 'Battery does not hold full charge.',
    status: 'open',
  },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'available') return <Badge variant="success">Available</Badge>
  if (status === 'in_use') return <Badge variant="info">In Use</Badge>
  if (status === 'maintenance') return <Badge variant="warning">Maintenance</Badge>
  return <Badge variant="default">Retired</Badge>
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === 'critical') return <Badge variant="danger">Critical</Badge>
  if (severity === 'high') return <Badge variant="danger">High</Badge>
  if (severity === 'medium') return <Badge variant="warning">Medium</Badge>
  return <Badge variant="default">Low</Badge>
}

export default function ManagerAssetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track vehicles, equipment, and reported issues.
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {assetTypes.map((t) => (
          <Card key={t.type}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-3">
                  <Truck className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{t.type}s</div>
                  <div className="text-2xl font-bold">{t.total}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                <span>{t.inUse} in use</span>
                {t.maintenance > 0 && (
                  <span className="text-yellow-700">• {t.maintenance} maintenance</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Open Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-gray-900">{issue.asset}</span>
                  <SeverityBadge severity={issue.severity} />
                </div>
                <div className="text-sm text-gray-700">{issue.description}</div>
                <div className="text-xs text-gray-500">
                  Reported by {issue.reportedBy} • {issue.reportedAt}
                </div>
              </div>
              <Button variant="outline" size="sm">
                Mark Resolved
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{asset.name}</span>
                  <span className="text-xs text-gray-500">{asset.type}</span>
                  <StatusBadge status={asset.status} />
                </div>
                {asset.assignedTo && (
                  <div className="mt-1 text-sm text-gray-500">{asset.assignedTo}</div>
                )}
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

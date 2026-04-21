import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Upload, FileText } from 'lucide-react'

// Mock data - replace with real data from Supabase
const profile = {
  name: 'Jamie Rivera',
  role: 'Guide',
  email: 'jamie.rivera@citytours.com',
  phone: '(555) 789-0123',
  startedOn: 'Mar 2023',
}

const certifications = [
  { id: 1, name: 'First Aid / CPR', status: 'valid', expiresOn: 'Aug 12, 2025' },
  { id: 2, name: 'City Tour Guide License', status: 'valid', expiresOn: 'Dec 1, 2025' },
  { id: 3, name: 'Food Handler Card', status: 'expiring', expiresOn: 'Feb 28, 2025' },
]

const documents = [
  { id: 1, name: 'Employment Contract', uploadedOn: 'Mar 2023' },
  { id: 2, name: 'I-9 Verification', uploadedOn: 'Mar 2023' },
  { id: 3, name: 'Direct Deposit Form', uploadedOn: 'Apr 2023' },
]

function CertBadge({ status }: { status: string }) {
  if (status === 'valid') return <Badge variant="success">Valid</Badge>
  if (status === 'expiring') return <Badge variant="warning">Expiring Soon</Badge>
  return <Badge variant="danger">Expired</Badge>
}

export default function StaffProfilePage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your info, certifications, and documents.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{profile.name}</div>
              <div className="text-sm text-gray-500">
                {profile.role} • Since {profile.startedOn}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t pt-4">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <Mail className="h-4 w-4 text-gray-400" />
              {profile.email}
            </a>
            <a
              href={`tel:${profile.phone.replace(/\D/g, '')}`}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <Phone className="h-4 w-4 text-gray-400" />
              {profile.phone}
            </a>
          </div>

          <Button variant="outline" className="mt-4 w-full">
            Edit Contact Info
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <div className="font-medium text-gray-900">{cert.name}</div>
                <div className="text-xs text-gray-500">Expires {cert.expiresOn}</div>
              </div>
              <CertBadge status={cert.status} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Documents</CardTitle>
          <Button variant="outline" size="sm">
            <Upload className="mr-1 h-4 w-4" />
            Upload
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{doc.name}</div>
                  <div className="text-xs text-gray-500">Uploaded {doc.uploadedOn}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

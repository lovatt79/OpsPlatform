import { ManagerSidebar } from '@/components/manager/sidebar'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <ManagerSidebar />
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

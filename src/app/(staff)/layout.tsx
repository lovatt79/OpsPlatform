'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, ClipboardList, Hand, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Schedule', href: '/staff/schedule', icon: Calendar },
  { name: 'Open', href: '/staff/open-shifts', icon: ClipboardList },
  { name: 'Requests', href: '/staff/requests', icon: Hand },
  { name: 'Profile', href: '/staff/profile', icon: User },
]

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Ops Platform</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto px-4 py-4">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="sticky bottom-0 border-t bg-white">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 text-xs',
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

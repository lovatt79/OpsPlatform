import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format time for display (e.g., "6:00 AM")
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Format time short (e.g., "6a" or "2p")
 */
export function formatTimeShort(time: string): string {
  const [hours] = time.split(':').map(Number)
  const period = hours >= 12 ? 'p' : 'a'
  const displayHours = hours % 12 || 12
  return `${displayHours}${period}`
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format date range
 */
export function formatDateRange(start: string | Date, end: string | Date): string {
  const startDate = typeof start === 'string' ? new Date(start) : start
  const endDate = typeof end === 'string' ? new Date(end) : end
  
  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  
  return `${startStr} - ${endStr}`
}

/**
 * Calculate hours between two times
 */
export function calculateHours(startTime: string, endTime: string, breakMinutes: number = 0): number {
  const [startHours, startMins] = startTime.split(':').map(Number)
  const [endHours, endMins] = endTime.split(':').map(Number)
  
  const startMinutes = startHours * 60 + startMins
  const endMinutes = endHours * 60 + endMins
  
  const totalMinutes = endMinutes - startMinutes - breakMinutes
  return Math.round((totalMinutes / 60) * 100) / 100
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Format phone number for tel: link
 */
export function formatPhoneLink(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

/**
 * Format SMS link with optional body
 */
export function formatSmsLink(phone: string, body?: string): string {
  const cleanPhone = phone.replace(/[^+\d]/g, '')
  if (body) {
    return `sms:${cleanPhone}?body=${encodeURIComponent(body)}`
  }
  return `sms:${cleanPhone}`
}

/**
 * Format email link with optional subject and body
 */
export function formatEmailLink(email: string, subject?: string, body?: string): string {
  let link = `mailto:${email}`
  const params: string[] = []
  
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(body)}`)
  
  if (params.length > 0) {
    link += `?${params.join('&')}`
  }
  
  return link
}

/**
 * Get week start date (Monday)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get days of the week starting from a date
 */
export function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push(day)
  }
  return days
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Pluralize a word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular
  return plural || `${singular}s`
}

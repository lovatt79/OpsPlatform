import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Staff } from '@/types/database'

export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentStaff(): Promise<Staff | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('staff')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  return data
}

export async function requireStaff(): Promise<Staff> {
  const staff = await getCurrentStaff()
  if (!staff) redirect('/login')
  return staff
}

export async function requireManager(): Promise<Staff> {
  const staff = await requireStaff()
  if (!staff.is_manager) redirect('/staff/schedule')
  return staff
}

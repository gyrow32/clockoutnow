import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface BookingSubmission {
  name: string
  email: string
  company?: string
  service: string
  budget?: string
  message: string
  created_at?: string
}

export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
  created_at?: string
}

export async function submitBooking(data: BookingSubmission) {
  const { error } = await supabase
    .from('bookings')
    .insert([{ ...data, created_at: new Date().toISOString() }])

  if (error) throw error
  return true
}

export async function submitContact(data: ContactSubmission) {
  const { error } = await supabase
    .from('contacts')
    .insert([{ ...data, created_at: new Date().toISOString() }])

  if (error) throw error
  return true
}

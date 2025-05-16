import { createClient } from "@supabase/supabase-js"

// Server-side environment variables
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

// if (!supabaseUrl) {
//   throw new Error('Missing env.SUPABASE_URL')
// }
// if (!supabaseAnonKey) {
//   throw new Error('Missing env.SUPABASE_ANON_KEY')
// }

// Create a single supabase client for the server
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}

// Client-side environment variables
const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!publicSupabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!publicSupabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Create a singleton client for the browser to avoid multiple instances
let browserClient: ReturnType<typeof createClient> | undefined

export const createBrowserSupabaseClient = () => {
  if (browserClient) return browserClient

  browserClient = createClient(
    publicSupabaseUrl,
    publicSupabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'x-application-name': 'doctors-profile'
        }
      }
    }
  )

  return browserClient
}

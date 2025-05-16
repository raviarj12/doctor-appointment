import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create the appointments table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS appointments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          doctor TEXT NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TEXT NOT NULL,
          patient_name TEXT NOT NULL,
          contact_number TEXT NOT NULL,
          medical_reason TEXT NOT NULL,
          additional_notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status TEXT DEFAULT 'confirmed'
        )
      `
    })

    if (createTableError) {
      console.error("Error creating table:", createTableError)
      return NextResponse.json({ success: false, error: createTableError.message }, { status: 500 })
    }

    // Create indexes for faster queries
    const { error: createIndexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor);
        CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
      `
    })

    if (createIndexError) {
      console.error("Error creating indexes:", createIndexError)
      return NextResponse.json({ success: false, error: createIndexError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ success: false, error: "Failed to set up database" }, { status: 500 })
  }
}

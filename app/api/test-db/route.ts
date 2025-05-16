import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Test the connection by querying the doctors table
    const { data: doctors, error } = await supabase
      .from("doctors")
      .select("*")
      .limit(5)

    if (error) {
      return NextResponse.json(
        { error: "Database connection failed", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      doctors: doctors
    })
  } catch (error: unknown) {
    console.error("Database test error:", error)
    return NextResponse.json(
      { error: "Failed to test database connection" },
      { status: 500 }
    )
  }
} 
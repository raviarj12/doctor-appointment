"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

type AppointmentData = {
  doctor: string
  date: string
  time: string
  patientName: string
  contactNumber: string
  medicalReason: string
  additionalNotes: string
}

interface AppointmentResult {
  success: boolean
  message: string
  error?: string
  appointmentId?: string | null
  emailError?: string | null
}

export async function sendAppointmentEmail(data: AppointmentData) {
  try {
    // Log the appointment data for debugging
    console.log("Appointment data:", data)

    // Save appointment to database
    const supabase = createServerSupabaseClient()

    // Create the appointments table if it doesn't exist
    try {
      const { error: createTableError } = await supabase
        .from("appointments")
        .select("*")
        .limit(1)
        .maybeSingle()

      if (createTableError) {
        console.error("Error checking table:", createTableError)
        return {
          success: false,
          message: "Database error: Unable to verify appointments table",
          error: createTableError.message
        }
      }
    } catch (tableError: unknown) {
      console.error("Error setting up table:", tableError)
      return {
        success: false,
        message: "Database error: Failed to set up appointments table",
        error: tableError instanceof Error ? tableError.message : "Unknown table error"
      }
    }

    // Insert the appointment data
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from("appointments")
        .insert({
          doctor: data.doctor,
          appointment_date: new Date(data.date).toISOString().split("T")[0],
          appointment_time: data.time,
          patient_name: data.patientName,
          contact_number: data.contactNumber,
          medical_reason: data.medicalReason,
          additional_notes: data.additionalNotes,
        })
        .select()

      if (insertError) {
        console.error("Error inserting appointment:", insertError)
        return {
          success: false,
          message: "Failed to save appointment to database",
          error: insertError.message
        }
      }

      console.log("Appointment saved to database:", insertedData)
    } catch (dbError: unknown) {
      console.error("Database operation failed:", dbError)
      return {
        success: false,
        message: "Database error: Failed to save appointment",
        error: dbError instanceof Error ? dbError.message : "Unknown database error"
      }
    }

    // Call our API route to handle the email sending
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data,
        }),
        cache: "no-store",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API response not OK:", errorText)
        return {
          success: false,
          message: "Failed to send email notification",
          error: `Email API responded with status ${response.status}: ${errorText}`
        }
      }

      const result = await response.json()
      console.log("Email API response:", result)

      // Revalidate the appointments page if it exists
      revalidatePath("/admin/appointments")

      return {
        success: true,
        message: "Appointment booked successfully and email notification sent.",
      }
    } catch (fetchError: unknown) {
      console.error("Error sending email notification:", fetchError)
      return {
        success: false,
        message: "Failed to send email notification",
        error: fetchError instanceof Error ? fetchError.message : "Unknown email error"
      }
    }
  } catch (error: unknown) {
    console.error("Error processing appointment:", error)
    return {
      success: false,
      message: "Failed to process appointment",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function createAppointment(formData: FormData): Promise<AppointmentResult> {
  try {
    const supabase = createServerSupabaseClient()
    
    // Extract form data
    const doctor = formData.get('doctor') as string
    const appointmentDate = formData.get('appointment_date') as string
    const appointmentTime = formData.get('appointment_time') as string
    const patientName = formData.get('patient_name') as string
    const contactNumber = formData.get('contact_number') as string
    const medicalReason = formData.get('medical_reason') as string
    const additionalNotes = formData.get('additional_notes') as string

    // Insert appointment into database
    const { data: appointment, error: dbError } = await supabase
      .from('appointments')
      .insert({
        doctor,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        patient_name: patientName,
        contact_number: contactNumber,
        medical_reason: medicalReason,
        additional_notes: additionalNotes,
        status: 'pending' // Always set initial status as pending
      })
      .select()
      .single()

    if (dbError) {
      return {
        success: false,
        message: 'Failed to create appointment',
        error: dbError.message,
        appointmentId: null,
        emailError: null
      }
    }

    // Try to send email notification
    try {
      await sendAppointmentEmail({
        doctor,
        date: appointmentDate,
        time: appointmentTime,
        patientName,
        contactNumber,
        medicalReason,
        additionalNotes
      })
    } catch (emailError) {
      return {
        success: true,
        message: 'Appointment created but failed to send email notification',
        appointmentId: appointment.id,
        emailError: emailError instanceof Error ? emailError.message : 'Failed to send email'
      }
    }

    return {
      success: true,
      message: 'Appointment created successfully',
      appointmentId: appointment.id,
      emailError: null
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create appointment',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      appointmentId: null,
      emailError: null
    }
  }
}

export async function getAppointments() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })

    if (error) {
      console.error("Error fetching appointments:", error)
      return {
        success: false,
        message: "Failed to fetch appointments",
        error: error.message
      }
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error: unknown) {
    console.error("Error in getAppointments:", error)
    return {
      success: false,
      message: "Failed to fetch appointments",
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

export async function getAppointmentsByDoctor(doctor: string) {
  try {
    const supabase = createServerSupabaseClient()

    // First check if the table exists
    try {
      const { data: tableExists } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_name", "appointments")
        .single()

      if (!tableExists) {
        console.log("Appointments table doesn't exist yet")
        return { appointments: [] }
      }
    } catch (checkError: unknown) {
      console.error("Error checking if table exists:", checkError)
      // If we can't check, we'll try to query anyway
    }

    // Try to get appointments for the doctor
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("doctor", doctor)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })

      if (error) {
        console.error("Error fetching appointments:", error)
        throw new Error(`Database error: ${error.message}`)
      }

      return { appointments: data || [] }
    } catch (queryError: unknown) {
      console.error("Error in appointments query:", queryError)
      return { appointments: [] }
    }
  } catch (error: unknown) {
    console.error("Error in getAppointmentsByDoctor:", error)
    return { appointments: [], error: "Failed to fetch appointments" }
  }
}

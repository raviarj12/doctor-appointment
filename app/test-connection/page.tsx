'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'

export default function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createBrowserSupabaseClient()
        
        // Test doctors table
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('doctors')
          .select('*')
          .limit(5)

        if (doctorsError) {
          setStatus('error')
          setError(doctorsError.message)
          return
        }

        // Test appointments table
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .limit(5)

        if (appointmentsError) {
          setStatus('error')
          setError(appointmentsError.message)
          return
        }

        setStatus('success')
        setDoctors(doctorsData || [])
        setAppointments(appointmentsData || [])
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Failed to connect to database')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      {status === 'loading' && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Testing database connection...
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {status === 'success' && (
        <div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Successfully connected to database!
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Doctors:</h2>
              <div className="grid gap-4">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="border p-4 rounded">
                    <h3 className="font-bold">{doctor.name}</h3>
                    <p>Specialization: {doctor.specialization}</p>
                    <p>Email: {doctor.email}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Appointments:</h2>
              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border p-4 rounded">
                    <h3 className="font-bold">{appointment.patient_name}</h3>
                    <p>Doctor: {appointment.doctor}</p>
                    <p>Date: {appointment.appointment_date}</p>
                    <p>Time: {appointment.appointment_time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'

export default function TestStorage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function testStorage() {
    setStatus('loading')
    setError(null)
    setMessage(null)

    try {
      const supabase = createBrowserSupabaseClient()
      
      // Try to insert a test appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          doctor: 'Dr. Test Doctor',
          appointment_date: new Date().toISOString().split('T')[0],
          appointment_time: '11:00 AM',
          patient_name: 'Test Patient',
          contact_number: '123-456-7890',
          medical_reason: 'Test appointment',
          additional_notes: 'Testing data storage'
        })
        .select()

      if (error) {
        setStatus('error')
        setError(error.message)
        return
      }

      setStatus('success')
      setMessage('Successfully stored test appointment!')
      console.log('Stored data:', data)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to store data')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Data Storage</h1>
      
      <button
        onClick={testStorage}
        disabled={status === 'loading'}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {status === 'loading' ? 'Testing...' : 'Test Data Storage'}
      </button>

      {status === 'loading' && (
        <div className="mt-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Testing data storage...
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}
    </div>
  )
} 
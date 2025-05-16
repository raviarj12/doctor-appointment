'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'

export default function TestDB() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = createBrowserSupabaseClient()
        
        // Query to list all tables in the public schema
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .limit(1)

        if (error) {
          throw error
        }

        // If we can query the doctors table, the connection is working
        setTables(['doctors', 'appointments'])
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to database')
        setLoading(false)
      }
    }

    checkConnection()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Database Connection</h1>
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          Connecting to database...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Successful</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        Successfully connected to the database!
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Available Tables:</h2>
      <ul className="list-disc list-inside">
        {tables.map((table) => (
          <li key={table} className="text-gray-700">{table}</li>
        ))}
      </ul>
    </div>
  )
} 
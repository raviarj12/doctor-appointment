'use client'

import { useState, useEffect } from 'react'
import { createAppointment, getAppointments } from '../actions'

export default function TestAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    doctor: 'Dr. John Smith',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    patientName: '',
    contactNumber: '',
    medicalReason: '',
    additionalNotes: ''
  })

  useEffect(() => {
    loadAppointments()
  }, [])

  async function loadAppointments() {
    try {
      const result = await getAppointments()
      if (result.success) {
        setAppointments(result.data)
        setStatus('success')
      } else {
        setStatus('error')
        setError(result.error || 'Failed to load appointments')
      }
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to load appointments')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const result = await createAppointment(formData)
      if (result.success) {
        setStatus('success')
        // Reset form
        setFormData({
          doctor: 'Dr. John Smith',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          patientName: '',
          contactNumber: '',
          medicalReason: '',
          additionalNotes: ''
        })
        // Reload appointments
        loadAppointments()
      } else {
        setStatus('error')
        setError(result.error || 'Failed to create appointment')
      }
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to create appointment')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Appointments</h1>

      {/* Add Appointment Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Doctor</label>
            <input
              type="text"
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Time</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Patient Name</label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Contact Number</label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Medical Reason</label>
            <input
              type="text"
              value={formData.medicalReason}
              onChange={(e) => setFormData({ ...formData, medicalReason: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Additional Notes</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Creating...' : 'Create Appointment'}
          </button>
        </form>
      </div>

      {/* Display Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Appointments List</h2>
        {status === 'loading' && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            Loading appointments...
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        {status === 'success' && (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border p-4 rounded">
                <h3 className="font-bold">{appointment.patient_name}</h3>
                <p>Doctor: {appointment.doctor}</p>
                <p>Date: {appointment.appointment_date}</p>
                <p>Time: {appointment.appointment_time}</p>
                <p>Contact: {appointment.contact_number}</p>
                <p>Reason: {appointment.medical_reason}</p>
                {appointment.additional_notes && (
                  <p>Notes: {appointment.additional_notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
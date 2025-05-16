import { getAppointments } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, Clock } from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: string
  patient_name: string
  doctor: string
  appointment_date: string
  appointment_time: string
  medical_reason: string
}

export default async function AdminDashboard() {
  const { appointments } = await getAppointments()

  // Count today's appointments
  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((apt: Appointment) => apt.appointment_date === today)

  // Count upcoming appointments (excluding today)
  const upcomingAppointments = appointments.filter((apt: Appointment) => apt.appointment_date > today)

  // Get unique doctors
  const uniqueDoctors = [...new Set(appointments.map((apt: Appointment) => apt.doctor))]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-sky-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <CalendarDays className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-gray-500 mt-1">Appointments scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Clock className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-500 mt-1">Future scheduled appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <Users className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDoctors.length}</div>
            <p className="text-xs text-gray-500 mt-1">Doctors with appointments</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-sky-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/appointments" className="bg-sky-50 hover:bg-sky-100 p-4 rounded-lg flex items-center">
            <CalendarDays className="h-5 w-5 mr-3 text-sky-600" />
            <div>
              <h3 className="font-medium">View All Appointments</h3>
              <p className="text-sm text-gray-500">Manage patient appointments</p>
            </div>
          </Link>

          <Link href="/" className="bg-sky-50 hover:bg-sky-100 p-4 rounded-lg flex items-center">
            <Users className="h-5 w-5 mr-3 text-sky-600" />
            <div>
              <h3 className="font-medium">Return to Main Site</h3>
              <p className="text-sm text-gray-500">View the patient-facing website</p>
            </div>
          </Link>
        </div>
      </div>

      {appointments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-sky-900">Recent Appointments</h2>
            <Link href="/admin/appointments" className="text-sm text-sky-600 hover:text-sky-800">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Patient</th>
                  <th className="text-left py-3 px-4 font-medium">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Time</th>
                  <th className="text-left py-3 px-4 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((appointment: Appointment) => (
                  <tr key={appointment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{appointment.patient_name}</td>
                    <td className="py-3 px-4">{appointment.doctor}</td>
                    <td className="py-3 px-4">{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{appointment.appointment_time}</td>
                    <td className="py-3 px-4">{appointment.medical_reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
} 
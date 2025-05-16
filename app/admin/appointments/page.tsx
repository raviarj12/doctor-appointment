import { getAppointments } from "@/app/actions"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Phone, FileText } from "lucide-react"

interface Appointment {
  id: string
  patient_name: string
  doctor: string
  appointment_date: string
  appointment_time: string
  contact_number: string
  medical_reason: string
  additional_notes?: string
  status: "confirmed" | "pending" | "cancelled"
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export default async function AppointmentsPage() {
  const { appointments, error } = await getAppointments()

  const getBadgeVariant = (status: Appointment["status"]): BadgeVariant => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-sky-900">Appointment Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No appointments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment: Appointment) => (
            <Card key={appointment.id} className="overflow-hidden border-l-4 border-l-sky-500">
              <CardHeader className="bg-sky-50 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-sky-900">{appointment.patient_name}</CardTitle>
                    <CardDescription>{appointment.doctor}</CardDescription>
                  </div>
                  <Badge variant={getBadgeVariant(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{format(new Date(appointment.appointment_date), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{appointment.appointment_time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{appointment.contact_number}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <FileText className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <p className="font-medium">{appointment.medical_reason}</p>
                      {appointment.additional_notes && (
                        <p className="text-gray-500 mt-1">{appointment.additional_notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAppointments } from "@/app/actions"
import { CalendarDays, Phone, User } from "lucide-react"

interface DoctorDetails {
  specialty: string
  experience: string
  contact: string
}

interface Doctor {
  name: string
  appointmentCount: number
  details: DoctorDetails
}

interface Appointment {
  doctor: string
}

export default async function DoctorsPage() {
  const { appointments } = await getAppointments()

  // Get unique doctors and their appointment counts
  const doctorsMap = appointments.reduce(
    (acc: Record<string, Doctor>, apt: Appointment) => {
      if (!acc[apt.doctor]) {
        acc[apt.doctor] = {
          name: apt.doctor,
          appointmentCount: 0,
          // Hard-coded doctor details based on our known doctors
          details: apt.doctor.includes("Pruthaviraj")
            ? {
                specialty: "Physiotherapist",
                experience: "4 Years",
                contact: "9714234046",
              }
            : {
                specialty: "BHMS Doctor",
                experience: "6 Years",
                contact: "8866924046",
              },
        }
      }
      acc[apt.doctor].appointmentCount++
      return acc
    },
    {} as Record<string, Doctor>,
  )

  const doctors: Doctor[] = Object.values(doctorsMap)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-sky-900">Doctors</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.length > 0 ? (
          doctors.map((doctor: Doctor) => (
            <Card key={doctor.name} className="overflow-hidden">
              <CardHeader className="bg-sky-50 pb-2">
                <CardTitle className="text-sky-900">{doctor.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{doctor.details.specialty}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{doctor.details.experience} Experience</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>+91 {doctor.details.contact}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium">Total Appointments</div>
                    <div className="text-2xl font-bold text-sky-600 mt-1">{doctor.appointmentCount}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500 text-lg">No doctors found.</p>
          </div>
        )}
      </div>
    </div>
  )
} 
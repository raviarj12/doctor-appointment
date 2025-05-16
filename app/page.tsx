"use client"

import { useState } from "react"
import { Phone, Calendar, User, PhoneIcon, Check } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createAppointment } from './actions'
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AppointmentResult {
  success: boolean;
  message: string;
  error?: string;
  appointmentId?: number;
}

export default function DoctorsProfile() {
  const [bookingDoctor, setBookingDoctor] = useState<string | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [illness, setIllness] = useState("")
  const [notes, setNotes] = useState("")
  const [isBookingComplete, setIsBookingComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailStatus, setEmailStatus] = useState<string | null>(null)
  const [appointmentId, setAppointmentId] = useState<number | null>(null)
  const router = useRouter()

  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00"
  ]

  const illnessList = [
    "Fever", "Cough", "Cold", "Headache", "Body Pain", "Injury", "Other",
  ]

  const handleBookAppointment = (doctorName: string) => {
    setBookingDoctor(doctorName)
    setBookingStep(1)
    setIsBookingComplete(false)
    setEmailStatus(null)
    setAppointmentId(null)
    setDate(null)
    setTime("")
    setName("")
    setContact("")
    setIllness("")
    setNotes("")
  }

  const handleNextStep = () => setBookingStep((step) => step + 1)
  const handlePrevStep = () => setBookingStep((step) => step - 1)
  const closeDialog = () => setBookingDoctor(null)

  const handleConfirmBooking = async () => {
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('doctor', bookingDoctor || "")
    formData.append('appointment_date', date ? format(date, "yyyy-MM-dd") : "")
    formData.append('appointment_time', time)
    formData.append('patient_name', name)
    formData.append('contact_number', contact)
    formData.append('medical_reason', illness)
    formData.append('additional_notes', notes || "None")
    const result = await createAppointment(formData) as AppointmentResult
    setIsSubmitting(false)
    if (result.success) {
      setIsBookingComplete(true)
      setAppointmentId(result.appointmentId || null)
      setEmailStatus("success")
    } else {
      setEmailStatus("error")
      toast({
        title: "Booking Failed",
        description: result.message || "There was an issue booking your appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background medical image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/medical-bg-full.jpg"
          alt="Medical Background"
          fill
          className="object-cover opacity-15"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-12 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2">Medical Specialists</h1>
            <p className="text-sky-700 text-lg">Professional Healthcare Services</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/admin" className="bg-sky-100 hover:bg-sky-200 text-sky-800 py-2 px-4 rounded-md">
              Admin Dashboard
            </Link>
          </div>
        </header>

        {/* Doctors Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Doctor 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-sky-100 hover:shadow-xl transition-shadow">
            <div className="bg-sky-700 h-24 relative">
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                <div className="w-32 h-32 rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full bg-sky-100 flex items-center justify-center">
                    <span className="text-4xl text-sky-700 font-bold">JP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Dr. Jadav Pruthaviraj</h2>
              <p className="text-sky-600 text-center font-medium mb-4">Physiotherapist</p>

              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium text-gray-800">4 Years</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Contact</span>
                  <a href="tel:9714234046" className="flex items-center text-sky-700 font-medium hover:text-sky-800">
                    <Phone className="h-4 w-4 mr-1" />
                    +91 9714234046
                  </a>
                </div>
              </div>

              <Button
                className="w-full mt-8 bg-sky-600 hover:bg-sky-700 text-white"
                onClick={() => handleBookAppointment("Dr. Jadav Pruthaviraj")}
              >
                Book Appointment
              </Button>
            </div>
          </div>

          {/* Doctor 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-sky-100 hover:shadow-xl transition-shadow">
            <div className="bg-sky-700 h-24 relative">
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                <div className="w-32 h-32 rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full bg-sky-100 flex items-center justify-center">
                    <span className="text-4xl text-sky-700 font-bold">JA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Dr. Jadav Apexa</h2>
              <p className="text-sky-600 text-center font-medium mb-4">BHMS Doctor</p>

              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium text-gray-800">6 Years</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Contact</span>
                  <a href="tel:8866924046" className="flex items-center text-sky-700 font-medium hover:text-sky-800">
                    <Phone className="h-4 w-4 mr-1" />
                    +91 8866924046
                  </a>
                </div>
              </div>

              <Button
                className="w-full mt-8 bg-sky-600 hover:bg-sky-700 text-white"
                onClick={() => handleBookAppointment("Dr. Jadav Apexa")}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Medical Specialists. All rights reserved.</p>
        </footer>
      </div>

      {/* Appointment Booking Dialog */}
      <Dialog open={bookingDoctor !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-sky-900">
              {isBookingComplete ? "Appointment Confirmed!" : `Book Appointment with ${bookingDoctor}`}
            </DialogTitle>
            <DialogDescription>
              {isBookingComplete
                ? "Your appointment has been successfully booked. We will contact you shortly."
                : bookingStep === 1
                  ? "Select date and time for your appointment"
                  : bookingStep === 2
                    ? "Enter your details and medical reason"
                    : "Review and confirm your appointment"}
            </DialogDescription>
          </DialogHeader>

          {isBookingComplete ? (
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
              <p className="text-center text-gray-500 mb-2">
                Your appointment with {bookingDoctor} has been scheduled for {date && format(date, "MMMM d, yyyy")} at {time}.
              </p>
              <p className="text-center text-gray-500 mb-6">
                {emailStatus === "success"
                  ? "A confirmation email has been sent to the clinic."
                  : emailStatus === "error"
                    ? "There was an issue sending the email notification, but your appointment is confirmed."
                    : "Your appointment is confirmed."}
              </p>
              <Button onClick={closeDialog}>Close</Button>
            </div>
          ) : (
            <>
              {bookingStep === 1 && (
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={
                            (date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0 // Disable Sundays
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Select Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <div className="flex">
                      <User className="h-4 w-4 mr-2 mt-3 text-gray-500" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <div className="flex">
                      <PhoneIcon className="h-4 w-4 mr-2 mt-3 text-gray-500" />
                      <Input
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="illness">Medical Reason</Label>
                    <Select value={illness} onValueChange={setIllness}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your medical reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {illnessList.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional information about your condition"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="py-4">
                  <div className="bg-sky-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-sky-900 mb-3">Appointment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Doctor:</span>
                        <span className="font-medium">{bookingDoctor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{date && format(date, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time:</span>
                        <span className="font-medium">{time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Patient:</span>
                        <span className="font-medium">{name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contact:</span>
                        <span className="font-medium">{contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reason:</span>
                        <span className="font-medium">{illness}</span>
                      </div>
                      {notes && (
                        <div>
                          <span className="text-gray-500 block">Notes:</span>
                          <span className="font-medium mt-1">{notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Please confirm your appointment details. A notification will be sent to the clinic.
                  </p>
                </div>
              )}

              <div className="flex justify-between mt-6">
                {bookingStep > 1 ? (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}

                {bookingStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (bookingStep === 1 && (!date || !time)) || (bookingStep === 2 && (!name || !contact || !illness))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleConfirmBooking} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

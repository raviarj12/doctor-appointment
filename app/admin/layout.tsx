import type React from "react"
import Link from "next/link"
import { CalendarDays, Home, Users } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-sky-900">Admin Dashboard</h2>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-1">
            <Link
              href="/"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-700 rounded-md"
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>
            <Link
              href="/admin/appointments"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-700 rounded-md"
            >
              <CalendarDays className="h-5 w-5 mr-3" />
              Appointments
            </Link>
            <Link
              href="/admin/doctors"
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-700 rounded-md"
            >
              <Users className="h-5 w-5 mr-3" />
              Doctors
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm py-4 px-6 md:hidden">
          <h2 className="text-xl font-bold text-sky-900">Admin Dashboard</h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
} 
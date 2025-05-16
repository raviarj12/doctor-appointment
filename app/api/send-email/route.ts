import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { data } = await request.json()

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "rj06an24ce@gmail.com",
      subject: `New Appointment: ${data.patientName} with ${data.doctor}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #0369a1; text-align: center;">New Appointment Booking</h2>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #0369a1;">Appointment Details</h3>
            <p><strong>Doctor:</strong> ${data.doctor}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Patient Name:</strong> ${data.patientName}</p>
            <p><strong>Contact Number:</strong> ${data.contactNumber}</p>
            <p><strong>Medical Reason:</strong> ${data.medicalReason}</p>
            <p><strong>Additional Notes:</strong> ${data.additionalNotes}</p>
          </div>
          <p style="text-align: center; color: #666;">This is an automated message from your clinic appointment system.</p>
        </div>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.response)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error in email API route:", error)
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
  }
}

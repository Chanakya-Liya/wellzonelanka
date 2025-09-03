import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, convertDocToJSON } from "@/app/lib/api/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Get query parameters
    const email = request.nextUrl.searchParams.get("email")

    // Build query
    const query: any = {}
    if (email) {
      query.email = email
    }

    // Fetch appointments from MongoDB
    const appointments = await db.collection("doctorAppointments").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      appointments: convertDocToJSON(appointments),
    })
  } catch (error) {
    console.error("Error fetching doctor appointments:", error)
    return NextResponse.json({ error: "Failed to fetch doctor appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.date || !data.timeSlot || !data.doctor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Format the doctor name from the ID
    const doctorName = data.doctor
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Format the time
    const time = data.timeSlot.includes(":")
      ? data.timeSlot
      : `${
          Number.parseInt(data.timeSlot) > 12 ? Number.parseInt(data.timeSlot) - 12 : data.timeSlot
        }:00 ${Number.parseInt(data.timeSlot) >= 12 ? "PM" : "AM"}`

    // Create appointment document
    const appointmentDoc = {
      name: data.name,
      email: data.email,
      doctor: doctorName,
      doctorId: data.doctor,
      date: data.date,
      time: time,
      status: "pending",
      symptoms: data.symptoms || "",
      createdAt: new Date(),
    }

    // Insert into MongoDB
    const result = await db.collection("doctorAppointments").insertOne(appointmentDoc)

    return NextResponse.json({
      success: true,
      message: "Doctor appointment created successfully",
      appointmentId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating doctor appointment:", error)
    return NextResponse.json({ error: "Failed to create doctor appointment" }, { status: 500 })
  }
}


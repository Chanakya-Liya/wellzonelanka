import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, convertDocToJSON } from "@/app/lib/api/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.appointmentId || !data.hostEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if appointment exists
    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(data.appointmentId),
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Create video session document
    const sessionDoc = {
      appointmentId: data.appointmentId,
      hostEmail: data.hostEmail,
      participants: data.participants || [data.hostEmail, appointment.email],
      status: "active",
      startTime: new Date(),
      createdAt: new Date(),
    }

    // Insert into MongoDB
    const result = await db.collection("videoSessions").insertOne(sessionDoc)

    // In a real app, this would integrate with a video service API
    // For demo purposes, generate a session token
    const sessionToken = Buffer.from(`${result.insertedId}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      success: true,
      sessionId: result.insertedId.toString(),
      joinUrl: `/gym-trainer/video-session?session=${result.insertedId}`,
      token: sessionToken,
    })
  } catch (error) {
    console.error("Error creating video session:", error)
    return NextResponse.json({ error: "Failed to create video session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Fetch session from MongoDB
    const session = await db.collection("videoSessions").findOne({
      _id: new ObjectId(sessionId),
    })

    if (!session) {
      return NextResponse.json({ error: "Video session not found" }, { status: 404 })
    }

    // Fetch appointment details
    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(session.appointmentId),
    })

    return NextResponse.json({
      session: {
        ...convertDocToJSON(session),
        appointment: appointment ? convertDocToJSON(appointment) : null,
      },
    })
  } catch (error) {
    console.error("Error fetching video session:", error)
    return NextResponse.json({ error: "Failed to fetch video session" }, { status: 500 })
  }
}


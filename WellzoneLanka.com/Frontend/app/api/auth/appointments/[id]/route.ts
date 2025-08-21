import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, convertDocToJSON } from "@/app/lib/api/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { db } = await connectToDatabase()

    // Fetch appointment from MongoDB
    const appointment = await db.collection("appointments").findOne({
      _id: new ObjectId(id),
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({
      appointment: convertDocToJSON(appointment),
    })
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()
    const { db } = await connectToDatabase()

    // Update fields that are allowed to be updated
    const updateData: any = {}

    if (data.status) updateData.status = data.status
    if (data.notes) updateData.notes = data.notes
    if (data.date) updateData.date = data.date
    if (data.time) updateData.time = data.time

    // Add updatedAt timestamp
    updateData.updatedAt = new Date()

    // Update in MongoDB
    const result = await db.collection("appointments").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully",
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { db } = await connectToDatabase()

    // Update appointment status to cancelled in MongoDB
    const result = await db
      .collection("appointments")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "cancelled", updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully",
    })
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 })
  }
}


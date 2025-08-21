"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/app/lib/api/mongodb"
import { ObjectId } from "mongodb"

interface AppointmentData {
  name: string
  email: string
  date: string
  timeSlot: string
  trainer: string
  notes: string
}

interface Appointment {
  id: string
  trainer: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled"
  notes?: string
}

export async function bookAppointment(data: AppointmentData) {
  try {
    const { db } = await connectToDatabase()

    // Format the trainer name from the ID
    const trainerName = data.trainer
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
      trainer: trainerName,
      trainerId: data.trainer,
      date: data.date,
      time: time,
      status: "pending",
      notes: data.notes,
      createdAt: new Date(),
    }

    // Insert into MongoDB
    const result = await db.collection("appointments").insertOne(appointmentDoc)

    revalidatePath("/gym-dash/my-appointments")
    return { success: true, appointmentId: result.insertedId.toString() }
  } catch (error) {
    console.error("Error booking appointment:", error)
    throw new Error("Failed to book appointment")
  }
}

export async function getAppointments(): Promise<Appointment[]> {
  try {
    const { db } = await connectToDatabase()

    // Fetch appointments from MongoDB
    const appointmentDocs = await db.collection("appointments").find({}).sort({ createdAt: -1 }).toArray()

    // Convert MongoDB documents to JSON and format for frontend
    const appointments = appointmentDocs.map((doc) => ({
      id: doc._id.toString(),
      trainer: doc.trainer,
      date: doc.date,
      time: doc.time,
      status: doc.status,
      notes: doc.notes,
    }))

    return appointments
  } catch (error) {
    console.error("Error fetching appointments:", error)
    throw new Error("Failed to fetch appointments")
  }
}

export async function cancelAppointment(id: string) {
  try {
    const { db } = await connectToDatabase()

    // Update appointment status in MongoDB
    const result = await db
      .collection("appointments")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "cancelled", updatedAt: new Date() } })

    if (result.modifiedCount === 0) {
      throw new Error("Appointment not found or already cancelled")
    }

    revalidatePath("/gym-dash/my-appointments")
    return { success: true }
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    throw new Error("Failed to cancel appointment")
  }
}

// Update the bookDoctorAppointment function to use a separate collection

export async function bookDoctorAppointment(data: {
  name: string
  email: string
  date: string
  timeSlot: string
  doctor: string
  symptoms: string
}) {
  try {
    const { db } = await connectToDatabase()

    // Ensure the doctorAppointments collection exists
    // await ensureCollections()

    // Format the doctor name from the ID
    const doctorName = data.doctor
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
      symptoms: data.symptoms,
      status: "pending",
      createdAt: new Date(),
    }

    console.log("Saving doctor appointment:", appointmentDoc)

    // Insert into MongoDB using doctorAppointments collection
    const result = await db.collection("doctorAppointments").insertOne(appointmentDoc)

    console.log("Doctor appointment saved with ID:", result.insertedId.toString())

    revalidatePath("/doctor/my-appointments")
    return { success: true, appointmentId: result.insertedId.toString() }
  } catch (error) {
    console.error("Error booking doctor appointment:", error)
    throw new Error("Failed to book doctor appointment")
  }
}

// Update the getDoctorAppointments function to use the new collection
export async function getDoctorAppointments(): Promise<any[]> {
  try {
    const { db } = await connectToDatabase()

    // Ensure the doctorAppointments collection exists
    // await ensureCollections();

    console.log("Fetching doctor appointments from database")

    // Fetch doctor appointments from the doctorAppointments collection
    const appointmentDocs = await db.collection("doctorAppointments").find({}).sort({ createdAt: -1 }).toArray()

    console.log(`Found ${appointmentDocs.length} doctor appointments`)

    // Convert MongoDB documents to JSON and format for frontend
    const appointments = appointmentDocs.map((doc) => ({
      id: doc._id.toString(),
      doctor: doc.doctor,
      date: doc.date,
      time: doc.time,
      status: doc.status,
      symptoms: doc.symptoms,
    }))

    return appointments
  } catch (error) {
    console.error("Error fetching doctor appointments:", error)
    throw new Error("Failed to fetch doctor appointments")
  }
}

// Update the cancelDoctorAppointment function to use the new collection
export async function cancelDoctorAppointment(id: string) {
  try {
    const { db } = await connectToDatabase()

    // Update appointment status in the doctorAppointments collection
    const result = await db
      .collection("doctorAppointments")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "cancelled", updatedAt: new Date() } })

    if (result.modifiedCount === 0) {
      throw new Error("Appointment not found or already cancelled")
    }

    revalidatePath("/doctor/my-appointments")
    return { success: true }
  } catch (error) {
    console.error("Error cancelling doctor appointment:", error)
    throw new Error("Failed to cancel doctor appointment")
  }
}
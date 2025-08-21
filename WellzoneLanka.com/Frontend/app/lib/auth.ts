"use server"

import { cookies } from "next/headers"
import { connectToDatabase } from "@/app/lib/api/mongodb"
import { redirect } from "next/navigation"

interface LoginData {
  email: string
  password: string
}

interface User {
  id: string
  name: string
  email: string
  role: "doctor" | "patient" | "trainer"
}

export async function login(data: LoginData) {
  try {
    const { db } = await connectToDatabase()

    // Find user by email
    const user = await db.collection("users").findOne({
      email: data.email,
    })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // In a real app, you would compare hashed passwords
    // For demo purposes, we're doing a simple comparison
    if (user.password !== data.password) {
      return { success: false, message: "Invalid password" }
    }

    // Create session
    const session = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }

    // Store session in cookie
    ;(await
      // Store session in cookie
      cookies()).set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function logout() {
  (await cookies()).delete("session")
  redirect("/")
}

export async function getSession(): Promise<User | null> {
  const sessionCookie = (await cookies()).get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      (await cookies()).delete("session")
      return null
    }

    return {
      id: session.userId,
      name: session.name,
      email: session.email,
      role: session.role,
    }
  } catch (error) {
    return null
  }
}

export async function register(data: any) {
  try {
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: data.email,
    })

    if (existingUser) {
      return { success: false, message: "User with this email already exists" }
    }

    // Create user document
    const userDoc = {
      name: data.name,
      email: data.email,
      password: data.password, // In a real app, hash this password
      role: data.role,
      createdAt: new Date(),
    }

    // Insert into MongoDB
    const result = await db.collection("users").insertOne(userDoc)

    return {
      success: true,
      userId: result.insertedId.toString(),
      message: "User registered successfully",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "An error occurred during registration" }
  }
}


import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase";
import { dbService } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists in our database
    const userExists = await dbService.emailExists(email);
    if (!userExists) {
      return NextResponse.json(
        { message: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Send password reset email via Firebase
    await sendPasswordResetEmail(firebaseAuth, email);

    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);

    if (error.code === "auth/user-not-found") {
      return NextResponse.json(
        { message: "No account found with this email address" },
        { status: 404 }
      );
    }

    if (error.code === "auth/invalid-email") {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to send password reset email" },
      { status: 500 }
    );
  }
}
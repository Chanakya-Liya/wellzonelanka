import { NextRequest, NextResponse } from "next/server";
import { auth as firebaseAuth } from "@/lib/firebase";
import { dbService } from "@/lib/database";
import { User } from "firebase/auth";
import { updatePassword as firebaseUpdatePassword } from "firebase/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    // Verify token
    const verification = await dbService.verifyPasswordResetToken(token);
    if (!verification.valid) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update the password in Firebase Auth
    await updatePassword(firebaseAuth.currentUser, password);

    // Mark token as used
    await dbService.markTokenAsUsed(token);

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Password reset failed" },
      { status: 500 }
    );
  }
}

async function updatePassword(currentUser: User | null, password: string) {
  if (!currentUser) {
    throw new Error("No authenticated user found.");
  }
  await firebaseUpdatePassword(currentUser, password);
}

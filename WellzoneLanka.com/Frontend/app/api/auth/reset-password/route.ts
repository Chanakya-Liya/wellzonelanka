import { NextResponse } from "next/server";
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";
import bcrypt from "bcryptjs";

export const POST = async (request: any) => {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      console.log("Token or password missing");
      return new NextResponse(
        JSON.stringify({ message: "Token and new password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Received token:", token);
    console.log("Received password:", password);

    await connectToDatabase();

    // Find the user with the provided token and ensure the token is not expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure the token has not expired
    });

    console.log("User found:", user);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(password, 10);

    // Clear the reset token and expiry after successful password reset
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    console.log("Password reset successful for user:", user.email);

    return new NextResponse(
      JSON.stringify({ message: "Password reset successful" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error resetting password:", error);

    return new NextResponse(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
import { NextResponse } from "next/server";
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

export const POST = async (request: any) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Email not found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Generate reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    console.log("Reset URL:", resetUrl);

    // Configure SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

    const msg = {
      to: email,
      from: "chathuni.20230146@iit.ac.lk", // Replace with your verified sender email
      subject: "Wellzone Lanka - Reset Password",
      text: `You requested to reset your password. Click the link below to reset it:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" style="color: #1a73e8; text-decoration: none;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    try {
      await sgMail.send(msg);
      return NextResponse.json(
        { message: "Reset password email has been sent." },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "Failed to send email. Try again." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
};
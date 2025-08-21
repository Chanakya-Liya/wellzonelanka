import { NextResponse } from "next/server";
import User from "../../../../models/user";
import connectToDatabase from "../../../../lib/db";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { message: "Token is required" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Token is valid" }, { status: 200 });
};
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '../../../../models/user';
import connectToDatabase from '../../../../lib/db';

export async function POST(request: Request) {
  const { firstName, lastName, email, password, confirmPassword } = await request.json();

  console.log("Received data:", { firstName, lastName, email, password, confirmPassword });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
  }

  if (confirmPassword !== password) {
    return NextResponse.json({ message: "Passwords do not match. Please check and try again. 🔒" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use. Please log in or use a different email. 📧" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User created:", newUser);

    return NextResponse.json({ message: "Welcome to WellZone Lanka! Your account has been created successfully. 🎉" }, { status: 201 });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json({ message: "Oops! Something went wrong. Please try again. 🛠️" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'trainer' | 'doctor';
  licenseNumber?: string;
  experience?: number;
  specialization?: string;
}

interface SignupResponse {
  message: string;
  userId?: string;
  requiresApproval?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role, 
      licenseNumber, 
      experience, 
      specialization,
      certificationFiles
    } = body;

    console.log('Firebase registration attempt:', { email, role, firstName, lastName });

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists in Firebase
    const userExists = await firebaseDataService.emailExists(email);
    if (userExists) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Prepare user data
    let userData: any = {
      firstName,
      lastName,
      email,
      password,
      role,
    };

    // Validate professional fields
    if (role === 'trainer' || role === 'doctor') {
      if (!licenseNumber || !experience || !specialization) {
        return NextResponse.json(
          { message: 'Professional fields are required for trainers and doctors' },
          { status: 400 }
        );
      }
      
      const experienceNum = parseInt(experience);
      if (isNaN(experienceNum) || experienceNum < 0) {
        return NextResponse.json(
          { message: 'Valid years of experience is required' },
          { status: 400 }
        );
      }
      
      userData = {
        ...userData,
        licenseNumber,
        experience: experienceNum,
        specialization,
        certificationFiles: certificationFiles || [],
      };
    }

    // Create user in Firebase Firestore
    const user = await firebaseDataService.createUser(userData);

    const response: SignupResponse = {
      message: 'User registered successfully and saved to Firebase',
      userId: user.id,
      requiresApproval: role !== 'user'
    };

    console.log('Firebase registration successful:', { userId: user.id, email: user.email });

    return NextResponse.json(response, { status: 201 });

  } catch (error: any) {
    console.error('Firebase registration error:', error);
    
    if (error.message.includes('User with this email already exists')) {
      return NextResponse.json(
        { message: 'Email is already in use' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Registration failed: ' + error.message },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase-dev'; // Using dev config
import { dbService } from '@/lib/database-mock'; // Using mock service temporarily

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
      specialization 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await dbService.emailExists(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const firebaseUser = userCredential.user;

    // Prepare user data based on role
    let userData: UserData = {
      firstName,
      lastName,
      email,
      role,
    };

    // Add professional-specific fields
    if (role === 'trainer' || role === 'doctor') {
      if (!licenseNumber || !experience || !specialization) {
        return NextResponse.json(
          { message: 'Professional fields are required for trainers and doctors' },
          { status: 400 }
        );
      }
      
      userData = {
        ...userData,
        licenseNumber,
        experience: parseInt(experience),
        specialization,
      };
    }

    // Create user profile in Firestore
    await dbService.createUserProfile(firebaseUser.uid, userData);

    const response: SignupResponse = {
      message: 'User registered successfully',
      userId: firebaseUser.uid,
      requiresApproval: role !== 'user'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error?.code) {
      if (error.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { message: 'Email is already in use' },
          { status: 400 }
        );
      }
      
      if (error.code === 'auth/weak-password') {
        return NextResponse.json(
          { message: 'Password should be at least 6 characters' },
          { status: 400 }
        );
      }
      
      if (error.code === 'auth/invalid-email') {
        return NextResponse.json(
          { message: 'Invalid email address' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}
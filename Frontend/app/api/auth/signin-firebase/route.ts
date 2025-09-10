import { NextRequest, NextResponse } from 'next/server';
import { firebaseDataService } from '@/lib/firebase-database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Firebase login attempt:', { email });

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
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

    // Authenticate user against Firebase Firestore
    const user = await firebaseDataService.authenticateUser(email, password);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if professional account is approved
    if (user.role !== 'user' && !user.isApproved) {
      return NextResponse.json(
        { message: 'Your account is pending approval. Please wait for admin verification.' },
        { status: 403 }
      );
    }

    console.log('Firebase login successful:', { userId: user.id, email: user.email, role: user.role });

    // Return user data (without password hash)
    const { passwordHash, ...safeUserData } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      user: safeUserData
    }, { status: 200 });

  } catch (error: any) {
    console.error('Firebase login error:', error);
    
    return NextResponse.json(
      { message: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}
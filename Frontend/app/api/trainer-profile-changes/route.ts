import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

// Submit new profile changes for approval
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trainerId, changes } = body;

    if (!trainerId || !changes) {
      return NextResponse.json(
        { success: false, error: 'Trainer ID and changes are required' },
        { status: 400 }
      );
    }

    // Get current trainer data from users collection
    const trainerDoc = await getDoc(doc(db, 'users', trainerId));
    if (!trainerDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Trainer not found' },
        { status: 404 }
      );
    }

    const currentData = trainerDoc.data();

    // Create pending change document
    const pendingChange = {
      changeType: 'trainerProfile',
      trainerId: trainerId,
      originalData: {
        address: currentData.address || '',
        bio: currentData.bio || '',
        certifications: currentData.certifications || '',
        createdAt: currentData.createdAt || '',
        education: currentData.education || '',
        email: currentData.email || '',
        experience: currentData.experience || 0,
        firstName: currentData.firstName || '',
        fullName: currentData.fullName || '',
        id: currentData.id || trainerId,
        isApproved: currentData.isApproved || false,
        lastName: currentData.lastName || '',
        licenseNumber: currentData.licenseNumber || '',
        phone: currentData.phone || '',
        profileImage: currentData.profileImage || '',
        role: currentData.role || 'trainer',
        specialization: currentData.specialization || ''
      },
      proposedChanges: changes,
      status: 'pending',
      submittedAt: serverTimestamp(),
      submittedBy: trainerId,
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: ''
    };

    // Add to pending-changes collection
    const docRef = await addDoc(collection(db, 'pending-changes'), pendingChange);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...pendingChange
      }
    });

  } catch (error) {
    console.error('Error submitting profile changes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit profile changes' },
      { status: 500 }
    );
  }
}
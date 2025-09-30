import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trainerId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { trainerId } = resolvedParams;

    if (!trainerId) {
      return NextResponse.json({
        success: false,
        error: 'Trainer ID is required'
      }, { status: 400 });
    }

    console.log('🔍 Fetching trainer profile for ID:', trainerId);

    // Get trainer document from users collection
    const trainerRef = doc(db, 'users', trainerId);
    const trainerDoc = await getDoc(trainerRef);

    if (!trainerDoc.exists()) {
      return NextResponse.json({
        success: false,
        error: 'Trainer not found'
      }, { status: 404 });
    }

    const trainerData = trainerDoc.data();

    // Return trainer profile data
    const trainerProfile = {
      id: trainerDoc.id,
      fullName: trainerData.fullName || `${trainerData.firstName || ''} ${trainerData.lastName || ''}`.trim(),
      firstName: trainerData.firstName || '',
      lastName: trainerData.lastName || '',
      email: trainerData.email || '',
      phone: trainerData.phone || '',
      licenseNumber: trainerData.licenseNumber || '',
      specialization: trainerData.specialization || '',
      experience: trainerData.experience || '',
      bio: trainerData.bio || '',
      address: trainerData.address || '',
      education: trainerData.education || '',
      certifications: trainerData.certifications || '',
      profileImage: trainerData.profileImage || '',
      isApproved: trainerData.isApproved || false,
      role: trainerData.role || 'trainer',
      createdAt: trainerData.createdAt || null,
      updatedAt: trainerData.updatedAt || null,
      lastProfileUpdate: trainerData.lastProfileUpdate || null,
      profileVersion: trainerData.profileVersion || 1
    };

    console.log('👨‍💪 Trainer profile found:', trainerProfile);

    return NextResponse.json({
      success: true,
      data: trainerProfile
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching trainer profile:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch trainer profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
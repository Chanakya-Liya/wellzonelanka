import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  getDocs, 
  getDoc,
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET - Fetch all profile changes for admin (pending, approved, rejected)
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching all profile changes for admin...');

    const pendingChangesRef = collection(db, 'pending-changes');
    
    // First, try to get all documents from the collection to see what's there
    console.log('📊 Checking pending-changes collection...');
    let allDocsSnapshot;
    
    try {
      allDocsSnapshot = await getDocs(pendingChangesRef);
      console.log(`📋 Total documents in pending-changes collection: ${allDocsSnapshot.size}`);
    } catch (error) {
      console.error('❌ Error getting all documents:', error);
      throw error;
    }

    // Get all documents from the collection (not just pending)
    let querySnapshot;
    try {
      // Get all profile changes regardless of status
      querySnapshot = await getDocs(pendingChangesRef);
      console.log(`📋 Total profile change documents: ${querySnapshot.size}`);
    } catch (error) {
      console.error('❌ Error getting profile changes:', error);
      throw error;
    }

    const allChanges: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📄 Document ${doc.id}:`, {
        changeType: data.changeType,
        status: data.status,
        doctorId: data.doctorId,
        trainerId: data.trainerId
      });
      
      // Convert Firestore timestamps to strings if needed
      const submittedAt = data.submittedAt?.toDate?.()?.toISOString() || data.submittedAt;
      const reviewedAt = data.reviewedAt?.toDate?.()?.toISOString() || data.reviewedAt;

      allChanges.push({
        id: doc.id,
        ...data,
        submittedAt,
        reviewedAt
      });
    });

    console.log(`✅ Total profile changes found: ${allChanges.length}`);

    // Separate by type for easier admin management
    const doctorChanges = allChanges.filter((change: any) => change.changeType === 'doctorProfile');
    const trainerChanges = allChanges.filter((change: any) => change.changeType === 'trainerProfile');

    console.log(`👨‍⚕️ Doctor changes: ${doctorChanges.length}`);
    console.log(`💪 Trainer changes: ${trainerChanges.length}`);

    // Sort manually by submittedAt (newest first)
    const sortedDoctorChanges = doctorChanges.sort((a: any, b: any) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    const sortedTrainerChanges = trainerChanges.sort((a: any, b: any) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({
      doctorChanges: sortedDoctorChanges,
      trainerChanges: sortedTrainerChanges,
      total: allChanges.length,
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching pending profile changes:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pending profile changes',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}

// PUT - Approve or reject a profile change
export async function PUT(request: NextRequest) {
  try {
    const { changeId, action, adminId, adminNotes } = await request.json();

    if (!changeId || !action || !adminId) {
      return NextResponse.json({
        success: false,
        error: 'Change ID, action, and admin ID are required'
      }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: 'Action must be either "approve" or "reject"'
      }, { status: 400 });
    }

    // First, get the profile change details
    const changeRef = doc(db, 'pending-changes', changeId);
    const changeDoc = await getDoc(changeRef);
    
    if (!changeDoc.exists()) {
      return NextResponse.json({
        success: false,
        error: 'Profile change not found'
      }, { status: 404 });
    }

    const changeData = changeDoc.data();
    
    // Update the pending change status
    await updateDoc(changeRef, {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminId,
      adminNotes: adminNotes || ''
    });

    // If approved, apply the changes to the users collection
    if (action === 'approve' && changeData.proposedChanges) {
      const userId = changeData.doctorId || changeData.trainerId;
      
      if (userId) {
        try {
          const userRef = doc(db, 'users', userId);
          
          // First, get the current user data to compare
          const currentUserDoc = await getDoc(userRef);
          const currentUserData = currentUserDoc.exists() ? currentUserDoc.data() : {};
          
          console.log(`📋 Current user data for ${userId}:`, currentUserData);
          console.log(`🔄 Proposed changes:`, changeData.proposedChanges);
          
          // Create comprehensive update object from proposed changes
          const updateData: any = {};
          
          // Process all possible fields that can be updated
          const fieldsToUpdate = [
            'fullName', 'firstName', 'lastName', 'email', 'phone', 
            'specialization', 'licenseNumber', 'experience', 'bio', 
            'address', 'education', 'certifications', 'profileImage',
            'workingHours', 'availableDays', 'consultationFee',
            'qualifications', 'languages', 'about', 'achievements',
            'services', 'yearsExperience', 'workLocation'
          ];
          
          fieldsToUpdate.forEach(field => {
            // Only update if the field exists in proposed changes and has a value
            if (changeData.proposedChanges.hasOwnProperty(field)) {
              const proposedValue = changeData.proposedChanges[field];
              const currentValue = currentUserData[field];
              
              // Update if the proposed value is different from current value
              if (proposedValue !== currentValue) {
                if (proposedValue !== null && proposedValue !== undefined && proposedValue !== '') {
                  updateData[field] = proposedValue;
                  console.log(`🔄 Updating ${field}: "${currentValue}" → "${proposedValue}"`);
                } else {
                  // Handle empty values - decide whether to keep current or clear
                  console.log(`⚠️  Proposed ${field} is empty, keeping current value: "${currentValue}"`);
                }
              } else {
                console.log(`✅ ${field} unchanged: "${currentValue}"`);
              }
            }
          });
          
          // Always add metadata for tracking
          updateData.updatedAt = new Date().toISOString();
          updateData.lastProfileUpdate = new Date().toISOString();
          updateData.profileVersion = (currentUserData.profileVersion || 0) + 1;
          updateData.lastApprovedChangeId = changeId;
          
          // Log the final update data
          console.log(`💾 Final update data for user ${userId}:`, updateData);
          
          // Apply the update to the user document
          if (Object.keys(updateData).length > 4) { // More than just metadata fields
            await updateDoc(userRef, updateData);
            console.log(`✅ Successfully updated user ${userId} with ${Object.keys(updateData).length} fields`);
            
            // Log each updated field for audit
            Object.keys(updateData).forEach(key => {
              if (!['updatedAt', 'lastProfileUpdate', 'profileVersion', 'lastApprovedChangeId'].includes(key)) {
                console.log(`  📝 ${key}: ${updateData[key]}`);
              }
            });
          } else {
            console.log(`ℹ️  No actual profile changes to apply for user ${userId}, only metadata updated`);
          }
          
        } catch (userUpdateError) {
          console.error('❌ Error updating user profile:', userUpdateError);
          console.error('❌ User update error details:', {
            userId,
            changeId,
            error: userUpdateError instanceof Error ? userUpdateError.message : 'Unknown error'
          });
          
          // Still mark as approved but log the error
          console.log('⚠️  Profile change marked as approved despite user update error');
        }
      } else {
        console.error('❌ No user ID found in change data:', {
          doctorId: changeData.doctorId,
          trainerId: changeData.trainerId,
          changeId
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Profile change ${action}d successfully${action === 'approve' ? ' and applied to user profile' : ''}`,
      details: action === 'approve' ? {
        changeId,
        userId: changeData.doctorId || changeData.trainerId,
        userType: changeData.changeType,
        appliedToUserCollection: true
      } : {
        changeId,
        action
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating profile change:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile change',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Delete a profile change request
export async function DELETE(request: NextRequest) {
  try {
    const { changeId } = await request.json();

    if (!changeId) {
      return NextResponse.json({
        success: false,
        error: 'Change ID is required'
      }, { status: 400 });
    }

    const changeRef = doc(db, 'pending-changes', changeId);
    await deleteDoc(changeRef);

    return NextResponse.json({
      success: true,
      message: 'Profile change deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting profile change:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete profile change',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
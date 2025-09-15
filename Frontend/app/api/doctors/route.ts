import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Get all doctors
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching doctors from database...');

    let doctors: any[] = [];
    let retries = 3;

    while (retries > 0) {
      try {
        // Get all doctors from users collection where role = 'doctor'
        const doctorsRef = collection(db, 'users');
        let q;
        
        try {
          // Try with ordering first
          q = query(doctorsRef, where('role', '==', 'doctor'), orderBy('firstName', 'asc'));
        } catch {
          // If ordering fails, use simple query
          q = query(doctorsRef, where('role', '==', 'doctor'));
        }

        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const doctorData = {
            id: doc.id,
            ...doc.data()
          };
          doctors.push(doctorData);
          console.log('Found doctor:', { 
            docId: doc.id, 
            name: `${(doctorData as any).firstName} ${(doctorData as any).lastName}`,
            email: (doctorData as any).email,
            specialization: (doctorData as any).specialization,
            experience: (doctorData as any).experience,
            isApproved: (doctorData as any).isApproved,
            licenseNumber: (doctorData as any).licenseNumber
          });
        });

        break; // Success, exit retry loop

      } catch (error: any) {
        retries--;
        if ((error.code === 'unavailable' || error.message.includes('UNAVAILABLE')) && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // Handle index errors
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
          console.log('Index not available, using simple query...');
          const simpleSnapshot = await getDocs(collection(db, 'users'));
          simpleSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.role === 'doctor') {
              doctors.push({
                id: doc.id,
                ...userData
              });
            }
          });
          break;
        }
        
        throw error;
      }
    }

    // Sort doctors by name if we have them
    if (doctors.length > 0) {
      doctors.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}` || 'Unknown';
        const nameB = `${b.firstName} ${b.lastName}` || 'Unknown';
        return nameA.localeCompare(nameB);
      });
    }

    console.log(`Found ${doctors.length} total doctors`);

    return NextResponse.json({
      success: true,
      doctors: doctors,
      count: doctors.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching doctors:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error instanceof Error ? error.message : 'Unknown error',
      doctors: []
    }, { status: 500 });
  }
}
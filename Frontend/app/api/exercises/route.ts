import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Get all exercises
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching exercises from database...');

    let exercises: any[] = [];
    let retries = 3;

    while (retries > 0) {
      try {
        // Get all exercises from exercises collection
        const exercisesRef = collection(db, 'exercises');
        let q;
        
        try {
          // Try with ordering first
          q = query(exercisesRef, orderBy('exerciseName', 'asc'));
        } catch {
          // If ordering fails, use simple query
          q = query(exercisesRef);
        }

        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const exerciseData = {
            id: doc.id,
            ...doc.data()
          };
          exercises.push(exerciseData);
          console.log('Found exercise:', { 
            docId: doc.id, 
            name: (exerciseData as any).exerciseName,
            difficulty: (exerciseData as any).difficulty,
            duration: (exerciseData as any).duration
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
          const simpleSnapshot = await getDocs(collection(db, 'exercises'));
          simpleSnapshot.forEach((doc) => {
            exercises.push({
              id: doc.id,
              ...doc.data()
            });
          });
          break;
        }
        
        throw error;
      }
    }

    // Sort exercises by name if we have them
    if (exercises.length > 0) {
      exercises.sort((a, b) => {
        const nameA = a.exerciseName || 'Unknown';
        const nameB = b.exerciseName || 'Unknown';
        return nameA.localeCompare(nameB);
      });
    }

    console.log(`Found ${exercises.length} total exercises`);

    return NextResponse.json({
      success: true,
      exercises: exercises,
      count: exercises.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching exercises:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch exercises',
      error: error instanceof Error ? error.message : 'Unknown error',
      exercises: []
    }, { status: 500 });
  }
}
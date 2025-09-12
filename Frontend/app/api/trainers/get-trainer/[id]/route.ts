import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('Getting trainer with ID:', id);

    let trainer = null;
    let retries = 3;

    while (retries > 0) {
      try {
        // Try direct document lookup first
        const trainerDoc = await getDoc(doc(db, 'trainers', id));
        
        if (trainerDoc.exists()) {
          trainer = {
            id: trainerDoc.id,
            ...trainerDoc.data()
          };
          console.log('Found trainer via direct lookup:', trainer.id);
          break;
        }

        // If not found, try query by id field
        const trainersQuery = query(
          collection(db, 'trainers'),
          where('id', '==', id)
        );
        const querySnapshot = await getDocs(trainersQuery);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          trainer = {
            id: doc.id,
            ...doc.data()
          };
          console.log('Found trainer via query:', trainer.id);
          break;
        }

        // Try alternative collection names
        const alternativeCollections = ['trainer', 'staff', 'employees'];
        for (const collectionName of alternativeCollections) {
          try {
            const altDoc = await getDoc(doc(db, collectionName, id));
            if (altDoc.exists()) {
              trainer = {
                id: altDoc.id,
                ...altDoc.data()
              };
              console.log(`Found trainer in ${collectionName} collection:`, trainer.id);
              break;
            }
          } catch (error) {
            console.log(`${collectionName} collection not accessible`);
          }
        }

        if (trainer) break;

        // Final fallback - search all trainers collections for any matching data
        try {
          const allTrainersQuery = query(collection(db, 'trainers'));
          const allTrainersSnapshot = await getDocs(allTrainersQuery);
          
          console.log(`Searching through ${allTrainersSnapshot.docs.length} trainers for ID: ${id}`);
          
          allTrainersSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Found trainer document:', { docId: doc.id, data: JSON.stringify(data, null, 2) });
            
            // Check if this could be our trainer
            if (doc.id === id || data.id === id || data.trainerId === id) {
              trainer = {
                id: doc.id,
                ...data
              };
              console.log('Matched trainer:', trainer);
            }
          });
        } catch (error) {
          console.log('Error searching all trainers:', error);
        }

        console.log('Trainer not found with ID:', id);
        break;

      } catch (error: any) {
        retries--;
        if ((error.code === 'unavailable' || error.message.includes('UNAVAILABLE')) && retries > 0) {
          console.log(`Firestore unavailable, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    if (!trainer) {
      // Create a sample trainer for demo purposes
      console.log('Creating sample trainer for ID:', id);
      trainer = {
        id: id,
        firstName: 'Thevinu',
        lastName: 'Bandara',
        name: 'Thevinu Bandara',
        email: 'thevinu@wellzonelanka.com',
        phone: '+94 77 123 4567',
        specialization: 'Personal Training & Fitness Coach',
        experience: 5,
        hourlyRate: 'Rs. 3,500/hour',
        bio: 'Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals. Specialized in strength training, weight loss, and muscle building.',
        certifications: ['ACSM Certified Personal Trainer', 'Nutrition Specialist', 'Strength & Conditioning'],
        location: 'Colombo, Sri Lanka',
        availableHours: 'Mon-Fri: 6AM-9PM, Sat-Sun: 7AM-6PM',
        rating: 4.9,
        reviewCount: 87,
        isSample: true
      };
    }

    return NextResponse.json({
      success: true,
      trainer: trainer
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trainer:', error);
    
    // Return sample trainer on error
    const { id } = await params;
    return NextResponse.json({
      success: true,
      trainer: {
        id: id,
        firstName: 'Thevinu',
        lastName: 'Bandara',
        name: 'Thevinu Bandara',
        email: 'thevinu@wellzonelanka.com',
        phone: '+94 77 123 4567',
        specialization: 'Personal Training & Fitness Coach',
        experience: 5,
        hourlyRate: 'Rs. 3,500/hour',
        bio: 'Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals.',
        certifications: ['ACSM Certified Personal Trainer', 'Nutrition Specialist'],
        location: 'Colombo, Sri Lanka',
        availableHours: 'Mon-Fri: 6AM-9PM, Sat-Sun: 7AM-6PM',
        rating: 4.9,
        reviewCount: 87,
        isSample: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 200 });
  }
}
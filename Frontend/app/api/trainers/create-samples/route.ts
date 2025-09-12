import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Create sample trainers for demo
export async function POST(request: NextRequest) {
  try {
    console.log('Creating sample trainers...');

    const sampleTrainers = [
      {
        id: 'GjFsFmYsHU5pMgePYC7E',
        firstName: 'Thevinu',
        lastName: 'Bandara',
        name: 'Thevinu Bandara',
        email: 'thevinu@wellzonelanka.com',
        phone: '+94 77 123 4567',
        specialization: 'Personal Training & Fitness Coach',
        experience: 5,
        hourlyRate: 'Rs. 3,500/hour',
        bio: 'Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals. Specialized in strength training, weight loss, and muscle building programs.',
        certifications: ['ACSM Certified Personal Trainer', 'Nutrition Specialist', 'Strength & Conditioning Coach'],
        location: 'Colombo, Sri Lanka',
        availableHours: 'Mon-Fri: 6AM-9PM, Sat-Sun: 7AM-6PM',
        rating: 4.9,
        reviewCount: 87,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'trainer_2',
        firstName: 'Kasun',
        lastName: 'Silva',
        name: 'Kasun Silva',
        email: 'kasun@wellzonelanka.com',
        phone: '+94 77 987 6543',
        specialization: 'Yoga & Meditation Instructor',
        experience: 3,
        hourlyRate: 'Rs. 2,500/hour',
        bio: 'Experienced yoga instructor focusing on mindfulness, flexibility, and mental wellness. Certified in Hatha and Vinyasa yoga.',
        certifications: ['200hr Yoga Teacher Training', 'Meditation Instructor', 'Mindfulness Coach'],
        location: 'Kandy, Sri Lanka',
        availableHours: 'Mon-Sat: 7AM-8PM',
        rating: 4.7,
        reviewCount: 64,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'trainer_3',
        firstName: 'Priya',
        lastName: 'Fernando',
        name: 'Priya Fernando',
        email: 'priya@wellzonelanka.com',
        phone: '+94 77 456 7890',
        specialization: 'Nutrition & Weight Loss Coach',
        experience: 4,
        hourlyRate: 'Rs. 3,000/hour',
        bio: 'Registered dietitian and nutrition coach specializing in sustainable weight loss and healthy lifestyle changes.',
        certifications: ['Registered Dietitian', 'Sports Nutrition Specialist', 'Wellness Coach'],
        location: 'Galle, Sri Lanka',
        availableHours: 'Tue-Sat: 8AM-7PM',
        rating: 4.8,
        reviewCount: 92,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    const results = [];

    for (const trainer of sampleTrainers) {
      try {
        // Create trainer with specific ID
        await setDoc(doc(db, 'trainers', trainer.id), trainer);
        results.push({ id: trainer.id, name: trainer.name, status: 'created' });
        console.log(`Created trainer: ${trainer.name} with ID: ${trainer.id}`);
      } catch (error) {
        console.error(`Error creating trainer ${trainer.name}:`, error);
        results.push({ id: trainer.id, name: trainer.name, status: 'error', error: error });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sample trainers created successfully',
      results: results
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating sample trainers:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create sample trainers',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
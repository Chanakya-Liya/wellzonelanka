"use client";

import { useState, useEffect } from 'react';
import { getDoctorReviewStats } from '@/lib/services/reviewService';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}

export default function ReviewTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testReviewStats = async () => {
      try {
        // First, get all doctors
        const response = await fetch('/api/doctors');
        const data = await response.json();
        
        if (data.success && data.doctors) {
          const results = [];
          
          for (const doctor of data.doctors.slice(0, 3)) { // Test first 3 doctors
            try {
              console.log(`Testing reviews for doctor: ${doctor.id}`);
              const reviewStats = await getDoctorReviewStats(doctor.id);
              console.log(`Review stats for ${doctor.id}:`, reviewStats);
              
              results.push({
                doctorId: doctor.id,
                doctorName: `${doctor.firstName} ${doctor.lastName}`,
                reviewStats: reviewStats,
                success: true
              });
            } catch (error) {
              console.error(`Error for doctor ${doctor.id}:`, error);
              results.push({
                doctorId: doctor.id,
                doctorName: `${doctor.firstName} ${doctor.lastName}`,
                error: error instanceof Error ? error.message : 'Unknown error',
                success: false
              });
            }
          }
          
          setTestResults(results);
        }
      } catch (error) {
        console.error('Error testing reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    testReviewStats();
  }, []);

  if (loading) {
    return <div className="p-8">Loading review test...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Review Stats Test</h1>
      
      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="font-semibold">
              {result.doctorName} (ID: {result.doctorId})
            </h3>
            
            {result.success ? (
              <div className="mt-2">
                <p>✅ Success</p>
                <p>Total Reviews: {result.reviewStats.totalReviews}</p>
                <p>Average Rating: {result.reviewStats.averageRating}</p>
              </div>
            ) : (
              <div className="mt-2 text-red-600">
                <p>❌ Error: {result.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
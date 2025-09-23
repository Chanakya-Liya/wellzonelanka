'use client';

import { useState, useEffect } from 'react';
import { getDoctorReviews } from '@/lib/services/reviewService';

export default function ReviewDebugPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState('eNRqpc8os8MBgoBe9vKi');

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching reviews for:', doctorId);
      const result = await getDoctorReviews(doctorId);
      console.log('Reviews result:', result);
      setReviews(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Review Debug Page</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Doctor ID:</label>
        <input
          type="text"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
        />
        <button
          onClick={fetchReviews}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fetch Reviews
        </button>
      </div>

      {loading && (
        <div className="p-4 bg-blue-50 rounded">
          Loading reviews...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <h3 className="font-medium text-red-800">Error:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Reviews Found: {reviews.length}</h3>
        
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews found</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id || index} className="bg-white p-4 rounded border">
                <h4 className="font-medium">Review {index + 1}</h4>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div><strong>ID:</strong> {review.id}</div>
                  <div><strong>Doctor ID:</strong> {review.doctorId}</div>
                  <div><strong>Patient:</strong> {review.patientName}</div>
                  <div><strong>Rating:</strong> {review.rating}/5</div>
                  <div><strong>Date:</strong> {review.date}</div>
                  <div><strong>Created:</strong> {review.createdAt}</div>
                </div>
                <div className="mt-2">
                  <strong>Comment:</strong> "{review.comment}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded">
        <h3 className="font-medium text-yellow-800">Debug Info:</h3>
        <pre className="text-xs mt-2 text-yellow-700">
          {JSON.stringify(reviews, null, 2)}
        </pre>
      </div>
    </div>
  );
}
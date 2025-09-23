"use client";

import { useState } from 'react';
import { addReview } from '@/lib/services/reviewService';

export default function AddTestReviewPage() {
  const [doctorId, setDoctorId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const reviewData = {
        doctorId,
        patientName,
        rating,
        comment,
        date: new Date().toISOString()
      };

      console.log('Submitting review:', reviewData);
      const reviewId = await addReview(reviewData);
      setResult(`✅ Review added successfully! Review ID: ${reviewId}`);
      
      // Reset form
      setDoctorId('');
      setPatientName('');
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error adding review:', error);
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Test Review</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Doctor ID</label>
          <input
            type="text"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter doctor ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Patient Name</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter patient name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-24"
            placeholder="Enter review comment"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding Review...' : 'Add Review'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      )}

      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> To find doctor IDs, visit the API endpoint:
          <br />
          <a href="/api/doctors" target="_blank" className="text-blue-600 underline">
            /api/doctors
          </a>
        </p>
      </div>
    </div>
  );
}
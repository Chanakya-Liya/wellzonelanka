"use client";

import { useState } from 'react';

export default function FirebaseTestPage() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test/firebase');
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test/reviews');
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Firebase Test</h1>
      
      <div className="space-x-4 mb-6">
        <button 
          onClick={testFirebaseConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Firebase Connection
        </button>
        
        <button 
          onClick={testReviews}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Reviews
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {testResult || 'Click a button to test'}
      </pre>
    </div>
  );
}
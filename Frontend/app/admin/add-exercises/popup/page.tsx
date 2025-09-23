"use client";

import { useState } from 'react';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exercise: any) => void;
}

export default function AddExerciseModal({ isOpen, onClose, onSubmit }: AddExerciseModalProps) {
  const [exerciseData, setExerciseData] = useState({
    name: '',
    bodyPart: '',
    muscles: '',
    description: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Exercise Details */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Exercise name..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={exerciseData.name}
              onChange={(e) => setExerciseData(prev => ({ ...prev, name: e.target.value }))}
            />

            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={exerciseData.bodyPart}
              onChange={(e) => setExerciseData(prev => ({ ...prev, bodyPart: e.target.value }))}
            >
              <option value="">Select body part</option>
              <option value="Upper Body">Upper Body</option>
              <option value="Lower Body">Lower Body</option>
              <option value="Core">Core</option>
              <option value="Full Body">Full Body</option>
            </select>

            <input
              type="text"
              placeholder="Muscles..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={exerciseData.muscles}
              onChange={(e) => setExerciseData(prev => ({ ...prev, muscles: e.target.value }))}
            />

            <textarea
              placeholder="Description..."
              className="w-full p-3 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={exerciseData.description}
              onChange={(e) => setExerciseData(prev => ({ ...prev, description: e.target.value }))}
            />

            <button 
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => {
                onSubmit(exerciseData);
                onClose();
              }}
            >
              Add New Exercises
            </button>
          </div>

          {/* Right Column - Tutorial Upload */}
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 h-full flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold mb-2">Upload Tutorials</h3>
              <p className="text-sm text-gray-500 mb-6">
                Added Tutorials will be displayed in website as a Exercise card.
              </p>
              <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2">
                <span>+</span> Upload tutorial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
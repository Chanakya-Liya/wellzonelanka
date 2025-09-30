"use client";

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exercise: {
    exerciseName: string;
    description: string;
    difficulty: string;
    duration: string;
    target: string[];
    image?: string;
    url?: string;
  }) => void;
}

export default function AddExerciseModal({ isOpen, onClose, onSubmit }: AddExerciseModalProps) {
  const [exerciseData, setExerciseData] = useState({
    exerciseName: '',
    description: '',
    difficulty: 'Beginner',
    duration: '',
    target: [] as string[],
    image: '',
    url: ''
  });

  const [newTarget, setNewTarget] = useState('');

  const addTarget = () => {
    if (newTarget.trim() && !exerciseData.target.includes(newTarget.trim())) {
      setExerciseData(prev => ({
        ...prev,
        target: [...prev.target, newTarget.trim()]
      }));
      setNewTarget('');
    }
  };

  const removeTarget = (targetToRemove: string) => {
    setExerciseData(prev => ({
      ...prev,
      target: prev.target.filter(target => target !== targetToRemove)
    }));
  };

  const handleSubmit = () => {
    if (!exerciseData.exerciseName || !exerciseData.description || !exerciseData.duration) {
      alert('Please fill in all required fields: Exercise Name, Description, and Duration');
      return;
    }

    onSubmit(exerciseData);
    
    // Reset form
    setExerciseData({
      exerciseName: '',
      description: '',
      difficulty: 'Beginner',
      duration: '',
      target: [],
      image: '',
      url: ''
    });
    setNewTarget('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Exercise</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Push-ups, Squats, Plank..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  value={exerciseData.exerciseName}
                  onChange={(e) => setExerciseData(prev => ({ ...prev, exerciseName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  value={exerciseData.difficulty}
                  onChange={(e) => setExerciseData(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5-10 minutes, 30 seconds, 3 sets of 15 reps..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  value={exerciseData.duration}
                  onChange={(e) => setExerciseData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Muscles/Body Parts
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g., Chest, Shoulders, Arms..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTarget()}
                  />
                  <button
                    type="button"
                    onClick={addTarget}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {exerciseData.target.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exerciseData.target.map((target, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {target}
                        <button
                          onClick={() => removeTarget(target)}
                          className="hover:bg-blue-200 rounded-full p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe the exercise, proper form, benefits, and any important tips..."
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  value={exerciseData.description}
                  onChange={(e) => setExerciseData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Right Column - Media and Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media & Links</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercise Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/exercise-image.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  value={exerciseData.image}
                  onChange={(e) => setExerciseData(prev => ({ ...prev, image: e.target.value }))}
                />
                {exerciseData.image && (
                  <div className="mt-2">
                    <img 
                      src={exerciseData.image} 
                      alt="Exercise preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        alert('Invalid image URL');
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Tutorial URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  value={exerciseData.url}
                  onChange={(e) => setExerciseData(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Exercise Preview</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Name:</strong> {exerciseData.exerciseName || 'Not set'}</p>
                  <p><strong>Difficulty:</strong> {exerciseData.difficulty}</p>
                  <p><strong>Duration:</strong> {exerciseData.duration || 'Not set'}</p>
                  <p><strong>Targets:</strong> {exerciseData.target.length > 0 ? exerciseData.target.join(', ') : 'None added'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
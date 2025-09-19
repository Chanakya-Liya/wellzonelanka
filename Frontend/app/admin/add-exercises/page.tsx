"use client";

import { useState } from 'react';
import { Search, User, Dumbbell, Users, Home, Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import AddExerciseModal from '@/app/admin/add-exercises/popup/page';

// Interface for exercise data
interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  muscles: string;
  description: string;
}

export default function AddExercisesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Squats',
      bodyPart: 'Lower Body',
      muscles: 'Quadriceps, Hamstrings, Glutes',
      description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.'
    },
    {
      id: '2',
      name: 'Push-ups',
      bodyPart: 'Upper Body',
      muscles: 'Chest, Shoulders, Triceps',
      description: 'A fundamental upper body exercise that builds strength and stability.'
    },
    {
      id: '3',
      name: 'Lunges',
      bodyPart: 'Lower Body',
      muscles: 'Quadriceps, Hamstrings, Glutes',
      description: 'A unilateral exercise that improves balance and leg strength.'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter exercises based on search query
  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update the navigation handler
  const handleNavigation = (path: string) => {
    if (path === 'new-users') {
      router.push('/admin'); // This will navigate to the main admin page
    } else {
      router.push(`/admin/${path}`);
    }
  };

  // Add exercise handler
  const handleAddExercise = (exerciseData: any) => {
    const newExercise = {
      id: (exercises.length + 1).toString(),
      ...exerciseData
    };
    setExercises([...exercises, newExercise]);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-xl text-gray-800 font-semibold">Admin</span>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => handleNavigation('doc-admin')}
              className="w-full flex items-center text-gray-800 gap-3 px-4 py-2 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <User className="w-5 h-5" />
              Doctor's
            </button>
            <button 
              onClick={() => handleNavigation('trainer-admin')}
              className="w-full flex text-gray-800 items-center gap-3 px-4 py-2 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Dumbbell className="w-5 h-5" />
              Trainer's
            </button>
            
            <button 
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg bg-blue-50 text-blue-600"
            >
              <Link2 className="w-5 h-5" />
              Exercises
            </button>

            <button 
              onClick={() => handleNavigation('new-users')}
              className="w-full flex text-gray-800 items-center gap-3 px-4 py-2 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Users className="w-5 h-5" />
              New Users
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          {/* Search Bar */}
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search Exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Today's Date */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-gray-800 bg-white px-4 py-2 rounded-lg shadow">
              {format(new Date(), 'yyyy-MM-dd')}
            </div>
          </div>
        </div>

        {/* Add New Exercises Box */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex flex-col items-center text-center">
          <h2 className="text-lg text-gray-800 font-semibold mb-2">Add New Exercises</h2>
          <p className="text-gray-500 text-sm mb-4">Added Exercises to the website will be listed here</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add New Exercises
          </button>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-sm p-6 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-gray-800">{exercise.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm ">
                      {exercise.bodyPart}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-medium">Muscles:</span> {exercise.muscles}
                  </p>
                  <p className="text-gray-500 mt-2">{exercise.description}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add Exercise Modal */}
        <AddExerciseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddExercise}
        />
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import AddSuccessStoryModal from '@/components/AddSuccessStoryModal';
import EditSuccessStoryModal from '@/components/EditSuccessStoryModal';
import MySuccessStories from '@/components/MySuccessStories';

interface SuccessStory {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  profileImage: string;
  achievement: string;
  story: string;
  rating: number;
  isApproved: boolean;
  createdAt: any;
  updatedAt: any;
}

export default function MySuccessStoriesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = '/auth/login';
      }
    } else {
      window.location.href = '/auth/login';
    }
  }, []);

  const handleAddStory = async (storyData: {
    achievement: string;
    story: string;
    rating: number;
    profileImage?: string;
  }) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/success-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userEmail: currentUser.email,
          ...storyData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowAddModal(false);
        setRefreshKey(prev => prev + 1); // Trigger refresh
        alert('Success story submitted for review! It will be published once approved by our team.');
      } else {
        alert(data.message || 'Failed to submit success story');
      }
    } catch (error) {
      console.error('Error submitting success story:', error);
      alert('Failed to submit success story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStory = (story: SuccessStory) => {
    setEditingStory(story);
    setShowEditModal(true);
  };

  const handleUpdateStory = async (storyId: string, updates: Partial<SuccessStory>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/success-stories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId,
          updates
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowEditModal(false);
        setEditingStory(null);
        setRefreshKey(prev => prev + 1); // Trigger refresh
        alert('Success story updated! It will be reviewed again before being published.');
      } else {
        alert(data.message || 'Failed to update success story');
      }
    } catch (error) {
      console.error('Error updating success story:', error);
      alert('Failed to update success story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-cyan-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Success Stories</h1>
                <p className="text-gray-600">Share your journey and inspire others</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Story
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <MySuccessStories 
            key={refreshKey}
            userId={currentUser.id} 
            onEdit={handleEditStory}
          />
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Why Share Your Success Story?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <strong>Inspire Others:</strong> Your journey can motivate someone else to start their fitness transformation.
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <strong>Build Community:</strong> Connect with others who share similar goals and challenges.
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <strong>Celebrate Achievements:</strong> Take pride in your accomplishments and milestones.
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <strong>Help WellZone Lanka:</strong> Show others the positive impact of our platform.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddSuccessStoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStory}
        isLoading={isSubmitting}
      />

      <EditSuccessStoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateStory}
        story={editingStory}
        isLoading={isSubmitting}
      />
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { Star, Users, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import AddSuccessStoryModal from '@/components/AddSuccessStoryModal';

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

export default function AllSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    fetchAllStories();
  }, []);

  const fetchAllStories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/success-stories?approved=true');
      const data = await response.json();

      if (data.success) {
        setStories(data.stories);
      } else {
        setError(data.message || 'Failed to fetch success stories');
      }
    } catch (error) {
      console.error('Error fetching success stories:', error);
      setError('Failed to fetch success stories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = async (storyData: {
    achievement: string;
    story: string;
    rating: number;
    profileImage?: string;
  }) => {
    if (!currentUser) return;

    setIsSubmittingStory(true);
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
        setShowStoryModal(false);
        alert('Success story posted successfully! It is now live on the website.');
        // Refresh stories
        fetchAllStories();
      } else {
        alert(data.message || 'Failed to submit success story');
      }
    } catch (error) {
      console.error('Error submitting success story:', error);
      alert('Failed to submit success story. Please try again.');
    } finally {
      setIsSubmittingStory(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Home
                </button>
              </Link>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-cyan-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Success Stories</h1>
                  <p className="text-gray-600">Real transformations from our community</p>
                </div>
              </div>
            </div>
            {currentUser?.role === 'user' && (
              <button
                onClick={() => setShowStoryModal(true)}
                className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Share Your Story
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <span className="ml-3 text-gray-600">Loading success stories...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-600 mb-4">Error: {error}</div>
            <button 
              onClick={fetchAllStories}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Success Stories Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your transformation journey!</p>
            {currentUser?.role === 'user' && (
              <button
                onClick={() => setShowStoryModal(true)}
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                Share Your Story
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Community Transformations
                </h2>
                <p className="text-3xl font-bold text-cyan-600">{stories.length}</p>
                <p className="text-gray-600">Success stories shared</p>
              </div>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story, index) => (
                <div 
                  key={story.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center mb-4">
                      <img
                        src={story.profileImage || '/assets/default-avatar.png'}
                        alt={story.userName}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                        }}
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{story.userName}</h3>
                        <p className="text-cyan-600 font-medium">{story.achievement}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= story.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({story.rating}/5)
                      </span>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      &quot;{story.story}&quot;
                    </p>
                    
                    {/* Date */}
                    <p className="text-xs text-gray-500">
                      Shared on {formatDate(story.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            {currentUser?.role === 'user' && (
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-8 mt-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Inspire Others with Your Journey
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Your transformation story could be the motivation someone needs to start their own fitness journey. 
                  Share your experience and become part of our inspiring community.
                </p>
                <button
                  onClick={() => setShowStoryModal(true)}
                  className="px-8 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  Share Your Success Story
                </button>
              </div>
            )}

            {/* User Story Management Link */}
            {currentUser?.role === 'user' && (
              <div className="text-center mt-8">
                <Link
                  href="/my-success-stories"
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Manage My Stories
                  <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Success Story Modal */}
      <AddSuccessStoryModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onSubmit={handleAddStory}
        isLoading={isSubmittingStory}
      />
    </div>
  );
}
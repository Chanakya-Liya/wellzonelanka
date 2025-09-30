"use client";

import { useState, useEffect } from 'react';
import { Edit, Trash2, Clock, CheckCircle, X, Star } from 'lucide-react';

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

interface MySuccessStoriesProps {
  userId: string;
  onEdit: (story: SuccessStory) => void;
}

export default function MySuccessStories({ userId, onEdit }: MySuccessStoriesProps) {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStories();
  }, [userId]);

  const fetchUserStories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/success-stories?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setStories(data.stories);
      } else {
        setError(data.message || 'Failed to fetch stories');
      }
    } catch (error) {
      console.error('Error fetching user stories:', error);
      setError('Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/success-stories?storyId=${storyId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setStories(stories.filter(story => story.id !== storyId));
      } else {
        alert(data.message || 'Failed to delete story');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading your stories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error: {error}</div>
        <button 
          onClick={fetchUserStories}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">You haven't shared any success stories yet.</div>
        <p className="text-sm text-gray-400">Share your journey to inspire others!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        My Success Stories ({stories.length})
      </h3>
      
      {stories.map((story) => (
        <div key={story.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <img
                src={story.profileImage || '/assets/default-avatar.png'}
                alt={story.userName}
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                }}
              />
              <div>
                <h4 className="font-semibold text-gray-900">{story.achievement}</h4>
                <p className="text-sm text-gray-500">
                  Submitted on {formatDate(story.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Status Badge */}
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                story.isApproved
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {story.isApproved ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approved
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Pending Review
                  </>
                )}
              </div>
              
              {/* Action Buttons */}
              <button
                onClick={() => onEdit(story)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Story"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(story.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= story.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({story.rating} star{story.rating !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Story Content */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            &quot;{story.story}&quot;
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              {story.updatedAt && story.updatedAt !== story.createdAt
                ? `Last updated: ${formatDate(story.updatedAt)}`
                : ''
              }
            </span>
            {!story.isApproved && (
              <span className="text-yellow-600">
                Your story is being reviewed and will be published once approved.
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
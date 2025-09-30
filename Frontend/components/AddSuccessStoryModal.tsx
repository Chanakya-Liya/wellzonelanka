"use client";

import { useState } from 'react';
import { X, Star, Upload } from 'lucide-react';

interface AddSuccessStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (story: {
    achievement: string;
    story: string;
    rating: number;
    profileImage?: string;
  }) => void;
  isLoading?: boolean;
}

export default function AddSuccessStoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: AddSuccessStoryModalProps) {
  const [formData, setFormData] = useState({
    achievement: '',
    story: '',
    rating: 5,
    profileImage: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      profileImage: url
    }));
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.achievement.trim() || !formData.story.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.story.length < 50) {
      alert('Please provide a more detailed story (at least 50 characters)');
      return;
    }

    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      achievement: '',
      story: '',
      rating: 5,
      profileImage: ''
    });
    setImagePreview('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Share Your Success Story</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Achievement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Achievement *
              </label>
              <input
                type="text"
                name="achievement"
                value={formData.achievement}
                onChange={handleInputChange}
                placeholder="e.g., Lost 25kg in 6 months, Gained 10kg muscle mass..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL (Optional)
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                {imagePreview && (
                  <div className="flex justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Add a URL to your photo to make your story more personal. If left empty, a default image will be used.
                </p>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate Your Experience *
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`p-1 rounded transition-colors ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400`}
                    disabled={isLoading}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {/* Story */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Story *
              </label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleInputChange}
                placeholder="Share your journey with WellZone Lanka. What challenges did you face? How did our platform help you? What advice would you give to others?"
                className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters. Current: {formData.story.length}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Before You Submit:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your story will be reviewed before being published</li>
                <li>• Only approved stories will appear on the website</li>
                <li>• Please ensure your story is genuine and appropriate</li>
                <li>• You can edit or delete your story after submission</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Story'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
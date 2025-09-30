"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Footer } from "@/app/exercise/Footer";
import { useState, useEffect } from "react";

import {
  Star,
  Calendar,
  MessageSquare,
  ArrowRight,
  Users,
  Search,
  MapPin,
  Clock,
  Award,
} from "lucide-react";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialization: string;
  experience: number;
  gymAffiliation?: string;
  certifications?: string;
  bio?: string;
  trainingPhilosophy?: string;
  isApproved: boolean;
  createdAt: string;
  rating?: number;
  reviewCount?: number;
  hourlyRate?: string;
  location?: string;
  availableHours?: string;
}

// Get specialty display name
const getSpecialtyDisplay = (specialty: string) => {
  const specialtyMap: { [key: string]: string } = {
    "weight-training": "Weight Training",
    "cardio-fitness": "Cardio Fitness", 
    "yoga": "Yoga",
    "nutrition": "Nutrition",
    "pilates": "Pilates",
    "crossfit": "CrossFit",
    "sports-specific": "Sports-Specific",
    "functional-fitness": "Functional Fitness",
  };
  return specialtyMap[specialty] || specialty;
};

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [reviewModalTrainer, setReviewModalTrainer] = useState<Trainer | null>(null);

  // Fetch trainers from database
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setError(null);
        const response = await fetch('/api/trainers/get-trainers');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
          // Enrich trainers with default values for missing fields
          const enrichedTrainers = data.trainers.map((trainer: Trainer) => ({
            ...trainer,
            // Use actual rating/reviewCount from database if available, otherwise use defaults
            rating: trainer.rating || 0,
            reviewCount: trainer.reviewCount || 0,
            hourlyRate: trainer.hourlyRate || `Rs. ${(2000 + Math.random() * 3000).toFixed(0)}/hour`,
            location: trainer.location || 'Sri Lanka',
            availableHours: trainer.availableHours || 'Mon-Fri: 6AM-9PM'
          }));
          
          setTrainers(enrichedTrainers || []);
          console.log(`Loaded ${enrichedTrainers.length} trainers from database`);
        } else {
          throw new Error(data.message || 'Failed to fetch trainers');
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setError('Failed to load trainers from database');
        setTrainers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Filter trainers based on search and specialty
  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch = 
      trainer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = 
      selectedSpecialty === "all" || 
      trainer.specialization === selectedSpecialty;

    const matchesFilter = 
      selectedFilter === "all" ||
      (selectedFilter === "weight-training" && trainer.specialization === "weight-training") ||
      (selectedFilter === "yoga" && trainer.specialization === "yoga") ||
      (selectedFilter === "nutrition" && trainer.specialization === "nutrition") ||
      (selectedFilter === "top-rated" && trainer.rating && trainer.rating >= 4.8) ||
      (selectedFilter === "experienced" && trainer.experience >= 5) ||
      (selectedFilter === "available" && trainer.isApproved);

    return trainer.isApproved && matchesSearch && matchesSpecialty && matchesFilter;
  });

  // Get unique specialties for filter buttons
  const uniqueSpecialties = [...new Set(trainers.map(trainer => trainer.specialization))];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading trainers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black">
      
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <br />
      <br />
      
      <section
        className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"
        id="header"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black">
              Connect with <span className="text-primary">Expert Trainers</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Find the perfect fitness professional to guide your home workout
              journey. Our certified trainers provide personalized coaching and
              support to help you achieve your fitness goals.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar and Filters in one row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search trainers by name or Speciality"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={selectedFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedFilter("all")}
                className={`rounded-full ${
                  selectedFilter === "all" 
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                All
              </Button>
              <Button 
                variant={selectedFilter === "weight-training" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedFilter("weight-training")}
                className={`rounded-full ${
                  selectedFilter === "weight-training" 
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Weight Training
              </Button>
              <Button 
                variant={selectedFilter === "yoga" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedFilter("yoga")}
                className={`rounded-full ${
                  selectedFilter === "yoga" 
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Yoga
              </Button>
              <Button 
                variant={selectedFilter === "nutrition" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedFilter("nutrition")}
                className={`rounded-full ${
                  selectedFilter === "nutrition" 
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Nutrition
              </Button>
              <Button 
                variant={selectedFilter === "more-filters" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedFilter("more-filters")}
                className={`rounded-full ${
                  selectedFilter === "more-filters" 
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                More Filters
              </Button>
            </div>
          </div>

          {/* Specialty Filters - Second Row */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant={selectedSpecialty === "all" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setSelectedSpecialty("all")}
              className={`text-xs px-3 py-1 transition-all ${
                selectedSpecialty === "all" 
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Specialties
            </Button>
            {uniqueSpecialties.map((specialty) => (
              <Button 
                key={specialty}
                variant={selectedSpecialty === specialty ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
                className={`text-xs px-3 py-1 transition-all ${
                  selectedSpecialty === specialty 
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
              >
                {getSpecialtyDisplay(specialty)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="text-center text-red-600 mb-6">
              <p>{error}</p>
            </div>
          )}
          
          {filteredTrainers.length === 0 ? (
            <div className="text-center py-12">
              {error ? (
                <div className="text-red-600">
                  <p className="text-lg font-semibold mb-2">Unable to load trainers</p>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="text-gray-600">
                  <p className="text-lg font-semibold mb-2">No trainers found</p>
                  <p>
                    {searchTerm || selectedSpecialty !== "all" 
                      ? "No trainers match your search criteria. Try adjusting your filters."
                      : "No registered trainers are currently available. Please check back later."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {filteredTrainers.map((trainer) => (
                <Card key={trainer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg rounded-2xl group">
                  {/* Image Section (Top) */}
                  <div className="relative h-64 overflow-hidden">
                    {/* Trainer Photo - Using a placeholder gym/fitness image */}
                    <div 
                      className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('/images/trainer-${parseInt(trainer.id) % 3 + 1}.jpg'), url('/images/gym-background.jpg')`
                      }}
                    >
                      {/* Fallback content when image doesn't load */}
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-white/30">
                            <span className="text-white text-2xl font-bold">
                              {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                            </span>
                          </div>
                          <p className="text-sm font-medium opacity-90">{trainer.firstName} {trainer.lastName}</p>
                          <p className="text-xs opacity-70">{getSpecialtyDisplay(trainer.specialization)} Trainer</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center shadow-lg">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-gray-900 text-sm font-semibold">
                        {trainer.rating && trainer.rating > 0 ? trainer.rating.toFixed(1) : 'New'}
                      </span>
                      <span className="text-gray-600 text-xs ml-1">
                        ({trainer.reviewCount || '0'})
                      </span>
                    </div>
                  </div>

                  {/* Information Section (Bottom) */}
                  <CardContent className="p-6">
                    {/* Trainer Name & Experience */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                        {trainer.firstName} {trainer.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {trainer.experience} Years Experience
                      </p>
                    </div>

                    {/* Specializations as Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                        {getSpecialtyDisplay(trainer.specialization)}
                      </span>
                      {trainer.certifications && (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                          Rehabilitation
                        </span>
                      )}
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                        Low Impact Training
                      </span>
                    </div>

                    {/* Availability & Price Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Mon-Fri, 8AM-6PM</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {trainer.hourlyRate || 'Rs. 2,500/hour'}
                      </span>
                    </div>
                  </CardContent>

                  {/* Action Button */}
                  <CardFooter className="px-6 pb-6 pt-0">
                    <button 
                      onClick={() => setSelectedTrainer(trainer)}
                      className="flex items-center justify-center w-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-all duration-200 text-sm font-medium py-3 rounded-lg group border border-gray-200"
                    >
                      View Profile
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Trainer Profile Modal */}
      {selectedTrainer && (
        <TrainerModal
          trainer={selectedTrainer}
          onClose={() => setSelectedTrainer(null)}
          onOpenReviewModal={setReviewModalTrainer}
        />
      )}
      
      {/* Trainer Review Modal */}
      {reviewModalTrainer && (
        <TrainerReviewModal
          trainer={reviewModalTrainer}
          onClose={() => setReviewModalTrainer(null)}
        />
      )}
      
      <Footer />
    </div>
  );
}

// Trainer Review Modal Component
interface TrainerReviewModalProps {
  trainer: Trainer;
  onClose: () => void;
}

function TrainerReviewModal({ trainer, onClose }: TrainerReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !comment.trim() || !clientName.trim()) {
      alert('Please fill in all fields and provide a rating');
      return;
    }

    if (comment.trim().length < 10) {
      alert('Please provide a comment with at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/trainer-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerId: trainer.id,
          rating,
          comment: comment.trim(),
          clientName: clientName.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
          // Refresh the page to show updated reviews
          window.location.reload();
        }, 2000);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
          <p className="text-gray-600">Thank you for your feedback. Your review helps other clients make informed decisions.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Rate Trainer</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>

          {/* Trainer Info */}
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-lg font-bold">
                {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{trainer.firstName} {trainer.lastName}</h3>
              <p className="text-sm text-gray-600">{trainer.specialization}</p>
              <p className="text-xs text-gray-500">{trainer.experience} years experience</p>
            </div>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-sm text-gray-600">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this trainer... (minimum 10 characters)"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none text-gray-900"
                required
                minLength={10}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {comment.length}/500 characters (minimum 10)
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !rating || !comment.trim() || !clientName.trim()}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSubmitting || !rating || !comment.trim() || !clientName.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-cyan-600 text-white hover:bg-cyan-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Trainer Modal Component
interface TrainerModalProps {
  trainer: Trainer;
  onClose: () => void;
  onOpenReviewModal: (trainer: Trainer) => void;
}

function TrainerModal({ trainer, onClose, onOpenReviewModal }: TrainerModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left Column - Profile Summary Card */}
          <div className="w-full md:w-80 bg-gray-50 p-8 rounded-l-2xl md:rounded-r-none rounded-r-2xl">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            {/* Profile Image */}
            <div className="text-center mb-8">
              <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                  </span>
                </div>
              </div>
              
              {/* Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {trainer.firstName} {trainer.lastName}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center justify-center mb-3">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                <span className="font-bold text-gray-800 text-lg">{trainer.rating?.toFixed(1) || '4.9'}</span>
                <span className="text-gray-500 text-sm ml-2">({trainer.reviewCount || '254'} reviews)</span>
              </div>
              
              {/* Experience */}
              <p className="text-gray-600 font-semibold text-base">
                {trainer.experience} Years Experience
              </p>
            </div>

            {/* Specializations */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-200">
                  Weight Training
                </span>
                <span className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-200">
                  Rehabilitation
                </span>
                <span className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-200">
                  Nutrition
                </span>
                <span className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-200">
                  Calisthenics
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600 font-semibold">Price:</span>
                <span className="font-bold text-gray-900 text-lg">{trainer.hourlyRate || 'Rs. 2,500/hour'}</span>
              </div>
              
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600 font-semibold">Availability:</span>
                <span className="text-gray-900 font-medium">Mon-Fri, 8AM-6PM</span>
              </div>
              
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600 font-semibold">Languages:</span>
                <span className="text-gray-900 font-medium">English, Sinhala, Tamil</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={() => {
                  // Store trainer data and navigate to appointment page
                  localStorage.setItem('selectedTrainer', JSON.stringify(trainer));
                  window.location.href = '/trainers/trainer-appointment';
                }}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-bold text-base shadow-lg"
              >
                📅 Book Session
              </button>
              
              <button 
                onClick={() => {
                  // Close trainer modal and open review modal
                  onClose();
                  onOpenReviewModal(trainer);
                }}
                className="w-full border border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-300 font-semibold text-base shadow-sm"
              >
                ⭐ Rate Trainer
              </button>
            </div>
          </div>

          {/* Right Column - Detailed About Section */}
          <div className="flex-1 p-10 bg-white rounded-r-2xl md:rounded-l-none rounded-l-2xl">
            {/* About Section */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About {trainer.firstName} {trainer.lastName}</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Certified personal trainer with {trainer.experience} years of experience specializing in weight training, 
                rehabilitation, nutrition and calisthenics. I help clients achieve their fitness goals through 
                personalized training programs and nutritional guidance. My approach focuses on building 
                sustainable habits for long-term success.
              </p>
            </div>

            {/* Certifications Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h3>
              <div className="space-y-4">
                <div className="flex items-center py-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">Certified Personal Trainer (CPT)</span>
                </div>
                <div className="flex items-center py-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">Rehabilitation Specialist</span>
                </div>
                <div className="flex items-center py-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">Sports Nutrition Certification</span>
                </div>
                <div className="flex items-center py-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-lg">First Aid and CPR Certified</span>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Education</h3>
              <div className="flex items-center py-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-lg">🎓</span>
                </div>
                <span className="text-gray-700 text-lg">Bachelor's Degree in Sports Science, University of Colombo.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
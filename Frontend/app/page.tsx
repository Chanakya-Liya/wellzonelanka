"use client";

import {
  Activity,
  Users,
  Clock,
  Award,
  ChevronRight,
  Heart,
  Brain,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Dumbbell,
  Calendar,
  X,
  Video,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Footer } from "./Footer";
import { useEffect, useState, useRef } from "react";
import {
  IoIosFlash,
  IoIosFitness,
  IoIosChatbubbles,
  IoIosHeart,
} from "react-icons/io";
import AddSuccessStoryModal from "@/components/AddSuccessStoryModal";
import AddReviewModal from "@/components/AddReviewModal";



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

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    id?: string;
  } | null>(null);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Review related state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Check if user is logged in and fetch success stories
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        setIsLoggedIn(true);
        
        // Fetch user's today appointments
        fetchTodaysAppointments(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
      }
    }

    // Fetch success stories and reviews
    fetchSuccessStories();
    fetchReviews();
  }, []);

  const fetchTodaysAppointments = async (user: any) => {
    if (!user.id || user.role !== 'user') return;
    
    setAppointmentsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch both doctor and trainer appointments
      const [doctorResponse, trainerResponse] = await Promise.all([
        fetch(`/api/appointments/user/${user.id}?date=${today}`),
        fetch(`/api/trainer-appointments/user/${user.id}?date=${today}`)
      ]);
      
      const appointments: any[] = [];
      
      if (doctorResponse.ok) {
        const doctorData = await doctorResponse.json();
        if (doctorData.success && doctorData.appointments) {
          appointments.push(...doctorData.appointments);
        }
      }
      
      if (trainerResponse.ok) {
        const trainerData = await trainerResponse.json();
        if (trainerData.success && trainerData.appointments) {
          appointments.push(...trainerData.appointments);
        }
      }
      
      setUserAppointments(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const fetchSuccessStories = async () => {
    setStoriesLoading(true);
    try {
      console.log('🚀 [HOMEPAGE] Fetching success stories from API...');
      const response = await fetch('/api/success-stories?approved=true', {
        cache: 'no-cache', // Prevent caching
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      console.log('📊 [HOMEPAGE] API Response:', data);
      if (data.success) {
        console.log('✅ [HOMEPAGE] Success stories received:', data.stories?.length || 0);
        console.log('📝 [HOMEPAGE] First story sample:', data.stories?.[0]);
        // Get all available stories for the scrolling carousel
        setSuccessStories(data.stories || []);
      } else {
        console.error('❌ [HOMEPAGE] Failed to fetch success stories:', data.message);
        setSuccessStories([]);
      }
    } catch (error) {
      console.error('💥 [HOMEPAGE] Error fetching success stories:', error);
      setSuccessStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      console.log('🚀 [HOMEPAGE] Fetching reviews from API...');
      const response = await fetch('/api/site-reviews?approved=true', {
        cache: 'no-cache', // Prevent caching
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      
      console.log('📊 [HOMEPAGE] Reviews API Response:', data);
      if (data.success) {
        console.log('✅ [HOMEPAGE] Reviews received:', data.reviews?.length || 0);
        console.log('📝 [HOMEPAGE] First review sample:', data.reviews?.[0]);
        setReviews(data.reviews || []);
      } else {
        console.error('❌ [HOMEPAGE] Failed to fetch reviews:', data.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
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
        alert(data.message || 'Success story submitted successfully! It will appear on the website after admin approval.');
        // Don't refresh success stories since it won't show until approved
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

  const handleAddReview = async (reviewData: {
    rating: number;
    review: string;
    profileImage?: string;
  }) => {
    if (!currentUser) return;

    setIsSubmittingReview(true);
    try {
      const response = await fetch('/api/site-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userEmail: currentUser.email,
          review: reviewData.review, // Correct field name for API
          rating: reviewData.rating,
          profileImage: reviewData.profileImage
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowReviewModal(false);
        alert('Review submitted successfully! It will appear on the website after admin approval.');
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Function to handle Join Us button click
  const handleJoinUsClick = () => {
    if (isLoggedIn) {
      setShowPopup(true);
    } else {
      window.location.href = "/auth/register";
    }
  };

  // Function to close popup
  const closePopup = () => {
    setShowPopup(false);
  };
  // Function to handle scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const JoinUsButton = () => {};

    const handleIntersect = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll(
      ".animate-fade-up, .animate-fade-in, .animate-slide-in-right, .animate-slide-in-left, .animate-scale-in, .animate-pop-in"
    );

    animatedElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      if (observer) {
        animatedElements.forEach((el) => {
          observer.unobserve(el);
        });
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar - Kept exactly as original */}

      <Navbar />

      {/* Improved Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <video
            src="/assets/hh.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full absolute"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1
              className="text-7xl font-bold leading-tight mb-6 animate-fade-in opacity-0"
              style={{ animationDelay: "0.2s" }}
            >
              Health And Fitness Coach
            </h1>
            <p
              className="text-2xl text-gray-100 mb-8 animate-fade-in opacity-0"
              style={{ animationDelay: "0.5s" }}
            >
              Welcome to WellZone Lanka, Unlock a Healthier You with Expert
              Guidance
            </p>
            <div
              className="flex space-x-4 animate-fade-in opacity-0"
              style={{ animationDelay: "0.8s" }}
            >
              <button 
                onClick={handleJoinUsClick}
                className="rounded-full bg-cyan-500 text-white px-8 py-4 text-lg font-semibold hover:bg-cyan-600 transition-colors"
              >
                Get Started
              </button>

              <Link href="/about">
                <button className="rounded-full bg-transparent border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black transition-colors">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-cyan-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* User Dashboard Section - Show appointments when logged in */}
      {isLoggedIn && currentUser?.role === 'user' && userAppointments.length > 0 && (
        <div className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser.firstName}!
              </h2>
              <p className="text-lg text-gray-600">
                Your upcoming appointments are ready. Join when it's time!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {userAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {appointment.doctorName ? `Consultation with Dr. ${appointment.doctorName}` : `Training Session with ${appointment.trainerName}`}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {appointment.serviceType}
                  </p>
                </div>
              ))}
            </div>

            {appointmentsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading your appointments...</p>
              </div>
            )}

            <div className="text-center mt-8">
              <div className="space-x-4">
                <Link href="/doctors" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  Book Doctor Appointment
                  <Calendar className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/trainers" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  Book Trainer Session
                  <Dumbbell className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section with Staggered Pop Animation */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base text-cyan-600 font-semibold tracking-wide uppercase animate-fade-up opacity-0"></h2>
            <p
              className="mt-2 text-5xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl animate-fade-up opacity-0"
              style={{ animationDelay: "0.2s" }}
            >
              Why Choose WellZone Lanka
            </p>
            <p
              className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto animate-fade-up opacity-0"
              style={{ animationDelay: "0.4s" }}
            >
              Our comprehensive approach combines cutting-edge technology with
              expert human coaching
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div
              className="relative p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-pop-in opacity-0 flex flex-col h-full"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute -top-4 -right-4 bg-cyan-500 rounded-full p-4">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Exercise Tracking
              </h3>
              <p className="text-gray-600 flex-grow">
                Track your fitness journey in real time with detailed workout
                logs, performance analytics, and personalized insights. Set
                goals, monitor daily activities, and stay motivated every step
                of the way.
              </p>
              <div className="mt-4 flex items-center text-cyan-600"></div>
            </div>

            {/* Feature 2 - Chat Bot */}
            <div
              className="relative p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-pop-in opacity-0 flex flex-col h-full"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="absolute -top-4 -right-4 bg-cyan-500 rounded-full p-4">
                <IoIosChatbubbles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Chat Bot
              </h3>
              <p className="text-gray-600 flex-grow">
                Have fitness and health support at your fingertips with our
                AI-powered chatbot. Get instant answers to workout queries,
                exercise recommendations, nutrition tips, and general wellness
                advice—all available 24/7 for your convenience.
              </p>
              <div className="mt-4 flex items-center text-cyan-600"></div>
            </div>

            {/* Feature 3 - Gym Trainer */}
            <div
              className="relative p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-pop-in opacity-0 flex flex-col h-full"
              style={{ animationDelay: "1s" }}
            >
              <div className="absolute -top-4 -right-4 bg-cyan-500 rounded-full p-4">
                <IoIosFitness className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Gym Trainer Consultation
              </h3>
              <p className="text-gray-600 flex-grow">
                Get expert fitness coaching from experienced trainers who design
                personalized workout plans, offer professional advice, and keep
                you motivated. Whether you&apos;re just starting out or a
                seasoned athlete, you&apos;ll get the guidance you need to reach
                your fitness goals.
              </p>
              <div className="mt-4 flex items-center text-cyan-600"></div>
            </div>

            {/* Feature 4 - Physiotherapist */}
            <div
              className="relative p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-pop-in opacity-0 flex flex-col h-full"
              style={{ animationDelay: "1.4s" }}
            >
              <div className="absolute -top-4 -right-4 bg-cyan-500 rounded-full p-4">
                <IoIosHeart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Physiotherapist Consultation
              </h3>
              <p className="text-gray-600 flex-grow">
                Get expert care from certified physiotherapists to prevent
                injuries, recover faster, and enhance mobility. Book online
                consultations and receive personalized therapy plans tailored to
                support your well-being.
              </p>
              <div className="mt-4 flex items-center text-cyan-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-cyan-600 font-semibold tracking-wide uppercase animate-fade-up opacity-0"></h2>
            <p
              className="mt-2 text-5xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl animate-fade-up opacity-0"
              style={{ animationDelay: "0.2s" }}
            >
              Success Stories
            </p>
            <p
              className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto animate-fade-up opacity-0"
              style={{ animationDelay: "0.4s" }}
            >
              Hear from our clients who have transformed their lives with
              WellZone Lanka
            </p>
          </div>

          {/* Loading State */}
          {storiesLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-gray-600">Loading success stories...</span>
            </div>
          ) : (
            <>
              {successStories.length > 0 ? (
                /* Horizontally Scrolling Success Stories */
                <div className="relative overflow-hidden scroll-container" ref={scrollContainerRef}>
                  <div 
                    className="flex space-x-6 animate-horizontal-scroll"
                    style={{
                      width: 'fit-content',
                      animation: 'scroll 30s linear infinite'
                    }}
                  >
                    {(() => {
                      // Only use real stories from database - no mock data
                      const realStories = successStories;
                      
                      // If we have fewer than 3 stories, duplicate them for scrolling effect
                      let displayStories = [...realStories];
                      if (realStories.length < 3) {
                        // Duplicate stories to have at least 6 items for smooth scrolling
                        while (displayStories.length < 6) {
                          displayStories = [...displayStories, ...realStories];
                        }
                      }
                      
                      // Create copies for infinite scroll
                      const scrollStories = [...displayStories, ...displayStories, ...displayStories];
                      
                      return scrollStories.map((story, index) => (
                      <div 
                        key={`${story.id}-${index}`} 
                        className="flex-none w-80 h-80 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col"
                      >
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3 flex-shrink-0">
                            {story.profileImage ? (
                              <img
                                src={story.profileImage}
                                alt={story.userName}
                                className="h-full w-full object-cover rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const nextSibling = target.nextElementSibling as HTMLElement;
                                  if (nextSibling) {
                                    nextSibling.classList.remove('hidden');
                                  }
                                }}
                              />
                            ) : null}
                            <Users className={`w-6 h-6 ${story.profileImage ? 'hidden' : ''}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base font-bold text-black truncate">
                              {story.userName}
                            </h3>
                            <p className="text-black font-medium text-xs truncate">{story.achievement}</p>
                          </div>
                        </div>
                        <div className="flex mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (story.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-black italic font-medium text-sm leading-relaxed h-full overflow-hidden text-ellipsis">
                            &quot;{story.story && story.story.length > 100 ? `${story.story.substring(0, 100)}...` : (story.story || 'Amazing transformation with WellZone Lanka!')}&quot;
                          </p>
                        </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ) : (
                /* No Stories Available - Show Message */
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Success Stories Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Be the first to share your transformation journey with WellZone Lanka!
                  </p>
                  {isLoggedIn && currentUser?.role === 'user' && (
                    <button
                      onClick={() => setShowStoryModal(true)}
                      className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Share Your Success Story
                    </button>
                  )}
                </div>
              )}

              {/* Add Story Button and View All Link - Only show when there are stories */}
              {successStories.length > 0 && (
                <div className="text-center mt-12 space-y-4">
                  {isLoggedIn && currentUser?.role === 'user' && (
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={() => setShowStoryModal(true)}
                        className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Share Your Success Story
                      </button>
                      <Link
                        href="/my-success-stories"
                        className="inline-flex items-center px-4 py-2 text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        Manage My Stories
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  )}
                  
                  {successStories.length >= 3 && (
                    <div className="mt-6">
                      <p className="text-gray-600">
                        Want to see more inspiring transformations?
                      </p>
                      <Link
                        href="/success-stories"
                        className="inline-flex items-center mt-2 text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        View All Success Stories
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-cyan-600 font-semibold tracking-wide uppercase animate-fade-up opacity-0"></h2>
            <p
              className="mt-2 text-5xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl animate-fade-up opacity-0"
              style={{ animationDelay: "0.2s" }}
            >
              Client Reviews
            </p>
            <p
              className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto animate-fade-up opacity-0"
              style={{ animationDelay: "0.4s" }}
            >
              What our clients say about their experience with WellZone Lanka
            </p>
          </div>

          {/* Loading State */}
          {reviewsLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-gray-600">Loading reviews...</span>
            </div>
          ) : (
            <>
              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {reviews.slice(0, 6).map((review: any) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                            <span className="text-cyan-600 font-semibold text-lg">
                              {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {review.userName || 'Anonymous'}
                          </h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-4">{review.comment}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Star className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500 mb-6">Be the first to share your experience with WellZone Lanka!</p>
                </div>
              )}

              {/* Action Buttons */}
              {isLoggedIn && (
                <div className="text-center mt-12">
                  <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Write a Review
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-cyan-600 font-semibold tracking-wide uppercase animate-fade-up opacity-0">
              Process
            </h2>
            <p
              className="mt-2 text-5xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl animate-fade-up opacity-0"
              style={{ animationDelay: "0.2s" }}
            >
              How It Works
            </p>
            <p
              className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto animate-fade-up opacity-0"
              style={{ animationDelay: "0.4s" }}
            >
              Our simple 4-step process to transform your health and fitness
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-cyan-200 transform -translate-x-1/2"></div>

            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 animate-slide-in-left opacity-0">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 text-cyan-600 mb-4">
                        <span className="text-xl font-bold">1</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Expert fitness trainers
                      </h3>
                      <p className="text-gray-600">
                        Train with skilled fitness experts who create custom
                        workout plans, give professional advice, and keep you
                        motivated. No matter your fitness level, get the right
                        support to reach your goals.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-12 w-12 rounded-full bg-cyan-500 border-4 border-white shadow-lg flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <Image
                      src="/assets/hmE.png"
                      alt="Initial Assessment"
                      width={400}
                      height={100}
                      className="rounded-xl shadow-lg animate-slide-in-right opacity-0"
                    />
                  </div>
                </div>
              </div>
              {/* Step 2 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                    <Image
                      src="/assets/hmD.png"
                      alt="Personalized Plan Creation"
                      width={600}
                      height={400}
                      className="rounded-xl shadow-lg animate-slide-in-left opacity-0"
                    />
                  </div>
                  <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-12 w-12 rounded-full bg-cyan-500 border-4 border-white shadow-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 animate-slide-in-right opacity-0">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 text-cyan-600 mb-4">
                        <span className="text-xl font-bold">2</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Customized workout plans
                      </h3>
                      <p className="text-gray-600">
                        Get a workout plan made just for you by expert trainers.
                        They design exercises that match your fitness level,
                        goals, and lifestyle. Whether you want to lose weight,
                        build muscle, or stay active, your plan will keep you on
                        track and motivated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 animate-slide-in-left opacity-0">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 text-cyan-600 mb-4">
                        <span className="text-xl font-bold">3</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Nutrition guidance
                      </h3>
                      <p className="text-gray-600">
                        Get expert nutrition guidance from professionals who
                        create personalized meal plans, offer helpful advice,
                        and support your healthy eating journey. Whether you
                        want to lose weight, build muscle, or improve overall
                        health, get the right nutrition plan to reach your
                        goals.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-12 w-12 rounded-full bg-cyan-500 border-4 border-white shadow-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <Image
                      src="/assets/hmF.png"
                      alt="Implementation & Coaching"
                      width={600}
                      height={400}
                      className="rounded-xl shadow-lg animate-slide-in-right opacity-0"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                    <Image
                      src="/assets/hmB.png"
                      alt="Continuous Optimization"
                      width={600}
                      height={400}
                      className="rounded-xl shadow-lg animate-slide-in-left opacity-0"
                    />
                  </div>
                  <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="h-12 w-12 rounded-full bg-cyan-500 border-4 border-white shadow-lg flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 animate-slide-in-right opacity-0">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 text-cyan-600 mb-4">
                        <span className="text-xl font-bold">4</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Mental wellness support
                      </h3>
                      <p className="text-gray-600">
                        Get support for your mental well-being from experts who
                        provide guidance, stress management tips, and
                        mindfulness techniques. Whether you&apos;re facing daily
                        stress or looking to improve your overall mindset, get
                        the help you need to feel your best.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Step 5 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 animate-slide-in-left opacity-0">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 text-cyan-600 mb-4">
                        <span className="text-xl font-bold">5</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Community support
                      </h3>
                      <p className="text-gray-600">
                        Join a supportive fitness community where you can
                        connect with others, share your progress, and stay
                        motivated. Whether you&apos;re a beginner or
                        experienced, our community helps you stay inspired and
                        achieve your goals together.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-12 w-12 rounded-full bg-cyan-500 border-4 border-white shadow-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <Image
                      src="/assets/hmA.png"
                      alt="Community Support"
                      width={600}
                      height={400}
                      className="rounded-xl shadow-lg animate-slide-in-right opacity-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action - Enhanced with pulse and staggered animations */}
      <div className="bg-white-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6 animate-fade-up opacity-0">
            <span className="relative inline-block">
              Start Your Transformation Today
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-white rounded animate-pulse-width"></span>
            </span>
          </h2>
          <p
            className="text-xl text-gray-800 mb-10 max-w-3xl mx-auto animate-fade-up opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Join WellZone Lanka for a holistic approach to your health and
            fitness. Our expert team provides personalized guidance to help you
            achieve your wellness goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Fixed the button tags here */}

            <button
              className="group relative overflow-hidden rounded-full bg-cyan-600 border-white text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleJoinUsClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="flex items-center justify-center relative z-10">
                Join Us Now
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal for Already Logged In Users */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4 relative">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                You're Already Logged In!
              </h3>
              
              <p className="text-gray-600 mb-6">
                Welcome back, {currentUser?.firstName || 'User'}! You're already part of the WellZone Lanka community.
              </p>
              
              <div className="space-y-3">
                {currentUser?.role === 'doctor' && (
                  <button
                    onClick={() => window.location.href = '/doctor-dashboard'}
                    className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
                  >
                    Go to Doctor Dashboard
                  </button>
                )}
                
                {currentUser?.role === 'trainer' && (
                  <button
                    onClick={() => window.location.href = '/trainer-dashboard'}
                    className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
                  >
                    Go to Trainer Dashboard
                  </button>
                )}
                
                {currentUser?.role === 'user' && (
                  <button
                    onClick={() => window.location.href = '/user-profile'}
                    className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
                  >
                    Go to My Profile
                  </button>
                )}
                
                <button
                  onClick={closePopup}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Add Success Story Modal */}
      <AddSuccessStoryModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onSubmit={handleAddStory}
        isLoading={isSubmittingStory}
      />

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleAddReview}
        isLoading={isSubmittingReview}
      />

      {/* Add CSS for animations */}
      <style jsx global>{`
        /* Base animation styles */
        .animate-fade-up, .animate-fade-in, .animate-slide-in-right, .animate-slide-in-left, .animate-scale-in, .animate-pop-in {
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        
        /* Animation classes when elements come into view */
        .animate-fade-up.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-fade-in.animate-in {
          opacity: 1;
        }
        
        .animate-slide-in-right.animate-in {
          opacity: 1;
          transform: translateX(0);
        }
        
        .animate-slide-in-left.animate-in {
          opacity: 1;
          transform: translateX(0);
        }
        
        .animate-scale-in.animate-in {
          opacity: 1;
          transform: scale(1);
        }
        
        /* Pop-in animation for features */
        .animate-pop-in {
          transform: scale(0.6);
        }
        
        .animate-pop-in.animate-in {
          opacity: 1;
          transform: scale(1);
        }
        
        /* Initial states */
        .animate-fade-up {
          transform: translateY(40px);
        }
        
        .animate-slide-in-right {
          transform: translateX(80px);
        }
        
        .animate-slide-in-left {
          transform: translateX(-80px);
        }
        
        .animate-scale-in {
          transform: scale(0.9);
        }
        
        /* Pulse animation for CTA heading underline */
        @keyframes pulseWidth {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-pulse-width {
          animation: pulseWidth 1.5s ease-in-out forwards;
        }
        
        /* Horizontal scrolling animation for success stories */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-horizontal-scroll {
          animation: scroll 30s linear infinite;
        }
        
        /* Pause animation on hover */
        .animate-horizontal-scroll:hover {
          animation-play-state: paused;
        }
        
        /* Smooth scrolling container */
        .scroll-container {
          overflow: hidden;
          position: relative;
        }
        
        .scroll-container::before,
        .scroll-container::after {
          content: '';
          position: absolute;
          top: 0;
          width: 50px;
          height: 100%;
          z-index: 10;
          pointer-events: none;
        }
        
        .scroll-container::before {
          left: 0;
          background: linear-gradient(to right, rgb(249, 250, 251), transparent);
        }
        
        .scroll-container::after {
          right: 0;
          background: linear-gradient(to left, rgb(249, 250, 251), transparent);
        }
        
        /* Slide animation for button icons */
        @keyframes slideRight {
          0% { transform: translateX(-10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-right {
          animation: slideRight 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/hooks/useAuth';
import Navbar from "@/components/Navbar";
import { Footer } from '@/app/Footer';
// We'll need to create trainer appointment service similar to doctor appointments
// import { createTrainerAppointment, TrainerAppointmentData } from '../../../lib/services/trainerAppointmentService';

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  experience: number;
  gymAffiliation?: string;
  certifications?: string;
  isApproved: boolean;
  role: string;
  createdAt: string;
  name?: string;
  rating?: number;
  reviewCount?: number;
  hourlyRate?: string;
  reviews?: Review[];
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ClientDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  fitnessGoals: string;
  experience: string;
}

function TrainerBookingAppointment() {
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Form state
  const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Client Details & Payment
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    fitnessGoals: '',
    experience: ''
  });
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Reviews data
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const timeSlots = [
    "6:00AM", "7:00AM", "8:00AM", "9:00AM",
    "10:00AM", "11:00AM", "12:00PM", "1:00PM",
    "2:00PM", "3:00PM", "4:00PM", "5:00PM",
    "6:00PM", "7:00PM", "8:00PM", "9:00PM"
  ];

  useEffect(() => {
    const storedTrainer = localStorage.getItem('selectedTrainer');
    if (storedTrainer) {
      try {
        const trainerData = JSON.parse(storedTrainer);
        setTrainer(trainerData);
        
        // Fetch actual reviews from API
        const fetchReviews = async () => {
          try {
            const response = await fetch(`/api/trainer-reviews?trainerId=${trainerData.id}`);
            const data = await response.json();
            
            if (data.success) {
              setReviews(data.reviews);
            } else {
              console.error('Failed to fetch reviews:', data.error);
              setReviews([]);
            }
          } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
          } finally {
            setReviewsLoading(false);
          }
        };
        
        fetchReviews();
        
      } catch (error) {
        console.error('Error parsing trainer data:', error);
        router.push('/trainers');
      }
    } else {
      router.push('/trainers');
    }
    setLoading(false);
  }, [router]);

  const handleGoBack = () => {
    router.push('/trainers');
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isTimeSlotDisabled = (timeSlot: string) => {
    if (!selectedDate) return false;
    
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (!isToday) return false; // If not today, all time slots are available
    
    // Convert time slot to 24-hour format for comparison
    const [time, period] = timeSlot.split(/(?=[AP]M)/);
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const slotTime = new Date();
    slotTime.setHours(hours, minutes || 0, 0, 0);
    
    return slotTime <= today;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(selectedDate)) {
      setSelectedDate(selectedDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleClientDetailsChange = (field: keyof ClientDetails, value: string) => {
    setClientDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !clientDetails.firstName || !clientDetails.lastName) {
      alert('Please fill in all required fields');
      return;
    }

    setBookingLoading(true);

    try {
      // Get current user data from localStorage for userId
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      console.log('Current user from localStorage:', currentUser);
      console.log('User ID:', currentUser.id);
      console.log('User Email:', currentUser.email);
      
      if (!currentUser.id || !currentUser.email) {
        console.error('Missing user credentials:', { id: currentUser.id, email: currentUser.email });
        alert('Please log in to book an appointment');
        setBookingLoading(false);
        return;
      }

      // Format date as string (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Prepare appointment data matching the required schema
      const appointmentData = {
        trainerId: trainer?.id,
        trainerName: `${trainer?.firstName} ${trainer?.lastName}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        userfirstname: clientDetails.firstName,
        userlastname: clientDetails.lastName,
        userphonenumber: clientDetails.phoneNumber,
        useradress: clientDetails.address,
        userdescription: clientDetails.fitnessGoals,
        date: formattedDate,
        time: selectedTime,
        serviceType: "Personal Training",
        status: "Confirmed"
      };

      console.log('Creating trainer appointment:', appointmentData);

      // Call the API to create the appointment
      const response = await fetch('/api/trainer-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
        const confirmMessage = `Training session confirmed with ${trainer?.firstName} ${trainer?.lastName} on ${selectedDate.toLocaleDateString()} at ${selectedTime}.`;
        const rateNow = confirm(`${confirmMessage}\n\nWould you like to rate this trainer now?`);
        
        if (rateNow) {
          // Stay on page to show rating modal
          setShowRatingModal(true);
        } else {
          router.push('/trainers');
        }
      } else {
        console.error('API error:', result.message);
        alert('Failed to book training session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating training appointment:', error);
      alert('Failed to book training session. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Trainer information not found</p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            Go Back to Trainers
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Navbar />
        <div className="bg-cyan-400 py-4" >
          <div className="max-w-full mx-auto flex items-center px-4" style={{ marginTop: '10vh' }}>
            <button 
              onClick={handleGoBack}
              className="text-white hover:text-gray-200 mr-4"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-black">Book Training Session</h1>
          </div>
        </div>

        <div className="max-w-full mx-auto py-6" >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
            
            {/* Left Column - Trainer Info and Client Reviews */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trainer Profile Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {trainer.firstName} {trainer.lastName}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="mr-2">🏋️</span>
                      <span>{trainer.specialization}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="mr-2">📅</span>
                      <span>{trainer.experience}+ Years Experience</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="mr-2">💰</span>
                      <span>{trainer.hourlyRate || 'Rs. 2,500/hour'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{trainer.rating?.toFixed(1) || '4.9'} Rating ({reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Reviews */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Client Reviews {reviews.length > 0 && `(${reviews.length})`}
                </h3>
                
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                    <span className="ml-2 text-gray-600">Loading reviews...</span>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-sm text-gray-400">Be the first to review this trainer!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {review.clientName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                              <span className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 italic pl-11">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
                
                {/* Calendar and Time Slots Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Step 1: Date Selection - Always visible */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Training Date</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-700" />
                        </button>
                        <h4 className="text-lg font-semibold text-gray-900">{formatDate(currentMonth)}</h4>
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
                          <div key={`empty-${index}`} className="p-2"></div>
                        ))}
                        
                        {/* Days of the month */}
                        {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
                          const day = index + 1;
                          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                          const isDisabled = isDateDisabled(date);
                          const isSelected = selectedDate && 
                            selectedDate.getDate() === day && 
                            selectedDate.getMonth() === currentMonth.getMonth() &&
                            selectedDate.getFullYear() === currentMonth.getFullYear();
                          
                          return (
                            <button
                              key={day}
                              onClick={() => !isDisabled && handleDateSelect(day)}
                              disabled={isDisabled}
                              className={`p-2 text-center text-sm rounded font-medium ${
                                isDisabled 
                                  ? 'text-gray-300 cursor-not-allowed' 
                                  : isSelected
                                  ? 'bg-cyan-500 text-white'
                                  : 'text-gray-900 hover:bg-cyan-100 cursor-pointer'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Time Selection - Appears after date selection */}
                  {selectedDate && (
                    <div className="animate-fadeIn">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Time Slot</h3>
                        <button
                          onClick={() => {
                            setSelectedDate(null);
                            setSelectedTime('');
                            setClientDetails({
                              firstName: '',
                              lastName: '',
                              phoneNumber: '',
                              address: '',
                              fitnessGoals: '',
                              experience: ''
                            });
                          }}
                          className="text-cyan-600 hover:text-cyan-700 text-sm"
                        >
                          Change Date
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        Selected Date: {selectedDate?.toLocaleDateString()}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                        {timeSlots.map((time) => {
                          const isDisabled = isTimeSlotDisabled(time);
                          return (
                            <button
                              key={time}
                              onClick={() => !isDisabled && handleTimeSelect(time)}
                              disabled={isDisabled}
                              className={`p-3 text-center border-2 rounded-lg transition-colors ${
                                isDisabled
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : selectedTime === time
                                  ? 'border-cyan-500 bg-cyan-500 text-white shadow-md'
                                  : 'border-gray-300 bg-white hover:border-cyan-500 hover:bg-cyan-50 text-gray-700'
                              }`}
                            >
                              <Clock className="h-4 w-4 mx-auto mb-1" />
                              <span className="text-sm font-medium">{time}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Client Details & Payment - Appears after time selection */}
                {selectedDate && selectedTime && (
                  <div className="animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Client Details */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Client Details</h3>
                          <button
                            onClick={() => {
                              setSelectedTime('');
                              setClientDetails({
                                firstName: '',
                                lastName: '',
                                phoneNumber: '',
                                address: '',
                                fitnessGoals: '',
                                experience: ''
                              });
                            }}
                            className="text-cyan-600 hover:text-cyan-700 text-sm"
                          >
                            Change Time
                          </button>
                        </div>
                        
                        <div className="space-y-4 text-gray-800">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">First Name:</label>
                              <input
                                type="text"
                                value={clientDetails.firstName}
                                onChange={(e) => handleClientDetailsChange('firstName', e.target.value)}
                                className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Last Name:</label>
                              <input
                                type="text"
                                value={clientDetails.lastName}
                                onChange={(e) => handleClientDetailsChange('lastName', e.target.value)}
                                className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Phone Number:</label>
                              <input
                                type="tel"
                                value={clientDetails.phoneNumber}
                                onChange={(e) => handleClientDetailsChange('phoneNumber', e.target.value)}
                                className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Address:</label>
                              <input
                                type="text"
                                value={clientDetails.address}
                                onChange={(e) => handleClientDetailsChange('address', e.target.value)}
                                className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Fitness Goals:</label>
                            <textarea
                              rows={3}
                              value={clientDetails.fitnessGoals}
                              onChange={(e) => handleClientDetailsChange('fitnessGoals', e.target.value)}
                              placeholder="e.g., Weight loss, muscle building, strength training..."
                              className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Fitness Experience:</label>
                            <select
                              value={clientDetails.experience}
                              onChange={(e) => handleClientDetailsChange('experience', e.target.value)}
                              className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                              <option value="">Select your experience level</option>
                              <option value="beginner">Beginner (0-6 months)</option>
                              <option value="intermediate">Intermediate (6 months - 2 years)</option>
                              <option value="advanced">Advanced (2+ years)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-800">Training Session Fee</span>
                            <span className="text-sm text-gray-800 font-medium">{trainer.hourlyRate || 'Rs. 2,500/hour'}</span>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-3">
                            <div className="text-sm text-gray-800 mb-2">
                              <div className="font-medium">{trainer.firstName} {trainer.lastName}</div>
                              <div className="text-xs">Personal Trainer</div>
                            </div>

                            <div className="space-y-1 text-xs text-gray-800">
                              <div className="flex justify-between">
                                <span>Client Name</span>
                                <span>{clientDetails.firstName} {clientDetails.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Date</span>
                                <span>{selectedDate?.toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Time</span>
                                <span>{selectedTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Specialization</span>
                                <span>{trainer.specialization}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleBooking}
                            disabled={bookingLoading}
                            className={`w-full py-2 px-4 rounded-md transition-colors font-medium ${
                              bookingLoading 
                                ? 'bg-gray-400 cursor-not-allowed text-white' 
                                : 'bg-cyan-500 text-white hover:bg-cyan-600'
                            }`}
                          >
                            {bookingLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Booking...
                              </div>
                            ) : (
                              'Confirm Training Session'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Rating Modal */}
        {showRatingModal && trainer && (
          <TrainerRatingModal
            trainer={trainer}
            onClose={() => {
              setShowRatingModal(false);
              router.push('/trainers');
            }}
          />
        )}
        
        <Footer />
      </div>
    </>
  );
}

// Trainer Rating Modal Component
interface TrainerRatingModalProps {
  trainer: Trainer;
  onClose: () => void;
}

function TrainerRatingModal({ trainer, onClose }: TrainerRatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Pre-fill client name from localStorage if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.firstName && currentUser.lastName) {
      setClientName(`${currentUser.firstName} ${currentUser.lastName}`);
    }
  }, []);

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
          <p className="text-gray-600">Thank you for your feedback. Your review will help other clients make informed decisions.</p>
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
            <h2 className="text-xl font-bold text-gray-900">Rate Your Training Session</h2>
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
                How was your training session? *
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
                Share your experience *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your training session... (minimum 10 characters)"
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
                Skip for Now
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

// Export the protected component
export default withAuth(TrainerBookingAppointment, {
  redirectTo: '/auth/login',
  showLoadingMessage: 'Please log in to book trainer appointments.'
});
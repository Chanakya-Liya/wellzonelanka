'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createAppointment, AppointmentData } from '../../../lib/services/appointmentService';
import { getDoctorReviews, Review as DoctorReview } from '../../../lib/services/reviewService';
import { withAuth } from '@/hooks/useAuth';
import Navbar from "@/components/Navbar";
import { Footer } from '@/app/Footer';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  experience: number;
  licenseNumber: string;
  isApproved: boolean;
  role: string;
  createdAt: string;
  name?: string;
  category?: string;
  rating?: number;
  image?: string;
  expertise?: string[];
  reviews?: Review[];
}

interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface PatientDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  description: string;
}

function BookingAppointment() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Patient Details & Payment
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    description: ''
  });
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Mock reviews data (replace with actual API call)
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const timeSlots = [
    "9:00AM", "10:00AM", "11:00AM",
    "12:00PM", "1:00PM", "2:00PM",
    "3:00PM", "4:00PM", "5:00PM",
    "6:00PM", "7:00PM", "8:00PM"
  ];

  useEffect(() => {
    const storedDoctor = localStorage.getItem('selectedDoctor');
    if (storedDoctor) {
      try {
        const doctorData = JSON.parse(storedDoctor);
        setDoctor(doctorData);
        
        // Fetch real reviews for this doctor
        const fetchReviews = async () => {
          try {
            setReviewsLoading(true);
            console.log('Fetching reviews for doctor ID:', doctorData.id);
            
            // Always add test review first for testing
            const testReview: DoctorReview = {
              id: 'test-review',
              doctorId: doctorData.id,
              patientName: 'thevinu',
              rating: 4,
              comment: 'he is a good doctor. he really helpfull',
              date: '2025-09-18',
              createdAt: '2025-09-18T05:39:25.665Z'
            };
            
            const doctorReviews = await getDoctorReviews(doctorData.id);
            console.log('Fetched reviews from Firebase:', doctorReviews);
            
            // Combine test review with fetched reviews for now
            const allReviews = [testReview, ...doctorReviews];
            setReviews(allReviews);
            
            // Update doctor's rating based on reviews
            if (allReviews.length > 0) {
              const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
              const averageRating = parseFloat((totalRating / allReviews.length).toFixed(1));
              doctorData.rating = averageRating;
              setDoctor({...doctorData});
              console.log('Updated doctor rating to:', averageRating);
            }
          } catch (error) {
            console.error('Error fetching reviews:', error);
            // Show test review even if there's an error
            const testReview: DoctorReview = {
              id: 'test-review-error',
              doctorId: doctorData.id,
              patientName: 'Test Patient',
              rating: 5,
              comment: 'Test review to verify component is working',
              date: '2025-09-18',
              createdAt: '2025-09-18T05:39:25.665Z'
            };
            setReviews([testReview]);
          } finally {
            setReviewsLoading(false);
          }
        };
        
        fetchReviews();
      } catch (error) {
        console.error('Error parsing doctor data:', error);
        router.push('/doctors/doctors-names');
      }
    } else {
      router.push('/doctors/doctors-names');
    }
    setLoading(false);
  }, [router]);

  const handleGoBack = () => {
    router.push('/doctors/doctors-names');
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
      // Don't change step, just set the date
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Don't change step, just set the time
  };

  const handlePatientDetailsChange = (field: keyof PatientDetails, value: string) => {
    setPatientDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !patientDetails.firstName || !patientDetails.lastName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Get current user data from localStorage for userId
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Prepare appointment data
      const appointmentData: AppointmentData = {
        date: selectedDate.getFullYear() + '-' + 
              String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
              String(selectedDate.getDate()).padStart(2, '0'), // Local timezone YYYY-MM-DD format
        serviceType: 'Consultation', // You can make this dynamic
        time: selectedTime,
        doctorId: doctor?.id || '',
        doctorName: doctor?.name || `${doctor?.firstName} ${doctor?.lastName}`,
        userEmail: currentUser.email || patientDetails.phoneNumber + '@temp.com', // Fallback if no email
        userId: currentUser.id || `user_${Date.now()}`, // Generate temp ID if not logged in
        userfirstname: patientDetails.firstName,
        userlastname: patientDetails.lastName,
        userphonenumber: patientDetails.phoneNumber,
        useradress: patientDetails.address,
        userdescription: patientDetails.description,
        status: 'Confirmed'
      };

      // Save to Firebase
      const appointmentId = await createAppointment(appointmentData);
      
      alert(`Appointment confirmed with ${doctor?.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime}. Appointment ID: ${appointmentId}`);
      router.push('/doctors/doctors-names');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
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

  if (!doctor) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Doctor information not found</p>
            <button 
              onClick={handleGoBack}
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
            >
              Go Back to Doctors
            </button>
          </div>
        </div>
      </>
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
            <h1 className="text-xl font-semibold text-black">Booking Appointment</h1>
          </div>
        </div>

        <div className="max-w-full mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
            
            {/* Left Column - Doctor Info and Patient Reviews */}
            <div className="lg:col-span-1 space-y-6">
              {/* Doctor Profile Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={doctor.image || '/images/doctor-placeholder.png'}
                      alt={doctor.name || 'Doctor'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{doctor.name}</h2>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="mr-2">👨‍⚕️</span>
                      <span>{doctor.specialization}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="mr-2">📅</span>
                      <span>{doctor.experience}+ Years Experience</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{doctor.rating?.toFixed(1) || '0.0'} Rating ({reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Reviews */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Patient Reviews {reviews.length > 0 && `(${reviews.length})`}
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
                    <p className="text-sm text-gray-400">Be the first to review this doctor!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {review.patientName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">{review.patientName}</h4>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Appointment Date</h3>
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
                            // Reset patient details when changing date
                            setPatientDetails({
                              firstName: '',
                              lastName: '',
                              phoneNumber: '',
                              address: '',
                              description: ''
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
                      
                      <div className="grid grid-cols-2 gap-3">
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

                {/* Step 3: Patient Details & Payment - Appears after time selection */}
                {selectedDate && selectedTime && (
                  <div className="animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Patient Details */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Patient Details.</h3>
                          <button
                            onClick={() => {
                              setSelectedTime('');
                              // Reset patient details when changing time
                              setPatientDetails({
                                firstName: '',
                                lastName: '',
                                phoneNumber: '',
                                address: '',
                                description: ''
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
                                value={patientDetails.firstName}
                                onChange={(e) => handlePatientDetailsChange('firstName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Last Name:</label>
                              <input
                                type="text"
                                value={patientDetails.lastName}
                                onChange={(e) => handlePatientDetailsChange('lastName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Phone Number:</label>
                              <input
                                type="tel"
                                value={patientDetails.phoneNumber}
                                onChange={(e) => handlePatientDetailsChange('phoneNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Address:</label>
                              <input
                                type="text"
                                value={patientDetails.address}
                                onChange={(e) => handlePatientDetailsChange('address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Description About Pain/Illness:</label>
                            <textarea
                              rows={4}
                              value={patientDetails.description}
                              onChange={(e) => handlePatientDetailsChange('description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information.</h3>
                        
                        <div className="bg-gray-50 text-gray-800 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Consultation Fee</span>
                            <span className="text-sm font-medium">Rs.2,500.00</span>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-3">
                            <div className="text-sm mb-2">
                              <div className="font-medium">Dr.{doctor.firstName} {doctor.lastName}</div>
                              <div className="text-xs">Consultant</div>
                            </div>

                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Patient Name</span>
                                <span>{patientDetails.firstName} {patientDetails.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Date</span>
                                <span>{selectedDate?.toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Time</span>
                                <span>{selectedTime}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleBooking}
                            className="w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors font-medium"
                          >
                            Confirm Booking
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
        <Footer />
      </div>
    </>
  );
}

// Export the protected component
export default withAuth(BookingAppointment, {
  redirectTo: '/auth/login',
  showLoadingMessage: 'Please log in to book doctor appointments.'
});
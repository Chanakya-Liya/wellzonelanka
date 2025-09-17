'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createAppointment, AppointmentData } from '../../../lib/services/appointmentService';

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

export default function BookingAppointment() {
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
  const [reviews, setReviews] = useState<Review[]>([]);

  const timeSlots = [
    "9:00AM", "10:00AM", "11:00AM",
    "12:00PM", "1:00PM", "2:00PM",
    "3:00PM", "4:00PM", "5:00PM",
    "6:00PM", "7:00PM", "8:00PM"
  ];

  // Generate mock reviews
  const generateMockReviews = (doctorName: string): Review[] => {
    const reviewTemplates = [
      { rating: 5, comment: "Professional staff and excellent facilities. The personalized care plan made all the difference in my rehabilitation." },
      { rating: 4, comment: "Great experience overall. Dr. was very knowledgeable and helpful throughout my treatment." },
      { rating: 5, comment: "Outstanding service! The doctor was very thorough and explained everything clearly." },
      { rating: 3, comment: "Good treatment but had to wait a bit longer than expected. Otherwise satisfied with the care." },
      { rating: 4, comment: "Very professional and caring approach. Would definitely recommend to others." },
      { rating: 5, comment: "Excellent care and attention to detail. The treatment plan was very effective." },
      { rating: 4, comment: "Good consultation and follow-up care. The staff was friendly and accommodating." },
      { rating: 2, comment: "Treatment was okay but communication could be improved. Expected more detailed explanations." },
      { rating: 5, comment: "Amazing results! The doctor's expertise really showed in the treatment approach." },
      { rating: 4, comment: "Very satisfied with the care received. Professional and efficient service." },
      { rating: 3, comment: "Average experience. Treatment was effective but facility could be improved." },
      { rating: 5, comment: "Exceptional care and personalized attention. Highly recommend this doctor." },
      { rating: 4, comment: "Good overall experience. The doctor was patient and answered all my questions." },
      { rating: 1, comment: "Disappointed with the service. Had to reschedule multiple times and communication was poor." },
      { rating: 5, comment: "Top-notch medical care. The doctor's experience and skill were evident throughout." },
      { rating: 4, comment: "Professional and thorough examination. Treatment plan was well explained." },
      { rating: 3, comment: "Decent service but could improve waiting times. Treatment was satisfactory." },
      { rating: 5, comment: "Excellent bedside manner and very knowledgeable. Made me feel comfortable throughout." }
    ];

    const names = ["John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "David Wilson", "Jessica Miller", "Robert Garcia", "Lisa Anderson", "William Taylor", "Amanda Thomas"];
    
    return reviewTemplates.slice(0, 15).map((template, index) => ({
      id: `review-${index}`,
      patientName: names[index % names.length],
      rating: template.rating,
      comment: template.comment,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  // Calculate average rating
  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  useEffect(() => {
    const storedDoctor = localStorage.getItem('selectedDoctor');
    if (storedDoctor) {
      try {
        const doctorData = JSON.parse(storedDoctor);
        const mockReviews = generateMockReviews(doctorData.name);
        doctorData.reviews = mockReviews;
        doctorData.rating = calculateAverageRating(mockReviews);
        setDoctor(doctorData);
        setReviews(mockReviews);
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
        date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
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
        <div className="bg-cyan-400 py-4">
          <div className="max-w-full mx-auto flex items-center px-4">
            <button 
              onClick={handleGoBack}
              className="text-white hover:text-gray-200 mr-4"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">Booking Appointment</h1>
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
                      <span>{doctor.rating?.toFixed(1) || '0.0'} Rating</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Reviews */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Reviews</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{review.patientName}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
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
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">First Name:</label>
                              <input
                                type="text"
                                value={patientDetails.firstName}
                                onChange={(e) => handlePatientDetailsChange('firstName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name:</label>
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
                              <input
                                type="tel"
                                value={patientDetails.phoneNumber}
                                onChange={(e) => handlePatientDetailsChange('phoneNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                              <input
                                type="text"
                                value={patientDetails.address}
                                onChange={(e) => handlePatientDetailsChange('address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description About Pain/Illness:</label>
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
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Consultation Fee</span>
                            <span className="text-sm font-medium">Rs.2,500.00</span>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-3">
                            <div className="text-sm text-gray-600 mb-2">
                              <div className="font-medium">Dr.{doctor.firstName} {doctor.lastName}</div>
                              <div className="text-xs">Consultant</div>
                            </div>
                            
                            <div className="space-y-1 text-xs text-gray-600">
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
      </div>
    </>
  );
}
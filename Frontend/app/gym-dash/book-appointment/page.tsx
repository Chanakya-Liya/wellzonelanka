"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { withAuth } from "@/hooks/useAuth";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  specialization: string;
  experience: number;
  hourlyRate?: string;
}

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const trainerId = searchParams.get('trainerId');
  const trainerName = searchParams.get('trainerName');
  
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [serviceType, setServiceType] = useState("Personal Training Session");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSriLankaTime, setCurrentSriLankaTime] = useState<string>('');
  
  // Calendar navigation state
  const now = new Date();
  const sriLankaNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Colombo"}));
  const [currentMonth, setCurrentMonth] = useState<number>(sriLankaNow.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(sriLankaNow.getFullYear());

  // Sri Lanka timezone constants
  const TIMEZONE = 'Asia/Colombo';
  
  // Available time slots
  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  // Get current date in Sri Lanka timezone
  const getSriLankaDate = () => {
    const now = new Date();
    const sriLankaDate = new Date(now.toLocaleString("en-US", {timeZone: TIMEZONE}));
    return sriLankaDate.toLocaleDateString("en-CA");
  };

  // Get current time in Sri Lanka timezone
  const getSriLankaTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", {
      timeZone: TIMEZONE,
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Get current day info in Sri Lanka timezone
  const getSriLankaDayInfo = () => {
    const now = new Date();
    const sriLankaDate = new Date(now.toLocaleString("en-US", {timeZone: TIMEZONE}));
    return {
      date: sriLankaDate.toLocaleDateString("en-CA"),
      dayOfWeek: sriLankaDate.getDay(),
      dayName: sriLankaDate.toLocaleDateString("en-US", {timeZone: TIMEZONE, weekday: 'long'})
    };
  };

  // Check if time slot is in the past
  const isTimeSlotPast = (timeSlot: string) => {
    if (selectedDate !== getSriLankaDate()) return false;
    const currentTime = getSriLankaTime();
    return timeSlot <= currentTime;
  };

  // Generate calendar dates for the selected month/year
  const generateCalendarDates = () => {
    const calendarData = [];
    
    // First day of the selected month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday)
    const startDay = firstDayOfMonth.getDay();
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(firstDayOfMonth);
      prevDate.setDate(prevDate.getDate() - (startDay - i));
      calendarData.push(prevDate);
    }
    
    // Add all days of the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      calendarData.push(date);
    }
    
    // Add days from next month to complete the grid (42 total cells)
    const remainingCells = 42 - calendarData.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      calendarData.push(nextDate);
    }
    
    return calendarData;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get month name
  const getMonthName = (monthIndex: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  };

  // Check if we can go to previous month (prevent going to past months)
  const canGoToPrevious = () => {
    const currentSriLankaDate = new Date(now.toLocaleString("en-US", {timeZone: TIMEZONE}));
    const currentSriLankaMonth = currentSriLankaDate.getMonth();
    const currentSriLankaYear = currentSriLankaDate.getFullYear();
    
    if (currentYear > currentSriLankaYear) return true;
    if (currentYear === currentSriLankaYear) return currentMonth >= currentSriLankaMonth;
    return false;
  };

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleString("en-US", {
        timeZone: TIMEZONE,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentSriLankaTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch trainer details and auto-fill user data
  useEffect(() => {
    const fetchTrainer = async () => {
      if (!trainerId) return;
      
      try {
        console.log('Fetching trainer details for ID:', trainerId);
        const response = await fetch(`/api/trainers/get-trainer/${trainerId}`);
        const data = await response.json();
        
        console.log('Trainer API response:', data);
        
        if (response.ok && data.success) {
          setTrainer(data.trainer);
          console.log('Trainer details loaded:', data.trainer);
        } else {
          console.log('Trainer not found, proceeding without trainer details');
          // Don't set any trainer data - just proceed without it
          setTrainer(null);
        }
      } catch (error) {
        console.error('Error fetching trainer (non-critical):', error);
        // Don't create fallback data - just proceed without trainer
        setTrainer(null);
      }
    };

    // Auto-fill user data if available
    const savedUserName = localStorage.getItem('userName');
    const savedUserEmail = localStorage.getItem('userEmail');
    
    if (savedUserName) setClientName(savedUserName);
    if (savedUserEmail) setClientEmail(savedUserEmail);

    fetchTrainer();
  }, [trainerId, trainerName]);

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      setError('Please fill in all required fields and select date/time');
      return;
    }

    if (!trainerId) {
      setError('No trainer selected');
      return;
    }

    if (isTimeSlotPast(selectedTime)) {
      setError('Selected time slot is in the past. Please choose a future time.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
      
      const response = await fetch(`/api/trainers/bookings/${trainerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          clientEmail,
          date: selectedDate,
          time: selectedTime,
          userId: userId,
          trainerName: trainerName ? decodeURIComponent(trainerName) : 'Selected Trainer',
          serviceType,
          notes: additionalNotes
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', clientName);
        localStorage.setItem('userEmail', clientEmail);
        
        setSuccess('Appointment booked successfully! The trainer will contact you soon.');
        setSelectedDate('');
        setSelectedTime('');
        setAdditionalNotes('');
      } else {
        setError(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href={`/gym-dash${trainerId ? `?trainerId=${trainerId}&trainerName=${encodeURIComponent(trainerName || '')}` : ''}`} className="mr-4">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Book Appointment</h1>
            {trainerName && (
              <p className="text-gray-600 mt-2">
                With: <strong>{decodeURIComponent(trainerName)}</strong>
              </p>
            )}
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Clock className="h-4 w-4 mr-2" />
              Current time in Sri Lanka: <strong className="ml-1">{currentSriLankaTime}</strong> (GMT+5:30)
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Today is {getSriLankaDayInfo().dayName} in Sri Lanka
            </div>
          </div>
        </div>

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-700 text-center">{success}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <CardTitle>Select Date</CardTitle>
                </div>
                {/* Month/Year Navigation */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousMonth}
                    disabled={!canGoToPrevious()}
                    className="p-1 h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium min-w-[120px] text-center">
                    {getMonthName(currentMonth)} {currentYear}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextMonth}
                    className="p-1 h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Choose your preferred appointment date (Sri Lanka timezone)
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar dates */}
                {generateCalendarDates().map((date, index) => {
                  const dateString = date.toLocaleDateString("en-CA");
                  const isSelected = selectedDate === dateString;
                  const sriLankaToday = getSriLankaDate();
                  const isPast = dateString < sriLankaToday;
                  const isToday = dateString === sriLankaToday;
                  const isCurrentMonth = date.getMonth() === currentMonth;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isPast && isCurrentMonth && setSelectedDate(dateString)}
                      disabled={isPast || !isCurrentMonth}
                      className={`p-2 text-sm border rounded-lg transition-colors ${
                        isPast || !isCurrentMonth
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isSelected
                            ? 'bg-cyan-600 text-white border-cyan-600'
                            : isToday
                              ? 'bg-cyan-50 text-cyan-700 border-cyan-200 font-semibold'
                              : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                      title={isToday ? `Today (${getSriLankaDayInfo().dayName})` : ''}
                    >
                      {date.getDate()}
                      {isToday && <div className="text-xs text-cyan-600">Today</div>}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Navigate months using arrow buttons - Past dates are disabled
              </p>
            </CardContent>
          </Card>

          {/* Time Selection and Form */}
          <div className="space-y-6">
            {/* Time Slots */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Available Times
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {selectedDate === getSriLankaDate() ? 'Today\'s' : 'Available'} time slots
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => {
                      const isPast = isTimeSlotPast(time);
                      const isSelected = selectedTime === time;
                      
                      return (
                        <button
                          key={time}
                          onClick={() => !isPast && setSelectedTime(time)}
                          disabled={isPast}
                          className={`p-3 text-sm border rounded-lg transition-colors ${
                            isPast
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : isSelected
                                ? 'bg-cyan-600 text-white border-cyan-600'
                                : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          {time}
                          {isPast && <div className="text-xs">Past</div>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    All times in Sri Lanka timezone (GMT+5:30)
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Booking Form */}
            {selectedDate && selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <select 
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="Personal Training Session">Personal Training Session</option>
                      <option value="Consultation Only">Consultation Only</option>
                      <option value="Fitness Assessment">Fitness Assessment</option>
                      <option value="Nutrition Consultation">Nutrition Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                      placeholder="Any specific requirements..."
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-800 mb-3">Booking Summary</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Trainer:</span>
                        <span className="font-medium">{trainerName ? decodeURIComponent(trainerName) : 'Selected trainer'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{selectedTime} (Sri Lanka)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{serviceType}</span>
                      </div>
                      {trainer?.hourlyRate && (
                        <div className="flex justify-between">
                          <span>Rate:</span>
                          <span className="font-medium text-cyan-600">{trainer.hourlyRate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleBooking}
                    disabled={loading || !clientName || !clientEmail}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-medium"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Booking...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}

// Export the protected component
export default withAuth(BookAppointmentPage, {
  redirectTo: '/auth/login',
  showLoadingMessage: 'Please log in to book trainer appointments.'
});

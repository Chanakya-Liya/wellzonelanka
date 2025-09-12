"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Footer } from "@/app/exercise/Footer";

import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  MessageSquare,
  Video,
  Award,
  Users,
  CheckCircle2,
  ThumbsUp,
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

interface Booking {
  id: string;
  trainerId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function TrainerProfile() {
  const params = useParams();
  const trainerId = params.id as string;
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Available time slots
  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

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

  // Generate calendar dates (next 30 days)
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Check if a date/time slot is booked
  const isSlotBooked = (date: string, time: string) => {
    return bookings.some(booking => 
      booking.date === date && 
      booking.time === time && 
      booking.status !== 'cancelled'
    );
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      alert('Please fill in all fields and select a date/time');
      return;
    }

    try {
      setBookingLoading(true);
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
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBookingSuccess('Booking created successfully! The trainer will contact you soon.');
        setSelectedDate(null);
        setSelectedTime(null);
        setClientName('');
        setClientEmail('');
        
        // Refresh bookings
        const bookingsResponse = await fetch(`/api/trainers/bookings/${trainerId}`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          if (bookingsData.success) {
            setBookings(bookingsData.bookings || []);
          }
        }
      } else {
        alert(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Fetch trainer data from database
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/trainers/get-trainer/${trainerId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Trainer API Response:', data);
        
        if (data.success && data.trainer) {
          // Enrich with display data
          const enrichedTrainer = {
            ...data.trainer,
            rating: data.trainer.rating || 4.8 + Math.random() * 0.2,
            reviewCount: data.trainer.reviewCount || Math.floor(Math.random() * 100) + 20,
            hourlyRate: data.trainer.hourlyRate || `Rs. ${(2000 + Math.random() * 3000).toFixed(0)}/hour`,
            location: data.trainer.location || 'Sri Lanka',
            availableHours: data.trainer.availableHours || 'Mon-Fri: 6AM-9PM'
          };
          
          setTrainer(enrichedTrainer);
        } else {
          throw new Error(data.message || 'Trainer not found');
        }
      } catch (error) {
        console.error('Error fetching trainer:', error);
        setError(error instanceof Error ? error.message : 'Failed to load trainer');
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/trainers/bookings/${trainerId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setBookings(data.bookings || []);
          }
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (trainerId) {
      fetchTrainer();
      fetchBookings();
    }
  }, [trainerId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading trainer profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !trainer) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <div className="wellzone-section text-center">
          <h1 className="text-3xl font-bold mb-4">Trainer Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error || "The requested trainer could not be found. Please try another trainer."}
          </p>
          <Button asChild>
            <Link href="/trainers">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trainers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      
      {/* Navbar */}
      <Navbar />
      
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-cyan-100 to-blue-100">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
      </div>

      {/* Profile Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <Card className="sticky top-24 bg-white shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center border-4 border-white mb-4 shadow-lg">
                      <div className="w-24 h-24 bg-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                      </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold mb-1">
                      {trainer.firstName} {trainer.lastName}
                    </h1>
                    
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{trainer.rating?.toFixed(1) || '4.9'}</span>
                      <span className="text-muted-foreground ml-1">
                        ({trainer.reviewCount || 50} reviews)
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {trainer.experience} years experience
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {getSpecialtyDisplay(trainer.specialization)}
                      </Badge>
                      {trainer.certifications && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          Certified
                        </Badge>
                      )}
                    </div>

                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">{trainer.hourlyRate || 'Contact for rates'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Availability:</span>
                        <span className="text-sm">{trainer.availableHours || 'Mon-Fri: 6AM-9PM'}</span>
                      </div>
                      {trainer.gymAffiliation && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Gym:</span>
                          <span className="text-sm">{trainer.gymAffiliation}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full pt-6 space-y-3">
                      <Button asChild variant="default" className="w-full bg-cyan-600 hover:bg-cyan-700">
                        <Link href="/gym-doc-home">
                          <Video className="mr-2 h-4 w-4" /> Book Consultation
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-2/3">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="mt-6">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        About {trainer.firstName} {trainer.lastName}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {trainer.bio || `${trainer.firstName} is a dedicated fitness professional with ${trainer.experience} years of experience specializing in ${getSpecialtyDisplay(trainer.specialization)}. Committed to helping clients achieve their fitness goals through personalized training programs.`}
                      </p>
                    </div>

                    {trainer.trainingPhilosophy && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Training Philosophy</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {trainer.trainingPhilosophy}
                        </p>
                      </div>
                    )}

                    {trainer.certifications && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {trainer.certifications}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Specialization Details</h3>
                      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50">
                        <CardContent className="pt-6">
                          <div className="flex items-center mb-3">
                            <Award className="h-5 w-5 text-cyan-600 mr-2" />
                            <h4 className="font-semibold text-cyan-800">
                              {getSpecialtyDisplay(trainer.specialization)}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-700">
                            Specialized training and expertise in {getSpecialtyDisplay(trainer.specialization).toLowerCase()} 
                            techniques and methodologies with {trainer.experience} years of hands-on experience.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-gray-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-gray-600">{trainer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Clock className="h-5 w-5 text-gray-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium">Experience</p>
                            <p className="text-sm text-gray-600">{trainer.experience} years</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

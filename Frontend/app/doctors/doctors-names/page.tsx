"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, Filter, ChevronDown } from "lucide-react"; // Imported for search and filter icons
import { Footer } from "../../Footer";
import { ChatDialog } from "@/components/chatbot/ChatDialog";
import { ChatButton } from "@/components/chatbot/ChatButton";
import { RatingModal, ReviewData } from "@/components/RatingModal";
import { addReview, getDoctorReviews, getDoctorReviewStats } from "@/lib/services/reviewService";

// Define Doctor Interface
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
  // Display fields
  name?: string;
  category?: string;
  rating?: number;
  image?: string;
  expertise?: string[];
  reviewCount?: number;
}

export default function DoctorsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Fetch doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        const data = await response.json();
        
        console.log('Doctors API response:', data);
        
        if (data.success && data.doctors) {
          console.log('Starting to fetch review stats for', data.doctors.length, 'doctors');
          const mappedDoctors = await Promise.all(data.doctors.map(async (doctor: any) => {
            const specializationMap: { [key: string]: string } = {
              'cardiology': 'cardiologist',
              'orthopedic': 'orthopedic',
              'general physiotherapy': 'general physiotherapy', // Renamed from 'general'
            };
            
            const category = specializationMap[doctor.specialization?.toLowerCase()] || 'all specialists'; // New default category
            
            // Fetch real review stats for each doctor
            try {
              console.log(`Fetching review stats for doctor ${doctor.id} (${doctor.firstName} ${doctor.lastName})`);
              const reviewStats = await getDoctorReviewStats(doctor.id);
              console.log(`Review stats for ${doctor.id}:`, reviewStats);
              
              // Temporary test data to verify display is working
              const isFirstDoctor = doctor.firstName === 'Saman'; // Test with first doctor
              const testRating = isFirstDoctor ? 4.5 : reviewStats.averageRating || 0;
              const testReviewCount = isFirstDoctor ? 12 : reviewStats.totalReviews;
              
              return {
                ...doctor,
                name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                category: category,
                rating: testRating,
                reviewCount: testReviewCount,
                image: doctor.gender === 'female' ? '/images/female-doctor.png' : '/images/doctor-male.png',
                expertise: getExpertiseBySpecialization(doctor.specialization)
              };
            } catch (error) {
              console.error(`Error fetching reviews for doctor ${doctor.id}:`, error);
              // Fallback to default values if review fetching fails
              return {
                ...doctor,
                name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                category: category,
                rating: 0,
                reviewCount: 0,
                image: doctor.gender === 'female' ? '/images/female-doctor.png' : '/images/doctor-male.png',
                expertise: getExpertiseBySpecialization(doctor.specialization)
              };
            }
          }));
          
          console.log('Final mapped doctors with review stats:', mappedDoctors);
          setDoctors(mappedDoctors);
        } else {
          setError('Failed to load doctors');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showFilterDropdown && !target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  // Helper function to get expertise based on specialization
  const getExpertiseBySpecialization = (specialization: string): string[] => {
    const expertiseMap: { [key: string]: string[] } = {
      'cardiology': ['Heart Disease', 'Hypertension', 'Cardiac Rehabilitation'],
      'orthopedic': ['Joint Pain', 'Sports Injuries', 'Fracture Care'],
      'general physiotherapy': ['Pain Management', 'Rehabilitation', 'Mobility'],
    };
    
    return expertiseMap[specialization?.toLowerCase()] || ['General Practice', 'Patient Care'];
  };

  // Handle book appointment navigation
  const handleBookAppointment = (doctor: Doctor) => {
    // You can pass doctor data through URL params or localStorage
    localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
    router.push('/doctors/doc-appointment');
  };

  // Handle review submission
  const handleSubmitReview = async (reviewData: ReviewData) => {
    try {
      await addReview(reviewData);
      setShowRatingModal(false);
      setSelectedDoctor(null);
      // Optionally refresh doctors list to show updated ratings
      window.location.reload();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  // Categories for filter buttons
  const categories = [
    { value: "all specialists", label: "All Specialists" },
    { value: "orthopedic", label: "Orthopedics" },
    { value: "general physiotherapy", label: "General Physiotherapy" },
    { value: "cardiologist", label: "Cardiologist" },
  ];

  // Filter and search logic
  const filteredAndSearchedDoctors = doctors
    .filter(doctor => {
      // Filter by category
      const categoryMatch = selectedCategory === "all specialists" || doctor.category === selectedCategory;
      // Filter by search query (name)
      const searchMatch = doctor.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });

  // Slider controls
  const recommendedDoctor = doctors[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % doctors.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        
        {/* Hero Slider Section */}
        {doctors.length > 0 && (
          <section className="relative w-full h-[50vh] sm:h-[60vh] bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center text-center md:text-left">
              <div className="w-full md:w-1/2 p-4" style={{ marginLeft: '5vw' }}>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Dr. {recommendedDoctor.firstName} {recommendedDoctor.lastName}
                </h2>
                <p className="text-gray-800 mt-2 text-sm sm:text-base">
                  Most recommended {recommendedDoctor.specialization} for August
                </p>
                <button 
                  onClick={() => handleBookAppointment(recommendedDoctor)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 text-sm"
                >
                  Book Appointment
                </button>
              </div>
              <div className="w-full md:w-1/2 flex justify-center p-4">
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-300 rounded-lg shadow-lg flex items-center justify-center text-gray-500">
                  {/* Image goes here */}
                </div>
              </div>
            </div>
            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300 z-20"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300 z-20"
            >
              <ArrowRight className="h-6 w-6 text-gray-600" />
            </button>
          </section>
        )}

        <div className="container bg-gray-50 mx-auto px-4 py-8 md:py-16">
          {/* Header & Search/Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Our Specialist Doctors
            </h2>
            
            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none text-gray-800 focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Right - Filter Dropdown */}
            <div className="relative filter-dropdown">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all duration-300"
              >
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Filter</span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Filter Dropdown Menu */}
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Filter by Specialization</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => {
                            setSelectedCategory(category.value);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                            selectedCategory === category.value
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          {category.label}
                          {selectedCategory === category.value && (
                            <span className="float-right">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSearchedDoctors.length > 0 ? (
              filteredAndSearchedDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex h-49 w-50 relative">
                    {/* Left side - Doctor Details (50% width) */}
                    <div className="flex-1 w-1/2 p-4 flex flex-col justify-between">
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {doctor.specialization}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2">{doctor.name}</h3>
                        
                        <div className="space-y-1 mb-2">
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="mr-1">👨‍⚕️</span>
                            <span>{doctor.experience}+ Years Experience</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <span className="mr-1">⭐</span>
                            <span>{doctor.rating?.toFixed(1) || '0.0'} ({doctor.reviewCount || 0} reviews)</span>
                          </div>
                          <div className="flex items-start text-xs text-gray-600">
                            <span className="mr-1">🩺</span>
                            <span className="text-xs leading-tight">
                              {doctor.expertise?.slice(0, 2).join(', ')}
                              {doctor.expertise && doctor.expertise.length > 2 && '...'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons at bottom - guaranteed space */}
                      <div className="flex gap-1 mt-2 flex-shrink-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookAppointment(doctor);
                          }}
                          className="px-2 py-1 text-white rounded-full hover:opacity-90 transition-all duration-300 text-xs font-medium flex-1" 
                          style={{ backgroundColor: '#4285F4' }}
                        >
                          Book Now
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoctor(doctor);
                          }}
                          className="px-2 py-1 text-white rounded-full hover:opacity-90 transition-all duration-300 text-sm font-medium flex-1" 
                          style={{ backgroundColor: '#4285F4' }}
                        >
                          View
                        </button>
                      </div>
                    </div>

                    {/* Vertical divider line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>

                    {/* Right side - Doctor Image (50% width, fully filled) */}
                    <div className="flex-1 w-1/2 relative">
                      <Image
                        src={doctor.image || '/images/doctor-placeholder.png'}
                        alt={`Dr. ${doctor.lastName}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-r-xl"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">
                  No doctors found matching your criteria.
                </div>
              </div>
            )}
          </div>
          
          {selectedDoctor && (
            <DoctorModal
              doctor={selectedDoctor}
              onClose={() => setSelectedDoctor(null)}
              onBookAppointment={handleBookAppointment}
              onRateDoctor={() => setShowRatingModal(true)}
            />
          )}
          
          {showRatingModal && selectedDoctor && (
            <RatingModal
              isOpen={showRatingModal}
              onClose={() => setShowRatingModal(false)}
              doctorId={selectedDoctor.id}
              doctorName={selectedDoctor.name || `${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
              onSubmitReview={handleSubmitReview}
            />
          )}
        </div>
      </div>
      
      <Footer />
      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}

// Doctor Modal Component
interface DoctorModalProps {
  doctor: Doctor;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
  onRateDoctor: () => void;
}

function DoctorModal({ doctor, onClose, onBookAppointment, onRateDoctor }: DoctorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex">
          {/* Left Panel - Profile Card */}
          <div className="w-80 bg-gray-50 p-6 rounded-l-xl">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Profile Picture */}
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={doctor.image || '/images/doctor-placeholder.png'}
                  alt={`Dr. ${doctor.lastName}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              
              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {doctor.name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center justify-center mb-2">
                <span className="text-yellow-400 text-lg mr-2">⭐</span>
                <span className="font-semibold text-gray-700">{doctor.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-500 text-sm ml-1">({doctor.reviewCount || 0} reviews)</span>
              </div>
              
              {/* Experience */}
              <p className="text-gray-600 font-medium">
                {doctor.experience} Years Experience
              </p>
            </div>

            {/* Specialties Tags */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {doctor.expertise?.map((area, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Price:</span>
                <span className="font-bold text-gray-900">Rs. 2,500/hour</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Availability:</span>
                <span className="text-gray-900">Mon-Fri, 8AM-6PM</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Languages:</span>
                <span className="text-gray-900">English, Sinhala, Tamil</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => onBookAppointment(doctor)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium flex items-center justify-center"
              >
                📅 Book Appointment
              </button>
              
              <button 
                onClick={onRateDoctor}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium flex items-center justify-center"
              >
                ⭐ Rate Doctor
              </button>
            </div>
          </div>

          {/* Right Panel - About Section */}
          <div className="flex-1 p-8">
            {/* About Doctor Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Doctor</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Certified personal trainer with {doctor.experience} years of experience specializing in {doctor.specialization.toLowerCase()}, 
                rehabilitation, nutrition and calisthenics. I help clients achieve their fitness goals through 
                personalized training programs and nutritional guidance. My approach focuses on building 
                sustainable habits for long-term success.
              </p>
            </div>

            {/* Certifications Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Certifications</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Certified Personal Trainer (CPT)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Rehabilitation Specialist</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Sports Nutrition Certification</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">First Aid and CPR Certified</span>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Education</h3>
              <div className="flex items-center">
                <span className="text-blue-500 mr-3">🎓</span>
                <span className="text-gray-700">Bachelor's Degree in Sports Science, University of Colombo.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
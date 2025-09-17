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

  // Fetch doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        const data = await response.json();
        
        if (data.success && data.doctors) {
          const mappedDoctors = data.doctors.map((doctor: any) => {
            const specializationMap: { [key: string]: string } = {
              'cardiology': 'cardiologist',
              'orthopedic': 'orthopedic',
              'general physiotherapy': 'general physiotherapy', // Renamed from 'general'
            };
            
            const category = specializationMap[doctor.specialization?.toLowerCase()] || 'all specialists'; // New default category
            
            return {
              ...doctor,
              name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
              category: category,
              rating: 4.5 + Math.random() * 0.4,
              image: doctor.gender === 'female' ? '/images/female-doctor.png' : '/images/doctor-male.png',
              expertise: getExpertiseBySpecialization(doctor.specialization)
            };
          });
          
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
              <div className="w-full md:w-1/2 p-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Dr. {recommendedDoctor.firstName} {recommendedDoctor.lastName}
                </h2>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
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
                  className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <span>{doctor.rating?.toFixed(1)} Rating</span>
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
                          Book appointment
                        </button>
                        <button className="px-2 py-1 text-white rounded-full hover:opacity-90 transition-all duration-300 text-xs font-medium flex-1" style={{ backgroundColor: '#4285F4' }}>
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
}

function DoctorModal({ doctor, onClose, onBookAppointment }: DoctorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Doctor Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-200">
              <Image
                src={doctor.image || '/images/doctor-placeholder.png'}
                alt={`Dr. ${doctor.lastName}`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {doctor.name}
            </h3>
            <p className="text-blue-600 font-medium mb-1">
              {doctor.specialization}
            </p>
            <p className="text-gray-500">
              {doctor.experience} years of experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
              <p className="text-gray-600 mb-1">📧 {doctor.email}</p>
              <p className="text-gray-600">🆔 License: {doctor.licenseNumber}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Rating & Status</h4>
              <div className="flex items-center mb-1">
                <div className="flex text-yellow-400 mr-2">
                  {'★'.repeat(Math.floor(doctor.rating || 4.5))}
                  {'☆'.repeat(5 - Math.floor(doctor.rating || 4.5))}
                </div>
                <span className="text-gray-600">{doctor.rating?.toFixed(1)}</span>
              </div>
              <p className="text-gray-600">
                Status: {doctor.isApproved ? '✅ Approved' : '⏳ Pending'}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Areas of Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.expertise?.map((area, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onBookAppointment(doctor)}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Book Appointment
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
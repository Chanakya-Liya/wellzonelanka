"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Appointment from "../../doc-appointment/page";
import Sidebar from "../../Sidebar";
import { Footer } from "../../Footer";

import { ChatDialog } from "@/components/chatbot/ChatDialog";
import { ChatButton } from "@/components/chatbot/ChatButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ fix scrollbar jump via CSS, not JS
if (typeof window !== "undefined") {
  document.documentElement.style.scrollbarGutter = "stable";
}

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log('Fetching doctors from API...');
        const response = await fetch('/api/doctors');
        const data = await response.json();
        
        console.log('Doctors API response:', data);
        
        if (data.success && data.doctors) {
          // Map database fields to display format
          const mappedDoctors = data.doctors.map((doctor: any) => {
            // Map specialization to category
            const specializationMap: { [key: string]: string } = {
              'cardiology': 'cardiologist',
              'orthopedic': 'orthopedic',
              'neurology': 'neurological',
              'general': 'general',
              'pediatrics': 'pediatric'
            };
            
            const category = specializationMap[doctor.specialization?.toLowerCase()] || 'general';
            
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
          console.log(`Loaded ${mappedDoctors.length} doctors`);
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

  // Helper function to get expertise based on specialization
  const getExpertiseBySpecialization = (specialization: string): string[] => {
    const expertiseMap: { [key: string]: string[] } = {
      'cardiology': ['Heart Disease', 'Hypertension', 'Cardiac Rehabilitation'],
      'orthopedic': ['Joint Pain', 'Sports Injuries', 'Fracture Care'],
      'neurology': ['Stroke Care', 'Nerve Disorders', 'Brain Injuries'],
      'general': ['General Medicine', 'Preventive Care', 'Health Checkups'],
      'pediatrics': ['Child Health', 'Vaccinations', 'Growth Disorders']
    };
    
    return expertiseMap[specialization?.toLowerCase()] || ['General Medicine', 'Patient Care'];
  };

  // Filter doctors based on category
  const filteredDoctors = selectedCategory === "all" 
    ? doctors 
    : doctors.filter(doctor => doctor.category === selectedCategory);

  // Categories for filter dropdown
  const categories = [
    { value: "all", label: "All Doctors" },
    { value: "cardiologist", label: "Cardiologist" },
    { value: "orthopedic", label: "Orthopedic" },
    { value: "neurological", label: "Neurological" },
    { value: "general", label: "General Medicine" },
    { value: "pediatric", label: "Pediatric" },
  ];

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
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-grow bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Meet Our Expert Doctors
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our team of qualified healthcare professionals who are dedicated to providing you with the best medical care.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/*
            { key: "all", label: "All Doctors" },
            { key: "cardiologist", label: "Cardiologist" },
            { key: "orthopedic", label: "Orthopedic" },
            { key: "neurological", label: "Neurological" },
            { key: "general", label: "General Medicine" },
            { key: "pediatric", label: "Pediatric" },
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.key
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
              }`}
            >
              {category.label}
            </button>
          ))}
          */}
          <div className="flex items-center gap-3 bg-gray-50 border p-4 rounded-lg shadow-sm">
            {/* <Filter className="h-5 w-5 text-cyan-600 shrink-0" /> */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full border-none shadow-none focus:ring-0 bg-white">
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="z-50 bg-white shadow-lg rounded-lg"
              >
                {categories.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="text-black" // ✅ make text black
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {doctor.name}
                    </h3>
                    <p className="text-cyan-600 font-medium mb-1">
                      {doctor.specialization}
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      {doctor.experience} years experience
                    </p>
                  </div>

                  <div className="text-center mb-4">
                    <div className="flex justify-center items-center mb-2">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(doctor.rating || 4.5))}
                        {'☆'.repeat(5 - Math.floor(doctor.rating || 4.5))}
                      </div>
                      <span className="ml-2 text-gray-600 text-sm">
                        {doctor.rating?.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      License: {doctor.licenseNumber}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span>{doctor.expertise?.join(", ")}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                No doctors found in this category
              </div>
            </div>
          )}
        </div>

        {/* Doctor Details Modal */}
        {selectedDoctor && (
          <DoctorModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Components */}
      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}

// Doctor Modal Component
interface DoctorModalProps {
  doctor: Doctor;
  onClose: () => void;
}

function DoctorModal({ doctor, onClose }: DoctorModalProps) {
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
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {doctor.firstName?.[0]}{doctor.lastName?.[0]}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {doctor.name}
            </h3>
            <p className="text-cyan-600 font-medium mb-1">
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
                  className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
              Book Appointment
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

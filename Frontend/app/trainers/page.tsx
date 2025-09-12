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

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

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
          // Add mock data for display purposes since API might not have all fields
          const enrichedTrainers = data.trainers.map((trainer: Trainer) => ({
            ...trainer,
            rating: trainer.rating || 4.8 + Math.random() * 0.2,
            reviewCount: trainer.reviewCount || Math.floor(Math.random() * 100) + 20,
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {filteredTrainers.map((trainer) => (
                <Card key={trainer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-md">
                  {/* Trainer Background */}
                  <div className="relative h-56 bg-gradient-to-br from-[#06CBF2] via-[#06CBF2] to-[#0BB5D8]">
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-white text-xs font-medium">
                        {trainer.rating?.toFixed(1) || '4.9'}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Trainer Name */}
                    <h3 className="text-lg font-bold mb-1 text-gray-900">
                      {trainer.firstName} {trainer.lastName}
                    </h3>
                    
                    {/* Experience */}
                    <p className="text-sm text-gray-600 mb-3">
                      {trainer.experience} years experience
                    </p>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {getSpecialtyDisplay(trainer.specialization)}
                      </Badge>
                      {trainer.certifications && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
                          <Award className="h-3 w-3 mr-1" />
                          Certified
                        </Badge>
                      )}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Available</span>
                      </div>
                      <span className="text-sm text-gray-900">
                        {trainer.hourlyRate || 'Contact for rates'}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Link href={`/trainers/${trainer.id}`} className="flex items-center justify-center w-full text-black hover:text-gray-700 transition-colors">
                      <span className="text-sm font-medium">View Profile</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
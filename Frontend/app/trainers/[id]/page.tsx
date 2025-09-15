"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Users, 
  Calendar,
  ArrowLeft,
  Phone,
  Mail,
  DollarSign
} from "lucide-react";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  experience: number;
  role: string;
  licenseNumber?: string;
  isApproved?: boolean;
  createdAt?: string;
  // Display fields
  name?: string;
  hourlyRate?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  availableHours?: string;
  bio?: string;
  certifications?: string[];
  phone?: string;
}

export default function TrainerProfile() {
  const params = useParams();
  const trainerId = params.id as string;
  
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      console.log('Starting trainer fetch for ID:', trainerId);
      
      if (!trainerId) {
        console.log('No trainer ID provided');
        setError('No trainer ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching trainer from API...');
        const response = await fetch(`/api/trainers/get-trainer/${trainerId}`);
        console.log('API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Trainer API Response:', data);
          
          if (data.success && data.trainer) {
            console.log('Setting trainer data:', data.trainer);
            
            // Map specialization to readable format
            const specializationMap: { [key: string]: string } = {
              'weight-training': 'Weight Training & Strength Coach',
              'cardio': 'Cardio & Endurance Training',
              'yoga': 'Yoga & Flexibility Training',
              'nutrition': 'Nutrition & Diet Planning',
              'crossfit': 'CrossFit Training',
              'boxing': 'Boxing & Combat Training'
            };
            
            const readableSpecialization = specializationMap[data.trainer.specialization] || data.trainer.specialization;
            
            setTrainer({
              ...data.trainer,
              name: `${data.trainer.firstName} ${data.trainer.lastName}`,
              specialization: readableSpecialization,
              rating: data.trainer.rating || (4.5 + Math.random() * 0.4),
              reviewCount: data.trainer.reviewCount || Math.floor(Math.random() * 80) + 20,
              hourlyRate: data.trainer.hourlyRate || `Rs. ${(2500 + Math.random() * 2000).toFixed(0)}/hour`,
              location: data.trainer.location || 'Colombo, Sri Lanka',
              availableHours: data.trainer.availableHours || 'Mon-Fri: 6AM-9PM',
              bio: data.trainer.bio || `Professional ${readableSpecialization.toLowerCase()} with ${data.trainer.experience} years of experience. Licensed trainer (#${data.trainer.licenseNumber}) committed to helping clients achieve their fitness goals.`,
              certifications: data.trainer.certifications || ['Licensed Personal Trainer', 'Certified Fitness Professional'],
              phone: data.trainer.phone || '+94 77 123 4567'
            });
          } else {
            console.log('API returned unsuccessful response:', data);
            setError(data.message || 'Trainer details not available');
          }
        } else if (response.status === 404) {
          console.log('Trainer not found (404)');
          setError('Trainer not found');
        } else {
          console.log('API returned error status:', response.status);
          setError('Failed to load trainer details');
        }
      } catch (error) {
        console.error('Error fetching trainer:', error);
        setError('Unable to load trainer information. The trainer may not be available.');
      } finally {
        console.log('Fetch completed, setting loading to false');
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trainer profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link href="/gym-dash">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Trainer</h2>
                <p className="text-red-700">{error}</p>
                <div className="mt-4">
                  <Link href="/gym-dash">
                    <Button className="bg-cyan-600 hover:bg-cyan-700">
                      Browse Other Trainers
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link href="/gym-dash">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Trainer Not Found</h2>
                <p className="text-gray-600 mb-4">The trainer you're looking for is not available.</p>
                <Link href="/gym-dash">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    Browse Other Trainers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const trainerName = trainer.name || `${trainer.firstName} ${trainer.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/gym-dash">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>

        {/* Trainer Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {trainerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              </div>
              
              {/* Basic Info */}
              <div className="flex-grow">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {trainerName}
                </CardTitle>
                <p className="text-lg text-cyan-600 font-medium mt-1">
                  {trainer.specialization}
                </p>
                
                {/* Rating and Experience */}
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{trainer.rating?.toFixed(1)}</span>
                    <span className="ml-1 text-gray-500">({trainer.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award className="h-4 w-4 mr-1" />
                    <span>{trainer.experience} years experience</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-col space-y-2">
                <Link href={`/gym-dash/book-appointment?trainerId=${trainer.id}&trainerName=${encodeURIComponent(trainerName)}`}>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                </Link>
                <Link href={`/gym-dash/my-appointments?trainerId=${trainer.id}&trainerName=${encodeURIComponent(trainerName)}`}>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    My Appointments
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Contact & Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Contact & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-3" />
                <span>{trainer.email}</span>
              </div>
              {trainer.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-3" />
                  <span>{trainer.phone}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-3" />
                <span>{trainer.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-3" />
                <span>{trainer.availableHours}</span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing & Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hourly Rate:</span>
                <span className="font-bold text-lg text-cyan-600">{trainer.hourlyRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{trainer.experience} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{trainer.rating?.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Reviews:</span>
                <span className="font-medium">{trainer.reviewCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bio Section */}
        {trainer.bio && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About {trainerName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Certifications */}
        {trainer.certifications && trainer.certifications.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trainer.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="bg-cyan-100 text-cyan-800">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/gym-dash/book-appointment?trainerId=${trainer.id}&trainerName=${encodeURIComponent(trainerName)}`}>
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto">
              <Calendar className="h-5 w-5 mr-2" />
              Book a Session
            </Button>
          </Link>
          <Link href={`/gym-dash/my-appointments?trainerId=${trainer.id}&trainerName=${encodeURIComponent(trainerName)}`}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Users className="h-5 w-5 mr-2" />
              View My Appointments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

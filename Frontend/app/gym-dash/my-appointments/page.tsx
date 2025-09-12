"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, Mail } from "lucide-react";
import { Suspense } from "react";

interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  trainerId: string;
  trainerName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

function MyAppointmentsContent() {
  const searchParams = useSearchParams();
  const trainerId = searchParams.get('trainerId');
  const trainerName = searchParams.get('trainerName');
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user-specific appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Get user ID from localStorage
        let userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        
        // If no userId but have email, use email as fallback
        if (!userId && userEmail) {
          userId = userEmail;
          console.log('Using email as userId:', userId);
        }
        
        if (!userId) {
          setError('Please book an appointment first to see your appointments');
          setLoading(false);
          return;
        }

        console.log('Fetching appointments for userId:', userId);

        let response;
        
        if (trainerId) {
          // Fetch appointments for specific trainer
          response = await fetch(`/api/appointments/user/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trainerId }),
          });
        } else {
          // Fetch all user appointments
          response = await fetch(`/api/appointments/user/${userId}`);
        }

        const data = await response.json();
        console.log('Appointments API response:', data);

        if (response.ok) {
          if (data.success) {
            setAppointments(data.appointments || []);
            if (data.appointments?.length === 0) {
              setError('No appointments found. Book your first appointment to see it here.');
            }
          } else {
            setError(data.message || 'Failed to fetch appointments');
          }
        } else {
          setError('Failed to fetch appointments. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to fetch appointments. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [trainerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href={`/gym-dash${trainerId ? `?trainerId=${trainerId}&trainerName=${encodeURIComponent(trainerName || '')}` : ''}`} className="mr-4">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            {trainerName && (
              <div className="flex items-center mt-2 text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>With: <strong>{decodeURIComponent(trainerName)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
              <p className="text-gray-600 mb-6">
                {trainerId 
                  ? "You don't have any appointments with this trainer yet."
                  : "You don't have any appointments scheduled."}
              </p>
              {trainerId && (
                <Link href={`/gym-dash/book-appointment?trainerId=${trainerId}&trainerName=${encodeURIComponent(trainerName || '')}`}>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    Book Your First Appointment
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Appointment #{appointment.id.slice(-6)}
                    </CardTitle>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="font-medium">Date:</span>
                        <span className="ml-2">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-medium">Time:</span>
                        <span className="ml-2">{appointment.time}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span className="font-medium">Trainer:</span>
                        <span className="ml-2">{appointment.trainerName}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="font-medium">Your Email:</span>
                        <span className="ml-2">{appointment.userEmail}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Booked on: {new Date(appointment.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {trainerId && (
          <div className="mt-8 flex justify-center">
            <Link href={`/gym-dash/book-appointment?trainerId=${trainerId}&trainerName=${encodeURIComponent(trainerName || '')}`}>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                Book Another Appointment
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyAppointmentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <MyAppointmentsContent />
    </Suspense>
  );
}

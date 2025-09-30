"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, ClipboardList, User, Clock } from "lucide-react";
import { Suspense } from "react";
import { withAuth } from "@/hooks/useAuth";


function GymDashContent() {
  const searchParams = useSearchParams();
  const trainerId = searchParams.get('trainerId');
  const trainerName = searchParams.get('trainerName');
  const [todaysAppointments, setTodaysAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    
    // Fetch today's appointments for the trainer or user
    const fetchTodaysAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const isTrainer = user.role === 'trainer';
        const endpoint = isTrainer 
          ? `/api/trainer-appointments/trainer/${user.id}?date=${today}`
          : `/api/trainer-appointments/user/${user.id}?date=${today}`;
        
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTodaysAppointments(data.appointments || []);
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchTodaysAppointments();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center mb-8">
          <Link href="/trainers" className="mr-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              Back to Trainers
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trainer Dashboard</h1>
            {trainerName && (
              <div className="flex items-center mt-2 text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>Selected Trainer: <strong>{decodeURIComponent(trainerName)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Today's Training Sessions */}
        {todaysAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              Today's Training Sessions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-md">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    Session with {appointment.userName || 'Client'}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {appointment.serviceType}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


          <ServiceCard
            title="Book Appointment"
            description="Schedule your training sessions"
            details="Book appointments with your selected trainer based on your schedule and fitness goals."
            icon={<Calendar className="h-10 w-10 text-sky-500" />}
            buttonText="Book Now"
            href={`/gym-dash/book-appointment${trainerId ? `?trainerId=${trainerId}&trainerName=${encodeURIComponent(trainerName || '')}` : ''}`}
          />

          <ServiceCard
            title="My Appointments"
            description="Manage your scheduled sessions"
            details="View, reschedule, or cancel your upcoming appointments with trainers."
            icon={<ClipboardList className="h-10 w-10 text-sky-500" />}
            buttonText="View Appointments"
            href={`/gym-dash/my-appointments${trainerId ? `?trainerId=${trainerId}&trainerName=${encodeURIComponent(trainerName || '')}` : ''}`}
          />
        </div>
      </div>
    </div>
  );
}

function GymTrainerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GymDashContent />
    </Suspense>
  );
}

export default withAuth(GymTrainerPage, {
  showLoadingMessage: "Please log in to access your gym trainer dashboard and book training sessions."
});

interface ServiceCardProps {
  title: string;
  description: string;
  details: string;
  icon: React.ReactNode;
  buttonText: string;
  href: string;
}

function ServiceCard({
  title,
  description,
  details,
  icon,
  buttonText,
  href,
}: ServiceCardProps) {
  return (
    <div className="flex flex-col h-full bg-white text-black rounded-lg shadow-lg overflow-hidden">
      <div className="text-center p-6">
        <div className="mx-auto bg-sky-100 p-4 rounded-full mb-4">{icon}</div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex-grow p-6">
        <p className="text-center text-gray-700">{details}</p>
      </div>
      <div className="p-6 pt-0">
        <Link
          href={href}
          className="block w-full px-4 py-2 bg-sky-500 text-white rounded-2xl hover:bg-sky-700 transition-colors text-center"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

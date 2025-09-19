"use client";

import type React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Video, Calendar, ClipboardList, User } from "lucide-react";
import { Suspense } from "react";
import { withAuth } from "@/hooks/useAuth";

function GymDashContent() {
  const searchParams = useSearchParams();
  const trainerId = searchParams.get('trainerId');
  const trainerName = searchParams.get('trainerName');

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-10">
      <div className="flex flex-col min-h-screen bg-white text-black">
        <div className="container mx-auto p-4 max-w-6xl bg-white text-black">
          <div className="flex items-center mb-8">
            <Link href="/trainers" className="mr-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Back to Trainers
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Gym Trainer Services</h1>
              {trainerName && (
                <div className="flex items-center mt-2 text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>Selected Trainer: <strong>{decodeURIComponent(trainerName)}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title="Video Conferencing"
              description="Connect with your trainer virtually"
              details="Join live video sessions with your fitness trainer for real-time guidance and feedback."
              icon={<Video className="h-10 w-10 text-sky-500" />}
              buttonText="Join Session"
              href={`/gym-dash/video-session${trainerId ? `?trainerId=${trainerId}&trainerName=${encodeURIComponent(trainerName || '')}` : ''}`}
            />

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

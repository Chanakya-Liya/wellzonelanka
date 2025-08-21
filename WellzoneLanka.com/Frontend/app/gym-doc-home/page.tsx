"use client";
import type React from "react";
import Link from "next/link";
import { Stethoscope, Dumbbell } from "lucide-react";
import { BackgroundVideo } from "@/app/gym-doc-home/background-video";
import Navbar from "@/components/Navbar";
import Sidebar from "@/app/Sidebar";

export default function Home() {
  return (
    <>
      <BackgroundVideo videoSrc="/images/fitness2.mp4" />
      <div className="-mt-12 z-10">
        <Navbar />
      </div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center mb-12 text-white">
            <h1 className="text-4xl font-bold mb-2">Wellzone Lanka</h1>
            <p className="text-xl">AI-Powered Health and Fitness Tracker</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full text-black">
            <UserPhaseCard
              title="Doctor"
              description="Connect with healthcare professionals"
              details="Get medical consultations, prescriptions, and health advice from certified doctors."
              icon={<Stethoscope className="h-12 w-12 text-primary" />}
              href="/doctor-dash"
            />
            <UserPhaseCard
              title="Gym Trainer"
              description="Fitness coaching and training"
              details="Book sessions with fitness experts, get personalized workout plans, and track your progress."
              icon={<Dumbbell className="h-12 w-12 text-primary" />}
              href="/gym-dash"
            />
          </div>
        </div>
      </div>
    </>
  );
}

interface UserPhaseCardProps {
  title: string;
  description: string;
  details: string;
  icon: React.ReactNode;
  href: string;
}

function UserPhaseCard({
  title,
  description,
  details,
  icon,
  href,
}: UserPhaseCardProps) {
  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <div className="text-center p-6">
        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
          {icon}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex-grow p-6">
        <p className="text-center text-gray-700">{details}</p>
      </div>
      <div className="p-6 pt-0">
        <Link
          href={href}
          className="block w-full bg-sky-500 hover:bg-sky-700 text-white text-center py-2 px-4 rounded-3xl transition duration-300"
        >
          Select
        </Link>
      </div>
    </div>
  );
}
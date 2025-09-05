"use client";

import { Activity, Star, Clock, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useState } from "react";
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
  id: number;
  name: string;
  specialization: string;
  category: string;
  experience: string;
  rating: number;
  image: string;
  expertise: string[];
}

export default function DoctorsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const allDoctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Smith",
      specialization: "General Physician",
      category: "general",
      experience: "15+ years",
      rating: 4.9,
      image: "/images/female-doctor.png",
      expertise: ["Sports Injuries", "Rehabilitation", "Joint Pain"],
    },
    {
      id: 2,
      name: "Dr. Patel",
      specialization: "Cardiologist",
      category: "cardiologist",
      experience: "12+ years",
      rating: 4.8,
      image: "/images/doctor-male.png",
      expertise: ["Back Pain", "Neck Pain", "Post-Surgery Rehabilitation"],
    },
    {
      id: 3,
      name: "Dr. Johnson",
      specialization: "Orthopedic Physiotherapist",
      category: "orthopedic",
      experience: "10+ years",
      rating: 4.7,
      image: "/images/doctor-male.png",
      expertise: ["Stroke Rehabilitation", "Balance Disorders", "Nerve Pain"],
    },
    {
      id: 4,
      name: "Dr. Williams",
      specialization: "Neurological Physiotherapist",
      category: "neurological",
      experience: "10+ years",
      rating: 4.7,
      image: "/images/doctor-male.png",
      expertise: ["Stroke Rehabilitation", "Balance Disorders", "Nerve Pain"],
    },
  ];

  const categories = [
    { value: "all", label: "All Specialists" },
    { value: "general", label: "General Physiotherapy" },
    { value: "orthopedic", label: "Orthopedic" },
    { value: "neurological", label: "Neurological" },
    { value: "cardiologist", label: "Cardiologist" },
  ];

  const filteredDoctors =
    selectedCategory === "all"
      ? allDoctors
      : allDoctors.filter((doctor) => doctor.category === selectedCategory);

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col text-black">
      <Navbar />
      <Sidebar />

      <motion.div
        className="max-w-7xl mx-auto pt-20 flex-grow px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Our Specialist Doctors</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with Sri Lanka&apos;s leading physiotherapists and wellness
            experts for personalized care and treatment.
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          className="mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 bg-gray-50 border p-4 rounded-lg shadow-sm">
            <Filter className="h-5 w-5 text-cyan-600 shrink-0" />
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
        </motion.div>

        {/* Doctors Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
        >
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[450px]"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                <p className="text-gray-500 mb-4">{doctor.specialization}</p>

                <div className="space-y-3 text-sm flex-grow">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-cyan-600" />
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>{doctor.rating} rating</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-cyan-600" />
                    <span>{doctor.expertise.join(", ")}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredDoctors.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-500">
              No doctors found in this category. Please try another one.
            </p>
          </motion.div>
        )}
      </motion.div>

      {selectedDoctor && (
        <Appointment
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

      {/* Chatbot Icon */}
      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} />


      {/* Footer */}
      <Footer />
    </div>
  );
}

"use client";

import { Activity, Star, Clock, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/doc-navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import Appointment from "../doc-appointment/page";
import Sidebar from "../Sidebar";
import { Footer } from "../Footer";

import { ChatDialog } from "@/components/chatbot/ChatDialog";
import { ChatButton } from "@/components/chatbot/ChatButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      category: "Orthopedic Physiotherapist",
      experience: "10+ years",
      rating: 4.7,
      image: "/images/doctor-male.png",
      expertise: ["Stroke Rehabilitation", "Balance Disorders", "Nerve Pain"],
    },
    {
      id: 4,
      name: "Dr. Williams",
      specialization: "Neurological Physiotherapist",
      category: "Neurological Physiotherapist",
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
    {
      value: "chiropractic",
      label: "Chiropractic Physiotherapist",
    },
  ];

  const filteredDoctors =
    selectedCategory === "all"
      ? allDoctors
      : allDoctors.filter((doctor) => doctor.category === selectedCategory);

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col bg-white text-black">
      <Navbar />
      <Sidebar />
      <motion.div
        className="max-w-7xl mx-auto pt-12 flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4 pt-12">
            Our Specialist Doctors
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with Sri Lanka&apos;s leading physiotherapists and wellness
            experts for personalized care and treatment
          </p>
        </motion.div>

        <motion.div
          className="mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 bg-card p-4 rounded-lg shadow-md">
            <Filter className="h-5 w-5 text-primary" />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full border-none shadow-none focus:ring-0 bg-white">
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
        >
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              className="bg-card rounded-lg shadow-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative h-64">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  height={100}
                  width={100}
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                <p className="text-muted-foreground mb-4">
                  {doctor.specialization}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>{doctor.rating} rating</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Activity className="h-4 w-4 mr-2 text-primary" />
                    <span>{doctor.expertise.join(", ")}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">

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
            <p className="text-lg text-muted-foreground">
              No doctors found in this category. Please try another category.
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
      <motion.h2
              className="text-3xl font-bold mb-4 text-black text-center mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Start Your Recovery Journey?
            </motion.h2>
            <motion.p
              className="mb-8 text-black text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              Book an appointment with our expert physiotherapists and take the
              first step towards better health.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/doctor-dash">
              <button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-lg rounded-lg font-medium transition-colors flex mx-auto mb-5">
                Book an appointment
              </button> 
              </Link>
            </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

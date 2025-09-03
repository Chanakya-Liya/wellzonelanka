"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/gym-navbar";
import { Footer } from "@/app/exercise/Footer";

import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  MessageSquare,
  Video,
  Award,
  Users,
  CheckCircle2,
  ThumbsUp,
} from "lucide-react";

// Mock data for trainers
const trainersData = {
  "trainer-1": {
    id: "trainer-1",
    name: "Sanuka Siriwardhana",
    image: "https://well-zone-assets.netlify.app/Sanuka%20Siriwardhana.png",
    coverImage: "https://well-zone-assets.netlify.app/Background1.jpeg",
    specialties: [
      "Weight Training",
      "Rehabilitation",
      "Nutrition",
      "Calisthenics",
    ],
    experience: "4 years",
    rating: 4.9,
    reviews: 254,
    price: "Rs. 1,500/hour",
    availability: "Mon-Fri, 6AM-8PM",
    bio: "Certified personal trainer with 4 years of experience specializing in weight training, rehabilitation, nutrition and Calisthenics. I help clients achieve their fitness goals through personalized training programs and nutritional guidance. My approach focuses on building sustainable habits for long-term success.",
    certifications: [
      "Certified Personal Trainer (CPT)",
      "Rehabilitation Specialist",
      "Sports Nutrition Certification",
      "First Aid and CPR Certified",
    ],
    education: [
      "Bachelor's Degree in Sports Science, University of Colombo",
      "Diploma in Nutrition, Institute of Health Sciences",
    ],
    languages: ["English", "Sinhala", "Tamil"],
  },
  "trainer-2": {
    id: "trainer-2",
    name: "Kaveen Adesh",
    image: "https://well-zone-assets.netlify.app/Kaveen%20Adesh.png",
    coverImage: "https://well-zone-assets.netlify.app/Background2.jpeg",
    specialties: ["Yoga", "Pilates", "Flexibility"],
    experience: "5 years",
    rating: 4.5,
    reviews: 220,
    price: "Rs. 1,700/hour",
    availability: "Tue-Sat, 7AM-7PM",
    bio: "Certified yoga instructor and Pilates trainer with 5 years of experience. I specialize in helping clients improve flexibility, reduce stress, and build core strength. My holistic approach focuses on mind-body connection and proper alignment for safe and effective practice.",
    certifications: [
      "Registered Yoga Teacher (RYT-200)",
      "Certified Pilates Instructor",
      "Meditation Coach",
      "First Aid Certified",
    ],
    education: [
      "Diploma in Yoga Therapy, Yoga Alliance",
      "Certificate in Pilates Instruction, Body Control Pilates",
    ],
    languages: ["English", "Sinhala"],
  },
  "trainer-3": {
    id: "trainer-3",
    name: "Sylvester silva",
    image: "https://well-zone-assets.netlify.app/Sylvester%20Silva.png",
    coverImage: "https://well-zone-assets.netlify.app/Background3.jpeg",
    specialties: ["HIIT", "Functional Training", "Weight Loss"],
    experience: "15 years",
    rating: 5,
    reviews: 450,
    price: "Rs. 2,500/hour",
    availability: "Mon-Sat, 5AM-9PM",
    bio: "Highly experienced fitness trainer with 15 years of expertise in HIIT, Functional Training, and Weight Loss. He specializes in helping clients achieve peak physical performance through high-intensity training programs and tailored workout plans. His methods emphasize strength, endurance, and sustainable fitness routines that align with each individual's goals.",
    certifications: [
      "Certified Functional Trainer (CFT)",
      "High-Intensity Interval Training (HIIT) Specialist",
      "Weight Loss & Performance Coaching Certification",
      "CPR & First Aid Certified",
    ],
    education: [
      "Bachelor's Degree in Sports Science, University of Colombo",
      "Diploma in Fitness & Nutrition, Institute of Health Sciences",
    ],
    languages: ["English", "Sinhala", "Tamil"],
  },
  "trainer-4": {
    id: "trainer-4",
    name: "Malinda Amarasinghe",
    image: "https://well-zone-assets.netlify.app/Malinda%20Amarasinghe.png",
    coverImage: "https://well-zone-assets.netlify.app/Background4.jpeg",
    specialties: ["Senior Fitness", "Rehabilitation", "Low Impact"],
    experience: "12 years",
    rating: 4.9,
    reviews: 350,
    price: "Rs. 2,500/hour",
    availability: "Mon-Fri, 8AM-6PM",
    bio: "Dedicated fitness professional with 12 years of experience specializing in Senior Fitness, Rehabilitation, and Low-Impact Training. His approach focuses on improving mobility, strength, and overall well-being through personalized training programs tailored to each individual's needs. Malinda is passionate about helping clients—especially seniors and those recovering from injuries—build sustainable fitness habits for long-term health and vitality.",
    certifications: [
      "Certified Senior Fitness Trainer (CSFT)",
      "Rehabilitation & Mobility Specialist",
      "Low-Impact Training Certification",
      "First Aid and CPR Certified",
    ],
    education: [
      "Bachelor's Degree in Sports Science, University of Colombo",
      "Diploma in Rehabilitation & Exercise Therapy, University of Colombo",
    ],
    languages: ["English", "Sinhala", "Tamil"],
  },
};

export default function TrainerProfile() {
  const params = useParams();
  const trainerId = params.id as string;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Get the trainer data
  const trainer = trainersData[trainerId as keyof typeof trainersData];

  // If the trainer doesn't exist, show a message
  if (!trainer) {
    return (
      <div className="wellzone-section text-center">
        <h1 className="text-3xl font-bold mb-4">Trainer Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The requested trainer could not be found. Please try another trainer.
        </p>
        <Button asChild>
          <Link href="/trainers">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trainers
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      
      {/* Navbar */}
      <Navbar />
      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={trainer.coverImage}
          alt={`${trainer.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
      </div>

      {/* Profile Section */}
      <section className="wellzone-section -mt-20 relative z-10" id="comments">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/3">
              <Card className="wellzone-card sticky top-24">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background mb-4">
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">{trainer.name}</h1>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{trainer.rating}</span>
                      <span className="text-muted-foreground ml-1">
                        ({trainer.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {trainer.experience} experience
                    </p>

                    <div className="flex flex-wrap justify-center gap-1 mb-6">
                      {trainer.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">{trainer.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Availability:
                        </span>
                        <span>{trainer.availability}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Languages:
                        </span>
                        <span>{trainer.languages.join(", ")}</span>
                      </div>
                    </div>

                    <div className="w-full pt-6 space-y-3">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full bg-sky-500"
                      >
                        <Link href="/gym-doc-home">
                          <Video className="mr-2 h-4 w-4" /> Video Consultation
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3">
              <Button asChild variant="outline" className="mb-6 bg-sky-500 ">
                <Link href="/trainers">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trainers
                </Link>
              </Button>

              <Tabs defaultValue="about">
                <TabsContent value="about" className="mt-6">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        About {trainer.name}
                      </h2>
                      <p className="text-muted-foreground">{trainer.bio}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Certifications
                      </h3>
                      <ul className="space-y-2">
                        {trainer.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start">
                            <Award className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Education</h3>
                      <ul className="space-y-2">
                        {trainer.education.map((edu, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            <span>{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Specialties
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trainer.specialties.map((specialty, index) => (
                          <Card key={index} className="bg-muted/50">
                            <CardContent className="pt-6">
                              <h4 className="font-semibold mb-2">
                                {specialty}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Specialized training and expertise in{" "}
                                {specialty.toLowerCase()} techniques and
                                methodologies.
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

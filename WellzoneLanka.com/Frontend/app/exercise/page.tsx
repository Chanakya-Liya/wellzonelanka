"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/gym-navbar";
import { Footer } from "@/app/exercise/Footer";
import { Dumbbell, Clock, ArrowRight, Search, Filter, Camera } from "lucide-react";
import { useState } from "react";
import Sidebar from "../Sidebar";

export default function Exercises() {
  const exercises = [
    {
      id: "ex-1",
      name: "Push-ups",
      category: "Strength",
      target: ["Chest", "Shoulders", "Triceps"],
      difficulty: "Beginner",
      duration: "5-10 minutes",
      image: "https://well-zone-assets.netlify.app/Push-up.png",
      description:
        "A classic bodyweight exercise that targets the chest, shoulders, and triceps.",
      url: "https://www.youtube.com/embed/IODxDxX7oi4?si=TgTQg0AdXA_Uy-Wd",
      trackUrl: "http://127.0.0.1:5000"
    },
    {
      id: "ex-2",
      name: "Squats",
      category: "Strength",
      target: ["Quadriceps", "Hamstrings", "Glutes"],
      difficulty: "Beginner",
      duration: "5-10 minutes",
      image: "https://well-zone-assets.netlify.app/Squats.png",
      description:
        "A fundamental lower body exercise that strengthens the legs and glutes.",
      url: "https://youtu.be/gsNoPYwWXeM",
      trackUrl: "http://127.0.0.1:5001"
    },
    {
      id: "ex-3",
      name: "Plank",
      category: "Core",
      target: ["Abs", "Lower Back", "Shoulders"],
      difficulty: "Beginner",
      duration: "1-3 minutes",
      image: "https://well-zone-assets.netlify.app/Plank.png",
      description:
        "An isometric core exercise that improves stability and posture.",
      url: "https://youtu.be/kL_NJAkCQBg?si=6uSJy3ZbuVxeYZLe",
      trackUrl: "http://127.0.0.1:5002"
    },
    {
      id: "ex-4",
      name: "Lunges",
      category: "Strength",
      target: ["Quadriceps", "Hamstrings", "Glutes"],
      difficulty: "Beginner",
      duration: "5-10 minutes",
      image: "https://well-zone-assets.netlify.app/Lunges.png",
      description:
        "A unilateral exercise that targets the legs and improves balance.",
      url: "https://youtube.com/shorts/nvRONn4vV6E?si=YaPYIcIXVG3eV-ld",
      trackUrl: "http://127.0.0.1:5003"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Sidebar */}
      <Sidebar />
      {/* Navbar */}
      <Navbar />
      
      <br /><br />
      
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search exercises..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-white">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="outline" size="sm">Strength</Button>
              <Button variant="outline" size="sm">Cardio</Button>
              <Button variant="outline" size="sm">Core</Button>
              <Button variant="outline" size="sm">Flexibility</Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="wellzone-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="wellzone-card overflow-hidden">
              <div className="relative h-48" style={{ height: "300px" }}>
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {exercise.target.map((target, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{target}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={exercise.url} target="_blank">
                    View Exercise <ArrowRight className="ml-0 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  className="shadow-sm hover:shadow transition-shadow text-white bg-sky-500 "
                  onClick={() => window.open(exercise.trackUrl, "_blank")}
                >
                  <Camera className="mr-2 h-4 " /> Track Form
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
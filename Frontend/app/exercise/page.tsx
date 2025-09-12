"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Footer } from "@/app/exercise/Footer";
import { Dumbbell, Clock, ArrowRight, Search, Filter, Camera, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";

interface Exercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  description: string;
  difficulty: string;
  duration: string;
  image: string;
  target: string[];
  url: string;
  trackUrl: string;
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch exercises from database
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log('Fetching exercises from API...');
        const response = await fetch('/api/exercises');
        const data = await response.json();
        
        console.log('Exercises API response:', data);
        
        if (data.success && data.exercises) {
          setExercises(data.exercises);
          console.log(`Loaded ${data.exercises.length} exercises`);
        } else {
          setError('Failed to load exercises');
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setError('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises based on search and category
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.exerciseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || 
                           exercise.target.some(target => 
                             target.toLowerCase().includes(selectedCategory.toLowerCase())
                           );
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Sidebar />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-cyan-600" />
            <p className="text-gray-600">Loading exercises...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Sidebar />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-white">
              <Button 
                variant={selectedCategory === "All" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("All")}
              >
                All
              </Button>
              <Button 
                variant={selectedCategory === "Chest" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("Chest")}
              >
                Chest
              </Button>
              <Button 
                variant={selectedCategory === "Shoulders" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("Shoulders")}
              >
                Shoulders
              </Button>
              <Button 
                variant={selectedCategory === "Triceps" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("Triceps")}
              >
                Arms
              </Button>
              <Button 
                variant={selectedCategory === "Abs" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("Abs")}
              >
                Core
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="wellzone-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="wellzone-card overflow-hidden">
                <div className="relative h-48" style={{ height: "300px" }}>
                  <img
                    src={exercise.image}
                    alt={exercise.exerciseName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">{exercise.exerciseName}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {exercise.target.map((target, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{target}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{exercise.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{exercise.duration}</span>
                    </div>
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No exercises found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your search or filters" 
                  : "No exercises available at the moment"}
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
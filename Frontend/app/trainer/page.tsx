import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Users, Camera, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "./Footer";
import Sidebar from "../Sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Sidebar />
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative h-[400px] sm:h-[600px] md:h-[700px] bg-cover bg-center" 
        style={{ backgroundImage: "url('https://img.freepik.com/free-photo/care-male-healthy-weights-athletic_1139-695.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Exercise at Home,{" "}
                <span className="text-white">Connect Online</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base md:text-lg text-white">
                WellZone Lanka brings professional gym training to your home. Connect with trainers, get personalized exercise recommendations, and track your progress with our advanced AI-powered platform.
              </p>
              <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105 text-white"
                >
                  <Link href="/exercise">Explore Exercises</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105 text-white"
                >
                  <Link href="/trainers">Find a Trainer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24" id="services">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">Our Services</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              WellZone Lanka offers a comprehensive suite of fitness services designed to help you achieve your health goals from the comfort of your home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-blue-100 mb-4">
                    <Dumbbell className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Exercise Library</h3>
                  <p className="text-gray-500">
                    Access a comprehensive library of exercises with detailed instructions and video demonstrations.
                  </p>
                  <Button asChild variant="link" className="mt-4">
                    <Link href="/exercise" className="flex items-center">
                      Explore Exercises <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-green-100 mb-4">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Online Trainers</h3>
                  <p className="text-gray-500">
                    Connect with certified fitness trainers for personalized guidance and real-time feedback.
                  </p>
                  <Button asChild variant="link" className="mt-4">
                    <Link href="/trainers" className="flex items-center">
                      Meet Trainers <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-orange-100 mb-4">
                    <Camera className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Exercise Form Tracking</h3>
                  <p className="text-gray-500">
                    Use your camera to track and analyze your exercise form, ensuring safe and effective workouts.
                  </p>
                  <Button asChild variant="link" className="mt-4">
                    <Link href="/exercise-tracking" className="flex items-center">
                      Position Detection <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16 md:py-24" id="comments">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Hear from people who have transformed their fitness journey with WellZone Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Mendis",
                role: "Office Worker",
                image: "/assets/Priya%20Mendis.jpeg",
                quote: "The pain management exercises helped me overcome my chronic back pain. I can now work comfortably for longer hours.",
              },
              {
                name: "Ashan Fernando",
                role: "Software Engineer",
                image: "/assets/Ashan%20Fernando.jpeg",
                quote: "Connecting with a trainer online has been a game-changer. I get professional guidance without leaving my home.",
              },
              {
                name: "Dilini Perera",
                role: "Teacher",
                image: "/assets/Dilini%20Perera.jpeg",
                quote: "The form tracking feature ensures I'm doing exercises correctly. It's like having a personal trainer watching over me.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white p-6 shadow-md rounded-lg">
                <CardContent className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="italic text-gray-500 mb-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-100" id="start">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to Transform Your Fitness Journey?</h2>
            <p className="mt-4 text-gray-500">
              Join WellZone Lanka today and experience the future of home fitness with professional guidance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="hover:shadow-lg text-black rounded-3xl font-bold transition-transform duration-500 hover:scale-105">
                <Link href="/gym-doc-home">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-3xl font-bold transition-transform duration-500 hover:scale-105"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
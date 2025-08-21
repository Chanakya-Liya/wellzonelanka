import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Users, Camera, ArrowRight } from "lucide-react";
import Navbar from "@/components/gym-navbar";
import { Footer } from "./Footer";
import Sidebar from "../Sidebar";

export default function Home() {
  return (
    // Add Navbar component

    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Hero Section */}
      <Sidebar />
      <Navbar />
      
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20">
        <div className="max-w-7xl mx-auto" id="header">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-black text-4xl md:text-5xl font-bold tracking-tight">
                Exercise at Home,{" "}
                <span className="text-black">Connect Online</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                WellZone Lanka brings professional gym training to your home.
                Connect with trainers, get personalized exercise
                recommendations, and track your progress with our advanced
                AI-powered platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="exercise-button">
                  <Link href="/exercise">Explore Exercises</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="trainer-button text-white bg-sky-500 rounded-3xl"
                >
                  <Link href="/trainers">Find a Trainer</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://well-zone-assets.netlify.app/Situp%20Girl.jpeg"
                alt="Person exercising at home"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="wellzone-section" id="comments">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Our Services</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            WellZone Lanka offers a comprehensive suite of fitness services
            designed to help you achieve your health goals from the comfort of
            your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="wellzone-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-secondary/10 mb-4">
                  <Dumbbell
                    className="h-8 w-8 text-secondary"
                    style={{ color: "rgb(0,150,250)" }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Exercise Library</h3>
                <p className="text-muted-foreground">
                  Access a comprehensive library of exercises with detailed
                  instructions and video demonstrations.
                </p>
                <Button asChild variant="link" className="mt-4">
                  <Link href="/exercise" className="flex items-center">
                    Explore Exercises <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="wellzone-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-accent/10 mb-4">
                  <Users
                    className="h-8 w-8 text-accent"
                    style={{ color: "green" }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Online Trainers</h3>
                <p className="text-muted-foreground">
                  Connect with certified fitness trainers for personalized
                  guidance and real-time feedback.
                </p>
                <Button asChild variant="link" className="mt-4">
                  <Link href="/trainers" className="flex items-center">
                    Meet Trainers <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="wellzone-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-secondary/10 mb-4">
                  <Camera
                    className="h-8 w-8 text-secondary"
                    style={{ color: "orangered" }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Exercise Form Tracking
                </h3>
                <p className="text-muted-foreground">
                  Use your camera to track and analyze your exercise form,
                  ensuring safe and effective workouts.
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
      </section>

      {/* Testimonials Section */}
      <section className="wellzone-section bg-muted" id="comments">
        <div className="text-center mb-16">
          <br />
          <br />
          <h2 className="text-3xl font-bold">What Our Users Say</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Hear from people who have transformed their fitness journey with
            WellZone Lanka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Priya Mendis",
              role: "Office Worker",
              image: "https://well-zone-assets.netlify.app/Priya%20Mendis.jpeg",
              quote:
                "The pain management exercises helped me overcome my chronic back pain. I can now work comfortably for longer hours.",
            },
            {
              name: "Ashan Fernando",
              role: "Software Engineer",
              image:
                "https://well-zone-assets.netlify.app/Ashan%20Fernando.jpeg",
              quote:
                "Connecting with a trainer online has been a game-changer. I get professional guidance without leaving my home.",
            },
            {
              name: "Dilini Perera",
              role: "Teacher",
              image:
                "https://well-zone-assets.netlify.app/Dilini%20Perera.jpeg",
              quote:
                "The form tracking feature ensures I'm doing exercises correctly. It's like having a personal trainer watching over me.",
            },
          ].map((testimonial, index) => (
            <Card key={index} className="wellzone-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="italic text-muted-foreground mb-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="wellzone-section bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"
        id="start"
      >
        <div className="max-w-3xl mx-auto text-center">
          <br />
          <br />
          <h2 className="text-3xl font-bold">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join WellZone Lanka today and experience the future of home fitness
            with professional guidance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 font-bold">
            <Button asChild size="lg" className="exercise-button">
              <Link href="/gym-doc-home">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="trainer-button mb-8 text-white bg-sky-500 rounded-3xl font-bold"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

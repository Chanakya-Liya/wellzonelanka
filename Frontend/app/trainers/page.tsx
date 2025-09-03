import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/gym-navbar";
import { Footer } from "@/app/exercise/Footer";

import {
  Star,
  Calendar,
  MessageSquare,
  ArrowRight,
  Users,
  Search,
} from "lucide-react";

export default function Trainers() {
  // Mock data for trainers
  const trainers = [
    {
      id: "trainer-1",
      name: "Sanuka Siriwardhana",
      image: "https://well-zone-assets.netlify.app/Sanuka%20Siriwardhana.png",
      specialties: [
        "Weight Training",
        "Rehabilitation",
        "Nutrition",
        "Calisthenics",
      ],
      experience: "8 years",
      rating: 4.9,
      reviews: 254,
      price: "Rs. 1,500/hour",
      availability: "Mon-Fri, 6AM-8PM",
    },
    {
      id: "trainer-2",
      name: "Kaveen Adesh",
      image: "https://well-zone-assets.netlify.app/Kaveen%20Adesh.png",
      specialties: ["Yoga", "Pilates", "Flexibility"],
      experience: "5 years",
      rating: 4.5,
      reviews: 220,
      price: "Rs. 1,700/hour",
      availability: "Tue-Sat, 7AM-7PM",
    },
    {
      id: "trainer-3",
      name: "Sylvester Silva",
      image: "https://well-zone-assets.netlify.app/Sylvester%20Silva.png",
      specialties: ["HIIT", "Functional Training", "Weight Loss"],
      experience: "15 years",
      rating: 5,
      reviews: 450,
      price: "Rs. 2,500/hour",
      availability: "Mon-Sat, 5AM-9PM",
    },
    {
      id: "trainer-4",
      name: "Malinda Amarasinghe",
      image: "https://well-zone-assets.netlify.app/Malinda%20Amarasinghe.png",
      specialties: ["Senior Fitness", "Rehabilitation", "Low Impact Training"],
      experience: "12 years",
      rating: 4.9,
      reviews: 350,
      price: "Rs. 2,500/hour",
      availability: "Mon-Fri, 8AM-6PM",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <br />
      <br />
      
      <section
        className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"
        id="header"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black">
              Connect with <span className="text-primary">Expert Trainers</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Find the perfect fitness professional to guide your home workout
              journey. Our certified trainers provide personalized coaching and
              support to help you achieve your fitness goals.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search trainers by name or specialty..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-white ">
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="outline" size="sm">
                Weight Training
              </Button>
              <Button variant="outline" size="sm">
                Yoga
              </Button>
              <Button variant="outline" size="sm">
                Rehabilitation
              </Button>
              <Button variant="outline" size="sm">
                Nutrition
              </Button>
              <Button variant="outline" size="sm">
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="wellzone-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="wellzone-card overflow-hidden">
              <div className="relative h-48" style={{ height: "300px" }}>
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{trainer.rating}</span>
                </div>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-1">{trainer.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {trainer.experience} experience
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {trainer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {trainer.availability}
                    </span>
                  </div>
                  <span className="font-medium">{trainer.price}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button asChild className="w-full">
                  <Link href={`/trainers/${trainer.id}`}>
                    View Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Become a Trainer Section */}
      <section className="wellzone-section bg-muted" id="comments">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">
                Join Our Trainer Network
              </h2>
              <p className="text-muted-foreground mb-6">
                Are you a certified fitness professional? Join our platform to
                connect with clients, expand your reach, and grow your online
                training business.
              </p>
              <Button asChild size="lg" className="trainer-button">
                <Link href="/gym-doc-home">
                  <Users className="mr-2 h-5 w-5" /> Apply as a Trainer
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://well-zone-assets.netlify.app/Situp%20Girl.jpeg"
                alt="Become a trainer"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
         
        </div>

      </section>
      <Footer />
    </div>
  );
}

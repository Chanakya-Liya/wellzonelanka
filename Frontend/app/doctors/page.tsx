"use client";
import Sidebar from "@/app/Sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Heart,
  Calendar,
  Video,
  Star,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/doc-navbar";
import { Marquee } from "@/components/magicui/marquee";
import { useState } from "react";
import { ChatDialog } from "@/components/chatbot/ChatDialog";
import { ChatButton } from "@/components/chatbot/ChatButton";
import { Footer } from "../Footer";

const reviews = [
  { img: "/images/marquee_1.jpeg" },
  { img: "/images/marquee_2.jpeg" },
  { img: "/images/marquee_3.jpeg" },
  { img: "/images/marquee_4.jpeg" },
  { img: "/images/marquee_5.jpeg" },
];

const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

interface ReviewCardProps {
  img: string;
}

const ReviewCard = ({ img }: ReviewCardProps) => (
  <figure className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl hover:bg-transparent">
    <div className="flex flex-col items-center text-center">
      <Image src={img} alt="Review" width={250} height={220} />
    </div>
  </figure>
);

export function MarqueeDemoVertical() {
  return (
    <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden mt-11">
      <Marquee pauseOnHover vertical className="[--duration:22s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
    </div>
  );
}

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  
  return (
    
    <div className="min-h-screen bg-white">
    <Navbar />
    <Sidebar />

      <section className="container mx-auto px-4 py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight pt-11">
              Your Journey to{" "}
              <span className="block text-sky-500">Physical Wellness</span>{" "}
              Starts Here
            </h1>
            <p className="text-gray-600 text-lg max-w-xl">
              Connect with Sri Lanka&apos;s leading physiotherapists and wellness
              experts for personalized care.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/doc-services">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-lg "
                >
                  <Play className="mr-2 h-5 w-5 bg-sky-500" />
                  How it works
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <MarqueeDemoVertical />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-white to-sky-50">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
          >
            Why Choose Wellzone Lanka
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Heart className="h-10 w-10" />}
              title="Specialized Care"
              description="Access to qualified physiotherapists and wellness experts"
              delay={0.2}
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10" />}
              title="Easy Scheduling"
              description="Book appointments with your preferred healthcare provider"
              delay={0.3}
            />
            <FeatureCard
              icon={<Video className="h-10 w-10" />}
              title="Virtual Sessions"
              description="Connect with doctors through video consultations"
              delay={0.4}
            />
          </div>
        </div>
        <div className="absolute -z-10 top-1/2 left-1/4 transform -translate-y-1/2">
          <div className="h-96 w-96 bg-sky-100/80 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-white">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-12 text-gray-900"
          >
            What Our Patients Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
              name="Esala Gamage"
              text="The physiotherapy services at Wellzone Lanka have been transformative. I've seen significant improvement in my recovery."
              delay={0.1}
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
              name="Anjana Rusiru"
              text="Professional staff and excellent facilities. The personalized care plan made all the difference in my rehabilitation."
              delay={0.2}
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
              name="Nohim Dhanawardhana"
              text="The virtual sessions are so convenient, and the quality of care is just as good as in-person visits."
              delay={0.3}
            />
          </div>
        </div>
        <div className="absolute -z-10 top-1/2 right-1/4 transform -translate-y-1/2">
          <div className="h-96 w-96 bg-blue-50 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-white to-sky-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who have transformed their
            lives with our expert care and support.
          </p>
          <Link href="/doc-services">
            <Button
              size="lg"
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-lg"
            >
              Book Your First Session <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
        <div className="absolute -z-10 inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-[400px] w-[400px] bg-sky-100/80 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10">
        <div className="h-2 w-2 bg-sky-400 rounded-full animate-ping"></div>
      </div>
      <div className="absolute bottom-20 right-10">
        <div className="h-3 w-3 bg-blue-300 rounded-full animate-ping"></div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-xl border border-sky-100 bg-white hover:shadow-xl hover:border-sky-200 transition-all duration-300"
    >
      <div className="text-sky-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

interface TestimonialCardProps {
  image: string;
  name: string;
  text: string;
  delay: number;
}

function TestimonialCard({ image, name, text, delay }: TestimonialCardProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="p-6 rounded-xl border border-sky-100 bg-white hover:shadow-xl hover:border-sky-200 transition-all duration-300"
      >
        <div className="flex items-center mb-4">
          <Image
            src={image}
            alt={name}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="ml-4">
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <div className="flex text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>
        </div>
        <p className="text-gray-600 italic">&quot;{text}&quot;</p>
      </motion.div>
    </div>
  );
}

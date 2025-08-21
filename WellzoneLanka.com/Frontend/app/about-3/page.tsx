"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Heart,
  Brain,
  Activity,
  Users,
  Star,
  Zap,
  Award,
} from "lucide-react";
import Navbar from "@/components/gym-navbar";
import { Footer } from "@/app/Footer";
import Sidebar from "@/app/Sidebar";
import Image from "next/image";

export default function About() {
  const [isVisible, setIsVisible] = useState({
    intro: false,
    mission: false,
    features: false,
    journey: false,
    cta: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Animation variants
  const fadeIn = (isVisible: boolean) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      <Sidebar />

      {/* Enhanced Hero Section with Optimized Background */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        {/* Use Next.js Image component for better optimization */}
        <div className="absolute inset-0">
          <Image
            src="/assets/ABT.png"
            alt="Wellness background image"
            fill
            priority
            className="object-cover"
            style={{
              objectPosition: "center",
              transform: "translateY(15%)",
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 opacity-60"></div>

        <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-32">
          <div className="max-w-4xl relative">
            {/* Semi-transparent backdrop */}
            <div className="relative z-10 backdrop-blur-sm bg-black/10 p-8 rounded-xl border border-white/20 animate-fadeIn">
              <h1 className="mt-12 text-5xl md:text-6xl font-bold text-gray-200 mb-6 leading-tight animate-slideUp">
                Transforming{" "}
                <span className="text-white relative">
                  Wellness
                  <span className="absolute -bottom-2 left-0 h-1 bg-blue-400 animate-growLine"></span>
                </span>{" "}
                in Sri Lanka
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slideUp">
                Where expert coaching meets comprehensive health guidance
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -left-16 top-1/4 w-12 h-12 bg-blue-300 rounded-full blur-md animate-pulse"></div>
            <div className="absolute -right-16 bottom-1/4 w-16 h-16 bg-indigo-400 rounded-full blur-md animate-float"></div>
          </div>
        </div>

        {/* Animated wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-[70px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="#ffffff"
              opacity="1"
            />
          </svg>
        </div>
      </div>

      {/* Introduction Section with Animation */}
      <section
        id="intro"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div style={fadeIn(isVisible.intro)} className="md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative">
              <span className="relative inline-block">
                Redefining Wellness in Sri Lanka
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At{" "}
              <span className="font-semibold text-blue-600">
                WellZone Lanka
              </span>
              , we focus on improving your overall well-being with a complete
              approach to fitness. Our aim is to help you achieve more than just
              physical fitness—it's about creating a balanced lifestyle that
              boosts your health and happiness. We provide personalized
              coaching, expert advice, and a supportive community to keep you
              motivated. Whether it's improving your fitness, getting better
              sleep, or reducing stress, we focus on making positive changes
              that last.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              With WellZone Lanka, you're not just working on fitness goals, but
              building a lifestyle that helps you feel better and live a
              healthier life. Our innovative approach breaks down barriers to
              fitness, making expert guidance accessible and affordable for
              everyone across the island. Whether you're in Colombo or Jaffna,
              Galle or Trincomalee, WellZone brings world-class wellness
              solutions directly to you.
            </p>
          </div>
          <div
            style={fadeIn(isVisible.intro)}
            className="md:w-1/3 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative h-72 w-72 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                <Heart size={100} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Animation */}
      <section
        id="mission"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24"
      >
        <div className="mb-16">
          <h2
            style={fadeIn(isVisible.mission)}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-14 relative"
          >
            <span className="relative inline-block">
              Our Purpose & Direction
              <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-blue-500"></span>
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                icon: <Star size={32} />,
                title: "Our Mission",
                text: "Our mission is to help people live healthier and happier lives by offering personalized fitness coaching, expert advice, and a supportive community to help them reach their goals.",
              },
              {
                icon: <Brain size={32} />,
                title: "Our Vision",
                text: "Our vision is to become the top provider of complete fitness solutions in Sri Lanka, inspiring and supporting people of all fitness levels to live healthier and more fulfilling lives.",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={fadeIn(isVisible.mission)}
                className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full mr-5 text-blue-600">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different with Animation */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-blue-50 to-white scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={fadeIn(isVisible.features)} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative inline-block">
              What Sets Us Apart
              <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-blue-500"></span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our unique blend of expertise and personalized coaching creates an
              unparalleled wellness experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Zap size={36} />,
                title: "Data-Driven Approach",
                text: "Our evidence-based methods analyze your unique physiology, habits, and goals to create adaptive fitness plans that evolve with you, ensuring optimal results with maximum efficiency.",
              },
              {
                icon: <Users size={36} />,
                title: "Expert Human Guidance",
                text: "Sri Lanka's top fitness trainers, nutritionists, and physiotherapists provide personalized guidance and motivation, delivering customized support with irreplaceable human intuition.",
              },
              {
                icon: <Award size={36} />,
                title: "Holistic Wellness Approach",
                text: "Going beyond fitness, we integrate nutrition, mental wellbeing, and recovery into comprehensive wellness solutions specifically tailored to Sri Lankan lifestyles and dietary patterns.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={fadeIn(isVisible.features)}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-blue-600 mx-auto group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-center leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with Animation */}
      <section id="journey" className="py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={fadeIn(isVisible.journey)} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative inline-block">
              Your Wellness Journey with WellZone
              <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-blue-500"></span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A seamless path to your health and fitness goals in four simple
              steps
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 transform -translate-y-1/2 z-0"></div>

            {[
              {
                title: "Comprehensive Assessment",
                description:
                  "Complete our thorough assessment designed by fitness experts to analyze your unique needs and goals.",
              },
              {
                title: "Expert Matching",
                description:
                  "Get matched with the perfect fitness professionals from our Sri Lankan expert network.",
              },
              {
                title: "Personalized Plan",
                description:
                  "Receive your custom wellness blueprint combining scientific insights with expert knowledge.",
              },
              {
                title: "Ongoing Support",
                description:
                  "Enjoy continuous guidance, motivation, and plan adjustments as you progress.",
              },
            ].map((step, index) => (
              <div
                key={index}
                style={fadeIn(isVisible.journey)}
                className="text-center mb-10 md:mb-0 relative z-10"
              >
                <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                  {`0${index + 1}`}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Animation */}
      <section
        id="cta"
        className="py-20 bg-gradient-to-b from-white to-blue-50 scroll-mt-24"
      >
        <div
          style={fadeIn(isVisible.cta)}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-gradient-to-r from-blue-400 to-indigo-400 p-12 rounded-3xl text-center shadow-xl overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
              Begin Your Transformation Today
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 relative z-10">
              Join thousands of Sri Lankans who are already experiencing the
              perfect blend of scientific precision and expert coaching to
              achieve their wellness goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
              <a
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold rounded-full transition-all duration-300 text-lg inline-flex items-center justify-center"
              >
                Contact Our Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Global animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes growLine {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(10px);
          }
          50% {
            transform: translateY(0px) translateX(20px);
          }
          75% {
            transform: translateY(10px) translateX(10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out 0.4s both;
        }

        .animate-growLine {
          animation: growLine 1s ease-out 1.5s forwards;
        }

        .animate-pulse {
          animation: pulse 4s infinite ease-in-out;
        }

        .animate-float {
          animation: float 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

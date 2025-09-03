"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar";
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from "../Footer";
import Sidebar from '../Sidebar';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('fitness');
  const [isVisible, setIsVisible] = useState({});

  // Setup intersection observer to trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Modified services object - removed Group Fitness Classes and Physiotherapy
  const services = {
    fitness: [
      {
        link: "/trainers",
        id: 1,
        name: "Personal Training",
        description: "One-on-one fitness coaching tailored to your specific goals and needs.",
        image: "/api/placeholder/600/400",
        features: ["Custom workout plans", "Nutritional guidance", "Progress tracking", "Flexibility training"]
      }
    ],
    medical: [
      {
        id: 3,
        name: "Health Checkups",
        description: "Comprehensive medical examinations to assess your overall health status.",
        image: "/api/placeholder/600/400",
        features: ["Full body assessment", "Blood work", "Cardiac evaluation", "Health risk assessment"]
      }
    ]
  };

  // Function to handle service selection and scroll to CTA section
  const handleServiceSelection = () => {
    // Scroll to the 'Ready to Transform Your Wellness Journey?' section
    document.getElementById('cta-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-cyan-50 overflow-x-hidden">
      <style jsx global>{`
        /* Animation keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: translateY(0); }
          50% { transform: translateY(10px); }
          100% { transform: translateY(0); }
        }
        
        /* Animation classes */
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .slide-up {
          opacity: 0;
          transform: translateY(30px);
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-visible {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-visible.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .stagger-item {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        
        .stagger-container.visible .stagger-item:nth-child(1) {
          transition-delay: 0s;
        }
        
        .stagger-container.visible .stagger-item:nth-child(2) {
          transition-delay: 0.1s;
        }
        
        .stagger-container.visible .stagger-item:nth-child(3) {
          transition-delay: 0.2s;
        }
        
        .stagger-container.visible .stagger-item:nth-child(4) {
          transition-delay: 0.3s;
        }
        
        .stagger-container.visible .stagger-item {
          opacity: 1;
          transform: translateY(0);
        }
        
        .pulse-animation {
          animation: pulse 2s infinite ease-in-out;
        }
        
        .hover-scale {
          transition: transform 0.3s ease-out;
        }
        
        .hover-scale:hover {
          transform: scale(1.03);
        }
        
        .service-card {
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
        }
        
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .service-image {
          transition: transform 0.5s ease-out;
        }
        
        .service-card:hover .service-image {
          transform: scale(1.05);
        }
        
        /* Enhanced CTA section styles */
        .cta-video-container {
          overflow: hidden;
          border-radius: 12px 0 0 12px;
          position: relative;
        }
        
        .cta-video {
          transition: transform 0.8s ease-out, filter 0.5s ease;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .cta-card:hover .cta-video {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
        
        .cta-overlay {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(6, 182, 212, 0.7) 100%);
          transition: opacity 0.5s ease;
        }
        
        .cta-card:hover .cta-overlay {
          opacity: 0.8;
        }
        
        .cta-content {
          transition: transform 0.4s ease-out;
        }
        
        .cta-card:hover .cta-content {
          transform: translateY(-5px);
        }
        
        .cta-button {
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .cta-button:after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: all 0.6s ease;
        }
        
        .cta-button:hover:after {
          left: 100%;
        }
        
        .cta-button-icon {
          transition: transform 0.3s ease;
        }
        
        .cta-button:hover .cta-button-icon {
          transform: translateX(5px);
        }
        
        .cta-button-text {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .cta-button:hover .cta-button-text {
          transform: translateY(-2px);
          opacity: 0.9;
        }
      `}</style>
      
      <Navbar />
      <Sidebar/>
      
      {/* Hero Section with Background Video */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-black/40 z-10"></div>
        <video 
            src="\assets\y.mp4"
            autoPlay 
            loop 
            muted 
            playsInline 
            className="object-cover w-full h-full absolute"
          />
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto slide-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl md:text-6x1 font-bold text-white mb-6 drop-shadow-lg">
              Your Journey to Wellness Starts Here
            </h1> 
          </div>
          <div>
            <p className="text-xl md:text-2xl text-white mb-8 mt-5 drop-shadow-md max-w-3xl mx-auto">
              WellZone Lanka offers comprehensive wellness solutions to help you achieve optimal health and fitness.
            </p>
            <a href="#cta-section" 
              className="mt-7 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full font-medium text-lg inline-block hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover-scale"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('cta-section').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Our Services
            </a>
          </div>
        </div>
      
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-cyan-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" >
        <div 
          id="services-heading" 
          className="text-center mb-16 animate-on-scroll animate-visible"
          style={{ opacity: isVisible['services-heading'] ? 1 : 0, transform: isVisible['services-heading'] ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Services</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our range of premium services designed to enhance your wellbeing.
          </p>
        </div>

        {/* Services Showcase Image */}
        <div 
          id="services-showcase" 
          className="mt-10 mb-16 animate-on-scroll animate-visible rounded-2xl overflow-hidden shadow-xl"
          style={{ opacity: isVisible['services-showcase'] ? 1 : 0, transform: isVisible['services-showcase'] ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <div className="relative w-full h-96">
            <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
              <Image
                src="/assets/ser2.png"
                alt="WellZone Services Showcase"
                layout="fill"
                objectFit="cover"
                className="hover-scale"
                style={{ transition: 'transform 0.6s ease-out' }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end" >
              <div className="p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Transform Your Life</h3>
                <p className="text-xl">Expert guidance for your wellness journey</p>
              </div>
            </div>
          </div>
        </div>
        
        <div id='Trainer'></div>
        <div id='Doctor'></div>
        
        {/* Enhanced Professional Call to Action Section */}
        <div 
          id="cta-section"
          className="my-32 text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl cta-card">
            <div className="grid md:grid-cols-2">
              {/* Left side - Enhanced Video Background */}
              <div className="relative h-96 md:h-auto overflow-hidden cta-video-container">
                <video 
                  className="absolute inset-0 w-full h-full object-cover cta-video"
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                >
                  <source src="\assets\ser1.mp4"></source>
                  {/* Fallback image if video doesn't load */}
                  <img 
                    src="/assets/wellness-background.jpg" 
                    alt="Wellness background" 
                    className="w-full h-full object-cover"
                  />
                </video>
                <div className="absolute inset-0 cta-overlay"></div>
                <div className="relative p-12 flex items-center justify-center h-full">
                  <div className="text-white cta-content" data-aos="fade-right" data-aos-delay="200">
                    <div className="mb-6 inline-block p-3 bg-white bg-opacity-20 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Transform Your Wellness Journey</h2>
                    <p className="text-xl opacity-90 max-w-md mx-auto">Join WellZone Lanka today and take the first step towards a healthier, more balanced life.</p>
                  </div>
                </div>
              </div>
              
              {/* Right side - Enhanced CTA buttons */}
              <div className="bg-white p-12 flex flex-col justify-center">
                <h3 
                  className="text-2xl font-semibold text-gray-800 mb-8 border-b border-gray-200 pb-4"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  Choose Your Wellness Path
                </h3>
                
                <div className="space-y-8">
                  <div 
                    className="group"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <Link href="/trainer">
                      <button 
                        onClick={() => {
                          setActiveTab('medical');
                          handleServiceSelection();
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full font-medium text-lg flex items-center justify-between transition-all duration-300 hover:shadow-lg group-hover:from-blue-700 group-hover:to-cyan-600 transform hover:scale-102 cta-button"
                      >
                        <span className="cta-button-text">Start Your Fitness Journey</span>
                        <span className="h-10 w-10 flex items-center justify-center bg-white bg-opacity-30 rounded-full cta-button-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </button>
                    </Link>
                    <div className="flex items-center mt-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-left transition-all duration-300 group-hover:text-blue-600">Connect with qualified doctors for comprehensive health assessments</p>
                    </div>
                  </div>
                  
                  <div 
                    className="group"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <Link href="/doctors">
                      <button 
                        onClick={() => {
                          setActiveTab('medical');
                          handleServiceSelection();
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full font-medium text-lg flex items-center justify-between transition-all duration-300 hover:shadow-lg group-hover:from-blue-700 group-hover:to-cyan-600 transform hover:scale-102 cta-button"
                      >
                        <span className="cta-button-text">Explore Health Checkups</span>
                        <span className="h-10 w-10 flex items-center justify-center bg-white bg-opacity-30 rounded-full cta-button-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </button>
                    </Link>
                    <div className="flex items-center mt-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-left transition-all duration-300 group-hover:text-blue-600">Connect with qualified doctors for comprehensive health assessments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How do I know which service is right for me?",
                answer: "Our team offers free consultations to assess your needs and goals. We'll recommend the most suitable services based on your individual requirements."
              },
              {
                question: "Can I combine fitness and medical services?",
                answer: "Absolutely! In fact, we encourage a holistic approach to wellness. Many of our members benefit from both our fitness programs and medical services."
              },
              {
                question: "What qualifications do your trainers and medical staff have?",
                answer: "All our fitness trainers are certified professionals with extensive experience. Our medical staff includes licensed physicians, physiotherapists, and health counselors."
              },
              {
                question: "Do you offer any packages or membership options?",
                answer: "Yes, we offer various membership tiers and packages that provide access to multiple services at discounted rates. Contact us for more details."
              }
            ].map((faq, index) => (
              <div key={index} className="mb-6 bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
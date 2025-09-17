"use client";

import { useState, useRef, useEffect } from "react";
import emailjs from '@emailjs/browser';
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from "@/app/Footer";
import Sidebar from "@/app/Sidebar";

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    agreeToTerms: false,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');

  // EmailJS configuration - Using environment variables with fallback and debugging
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_zoxf3sq';
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_2ma107y';
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'Xsp1gQRGxnYEATnWB';

  // Debug environment variables
  console.log('EmailJS Config Debug:', {
    serviceId: EMAILJS_SERVICE_ID,
    templateId: EMAILJS_TEMPLATE_ID,
    publicKey: EMAILJS_PUBLIC_KEY ? 'Loaded' : 'Missing'
  });

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log('EmailJS initialized with public key');
    }
  }, [EMAILJS_PUBLIC_KEY]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setPopupType('error');
      setPopupMessage('Please agree to the Privacy Policy and Terms of Service');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
      return;
    }

    setIsLoading(true);

    try {
      // Parameters for admin/support notification
      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        to_name: 'WellZone Lanka Support',
        to_email: 'thevinu2005@gmail.com',
        reply_to: formData.email,
      };

      console.log("Sending main email with params:", templateParams);

      // Send message to support/admin
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      // Parameters for thank-you mail to the user
      const thankYouParams = {
        to_name: `${formData.firstName} ${formData.lastName}`,
        to_email: formData.email,
        subject: "Thank You for Contacting WellZone Lanka",
        message: `Dear ${formData.firstName},  
        
Thank you for reaching out to us! We've received your message regarding "${formData.subject}" and our team will get back to you shortly.  

Best regards,  
WellZone Lanka Support Team`,
        from_name: "WellZone Lanka",
        reply_to: "wellzonelanka@gmail.com"
      };

      console.log("Sending thank-you email with params:", thankYouParams);

      // Send thank-you email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        thankYouParams
      );

      // Success popup
      setPopupType("success");
      setPopupMessage("✅ Your message has been sent successfully! We'll get back to you soon.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        agreeToTerms: false,
      });
      form.current?.reset();

    } catch (error: any) {
      console.error("Email sending failed:", error);
      setPopupType("error");
      setPopupMessage("❌ Failed to send message. Please try again.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 8000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navigation */}
      <Navbar />
      <Sidebar />

      {/* Enhanced Popup Notification */}
      {showPopup && (
        <div className="fixed top-5 right-5 z-50 animate-slide-in">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg ${
            popupType === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {popupType === 'success' ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <AlertCircle className="h-6 w-6" />
            )}
            <p className="font-medium">{popupMessage}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="pt-20 bg-gradient-to-b from-cyan-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-lg text-gray-600">
              We're here to answer your questions and provide the support you
              need on your wellness journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-100 text-cyan-600">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      +94 70 183 0489
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-100 text-cyan-600">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      wellzonelanka@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-100 text-cyan-600">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      Address
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      123 Fitness Avenue, Colombo, Sri Lanka
                    </p>
                  </div>
                </div>
              </div>

              {/* Added Social Media Links */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-4">
                  Follow us on social media
                </p>
                <div className="flex justify-center space-x-6">
                  {/* Instagram Logo */}
                  <Link
                    href="https://www.instagram.com/wellzonelanka?igsh=YzF3aW05Znhkdjc2"
                    target="_blank"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                      alt="Instagram"
                      className="h-8 w-8 transition-transform transform hover:scale-110"
                    />
                  </Link>

                  {/* YouTube Logo */}
                  <Link
                    href="https://www.youtube.com/@wellzonelanka/community"
                    target="_blank"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                      alt="YouTube"
                      className="h-8 w-auto transition-transform transform hover:scale-110"
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl shadow-xl overflow-hidden p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center text-white">
                Always Available
              </h3>
              <div className="mb-8">
                <div className="flex items-center justify-center bg-white/20 rounded-lg p-4 mb-6">
                  <span className="text-lg font-semibold text-white">
                    Open 24/7 Online
                  </span>
                </div>
              </div>

              <div className="space-y-5 text-white border-t border-white/30 pt-6">
                <div className="flex justify-between items-center">
                  <dt className="font-medium text-lg text-gray-200">
                    Live Chat Support
                  </dt>
                  <dd className="bg-teal-500 px-4 py-2 rounded-full text-sm font-semibold text-white">
                    24/7
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="font-medium text-lg text-gray-200">
                    Email Response
                  </dt>
                  <dd className="text-sm text-gray-300">Within 2 hours</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="font-medium text-lg text-gray-200">
                    Phone Support
                  </dt>
                  <dd className="text-sm text-gray-300">
                    9:00 AM - 8:00 PM Daily
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <form
                ref={form}
                onSubmit={handleSubmit}
                className="space-y-6"
                style={{ paddingBottom: 20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Your first name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="What is your inquiry about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={10}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Please describe how we can help you..."
                  />
                </div>

                <div className="flex items-start pt-4">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="agreeToTerms"
                      className="font-medium text-gray-700"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-cyan-600 hover:text-cyan-700 underline"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-cyan-600 hover:text-cyan-700 underline"
                      >
                        Terms of Service
                      </a>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-cyan-600 border border-transparent rounded-lg shadow-sm py-3 px-6 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to Transform Your Health?
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
              Join WellZone Lanka today and begin your journey to optimal
              wellness with our expert team.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-teal-500 border-2 border-white text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => (window.location.href = "/services")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="flex items-center justify-center relative z-10">
                  Explore Services
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-in {
          0% {
            transform: translateX(120%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

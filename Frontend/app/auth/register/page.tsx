"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import Navbar from "@/components/Navbar"; // Import Navbar component
import styles from './register.module.css';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    licenseNumber: "",
    experience: "",
    specialization: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of fitness-related images for the slideshow
  const images = [
    "../assets/login1.png",
    "../assets/login2.png",
    "../assets/login3.png",
  ];

  // Set up the slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleRoleSelection = (role: "user" | "trainer" | "doctor") => {
    setForm({
      ...form,
      role,
      licenseNumber: "",
      experience: "",
      specialization: "",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setPending(false);
      console.log("Form submitted:", form);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-64 -left-64 w-96 h-96 bg-teal-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6" style={{ paddingTop: "60px" }}>
          

          {/* Right Side - Professional Sign Up Form (5 columns) */}
          <div className="lg:col-span-5">
            <form className={`max-w-lg mx-auto bg-white p-10 rounded-lg border border-gray-200 shadow-lg max-h-[680px] overflow-y-auto ${styles.hideScrollbar}`} onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Create an account
                  </h1>
                  <h2 className="text-xl font-medium text-gray-600">
                    Join{" "}
                    <span className="text-cyan-600 font-semibold">
                      WellZone Lanka
                    </span>{" "}
                    today
                  </h2>
                </div>

                {/* Account Type Selection */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    I want to sign up as:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { role: "user", label: "User", icon: "👤" },
                      { role: "trainer", label: "Trainer", icon: "🏃" },
                      { role: "doctor", label: "Doctor", icon: "👨‍⚕️" }
                    ] as { role: "user" | "trainer" | "doctor"; label: string; icon: string }[]).map(({ role, label, icon }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSelection(role)}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                          form.role === role
                            ? "border-cyan-500 bg-cyan-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xl mb-1">{icon}</span>
                        <span className="text-xs font-medium text-gray-700">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-2 text-sm text-red-600">
                    <TriangleAlert className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Professional Form Fields */}
                <div className="space-y-5">
                  <div className="px-2 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          First Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            disabled={pending}
                            placeholder="First name"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            value={form.firstName}
                            onChange={(e) =>
                              setForm({ ...form, firstName: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Last Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Last name"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            disabled={pending}
                            value={form.lastName}
                            onChange={(e) =>
                              setForm({ ...form, lastName: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 mt-5 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          disabled={pending}
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Show additional fields for trainer and doctor */}
                    {(form.role === 'trainer' || form.role === 'doctor') && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 mt-5 block">
                            Professional License Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={`Enter your ${form.role} license number`}
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                              disabled={pending}
                              value={form.licenseNumber}
                              onChange={(e) =>
                                setForm({ ...form, licenseNumber: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 mt-5 block">
                            Years of Experience
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="Years of experience"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                              disabled={pending}
                              min="0"
                              value={form.experience}
                              onChange={(e) =>
                                setForm({ ...form, experience: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>

                        {form.role === 'trainer' && (
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 mt-5 block">
                              Specialization
                            </label>
                            <div className="relative">
                              <select
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                disabled={pending}
                                value={form.specialization}
                                onChange={(e) =>
                                  setForm({ ...form, specialization: e.target.value })
                                }
                                required
                              >
                                <option value="">Select specialization</option>
                                <option value="weight-training">Weight Training</option>
                                <option value="cardio">Cardio</option>
                                <option value="yoga">Yoga</option>
                                <option value="pilates">Pilates</option>
                                <option value="crossfit">CrossFit</option>
                                <option value="sports-specific">Sports-Specific Training</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {form.role === 'doctor' && (
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 mt-5 block">
                              Medical Specialization
                            </label>
                            <div className="relative">
                              <select
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                disabled={pending}
                                value={form.specialization}
                                onChange={(e) =>
                                  setForm({ ...form, specialization: e.target.value })
                                }
                                required
                              >
                                <option value="">Select specialization</option>
                                <option value="sports-medicine">Sports Medicine</option>
                                <option value="orthopedics">Orthopedics</option>
                                <option value="nutrition">Nutrition</option>
                                <option value="physiotherapy">Physiotherapy</option>
                                <option value="general-practice">General Practice</option>
                                <option value="cardiology">Cardiology</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 mt-5 block">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          disabled={pending}
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Password must be at least 8 characters
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 mt-5 block">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          disabled={pending}
                          value={form.confirmPassword}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center mt-5 h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="h-4 w-4 bg-gray-50 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm mt-5">
                        <label htmlFor="terms" className="text-gray-700">
                          I agree to the{" "}
                          <a
                            href="#"
                            className="text-cyan-600 hover:text-cyan-700 font-medium"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="text-cyan-600 hover:text-cyan-700 font-medium"
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-3 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md transition-all"
                      disabled={pending}
                    >
                      {pending ? "Creating account..." : "Create account"}
                    </button>

                    <div className="text-center">
                      <p className="text-gray-600 text-sm mt-5">
                        Already have an account?{" "}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/auth/login";
                          }}
                          className="text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                          Sign in
                        </a>
                      </p>
                    </div>

                    {/* Social Signup Buttons - Professional Design */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative mt-3 flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          or sign up with email
                        </span>
                      </div>
                    </div>

                    <div className="w-full mt-3">
                      <button
                        type="button"
                        className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <img
                          src="https://www.google.com/favicon.ico"
                          alt="Google"
                          className="w-5 h-5 mr-2"
                        />
                        <span className="font-medium text-gray-600">Sign up with Google</span>
                      </button>
                    </div>

                    {/* Added Social Media Links */}
                    <div className="pt-6 border-t border-gray-200">
                      <p className="text-center text-sm text-gray-600 mb-4">
                        Follow us on social media
                      </p>
                      <div className="flex justify-center items-center space-x-6">
                        {/* Instagram Logo */}
                        <a
                          href="https://www.instagram.com/wellzonelanka?igsh=YzF3aW05Znhkdjc2"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-1 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="h-7 w-7 text-gray-700 hover:text-gray-900 transition-colors transform hover:scale-110"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>

                        {/* YouTube Logo */}
                        <a
                          href="https://www.youtube.com/@wellzonelanka/community"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-1 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="h-7 w-7 text-gray-700 hover:text-gray-900 transition-colors transform hover:scale-110"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Left Side - Image Slideshow (7 columns) */}
          <div className="lg:col-span-7 rounded-lg overflow-hidden shadow-xl relative bg-gray-300 flex items-center justify-center" style={{ height: "680px" }}>
            <div className="relative w-full h-full">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center"
                  style={{
                    opacity: currentImageIndex === index ? 1 : 0,
                    zIndex: currentImageIndex === index ? 10 : 0,
                  }}
                >
                  {/* Replace with actual image if available */}
                  <img
                    src={src}
                    alt={`Fitness ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              ))}

              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h2 className="text-white text-4xl font-bold mb-3">
                  Elevate Your Fitness
                </h2>
                <p className="text-white/90 text-xl mb-4">
                  Professional training programs tailored to your goals
                </p>

                {/* Slideshow indicators */}
                <div className="flex items-center space-x-2 mt-6">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentImageIndex === index
                          ? "w-10 bg-cyan-500"
                          : "w-3 bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

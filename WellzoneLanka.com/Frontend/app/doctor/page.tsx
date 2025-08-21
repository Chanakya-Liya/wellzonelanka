"use client";

import { useState, useEffect } from "react";
import { Clipboard, Eye, EyeOff, TriangleAlert, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DoctorRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    hospital: "",
    bio: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of doctor-related images for the slideshow
  const images = ["/assets/dr1.png", "/assets/dr2.png", "/assets/dr3.png"];

  // Set up the slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    // Validate password match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/doctor-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setPending(false);
        toast.success(data.message);
        router.push("../verification-pending"); // Redirect to verification pending page
      } else if (res.status === 400) {
        setError(data.message);
        setPending(false);
      } else if (res.status === 500) {
        setError(data.message);
        setPending(false);
      } else {
        setError("An unexpected error occurred.");
        setPending(false);
      }
    } catch (error) {
      setPending(false);
      setError("An error occurred while submitting the form.");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-64 -left-64 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-cyan-500 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto pt-6">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6"
          style={{ paddingTop: "120px" }}
        >
          {/* Left Side - Image Section */}
          <div className="md:col-span-5 rounded-lg overflow-hidden shadow-xl relative">
            <div className="relative w-full" style={{ height: "1100px" }}>
              {images.map((src, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                  style={{
                    opacity: currentImageIndex === index ? 1 : 0,
                    zIndex: currentImageIndex === index ? 10 : 0,
                  }}
                >
                  <Image
                    src={src}
                    alt={`Doctor Image ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transform hover:scale-105 transition-transform duration-700"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              ))}

              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h2 className="text-white text-4xl font-bold mb-3">
                  Join Our Medical Network
                </h2>
                <p className="text-white/90 text-xl mb-4">
                  Connect with patients and improve healthcare access
                </p>

                {/* Slideshow indicators */}
                <div className="flex items-center space-x-2 mt-6">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentImageIndex === index
                          ? "w-10 bg-blue-500"
                          : "w-3 bg-white/70"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="md:col-span-7">
            <div className="bg-white p-10 rounded-lg border border-gray-200 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Doctor Registration
                  </h1>
                  <h2 className="text-xl font-medium text-gray-600">
                    Join the{" "}
                    <span className="text-blue-600 font-semibold">
                      WellZone Lanka
                    </span>{" "}
                    healthcare network
                  </h2>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  {!!error && (
                    <div className="bg-red-500 p-3 rounded-md flex items-center gap-x-2 text-sm text-white mb-6 justify-center">
                      <TriangleAlert />
                      <p>{error}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="px-2 sm:px-6">
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
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={pending}
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Specialization
                        </label>
                        <div className="relative">
                          <select
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={pending}
                            value={form.specialization}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                specialization: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Select specialization</option>
                            <option value="General Practitioner">
                              General Practitioner
                            </option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Orthopedic">Orthopedic</option>
                            <option value="Pediatrician">Pediatrician</option>
                            <option value="Psychiatrist">Psychiatrist</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          License Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter medical license number"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={pending}
                            value={form.licenseNumber}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                licenseNumber: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Years of Experience
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Years of experience"
                            min="0"
                            max="70"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={pending}
                            value={form.experience}
                            onChange={(e) =>
                              setForm({ ...form, experience: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Hospital/Clinic
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Hospital or clinic name"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          disabled={pending}
                          value={form.hospital}
                          onChange={(e) =>
                            setForm({ ...form, hospital: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Professional Bio
                      </label>
                      <div className="relative">
                        <textarea
                          placeholder="Brief professional background (200-300 characters)"
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          disabled={pending}
                          value={form.bio}
                          onChange={(e) =>
                            setForm({ ...form, bio: e.target.value })
                          }
                          maxLength={300}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {form.bio.length}/300 characters
                      </p>
                    </div>

                    <div className="mt-5 p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-blue-500 mb-2" />
                        <p className="text-sm text-gray-700 font-medium">
                          Upload License Document
                        </p>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Upload a scanned copy of your medical license (PDF or
                          JPG)
                        </p>
                        <input
                          type="file"
                          className="w-full mt-3"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        <p className="text-xs text-gray-500 mt-1">
                          Password must be at least 8 characters
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    </div>

                    <div className="flex items-start mt-5">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="h-4 w-4 bg-gray-50 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                          I agree to the{" "}
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start mt-3">
                      <div className="flex items-center h-5">
                        <input
                          id="certification"
                          name="certification"
                          type="checkbox"
                          className="h-4 w-4 bg-gray-50 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="certification"
                          className="text-gray-700"
                        >
                          I certify that all information provided is accurate
                          and I am a licensed medical professional
                        </label>
                      </div>
                    </div>

                    <button
                      className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium shadow-sm hover:shadow-md transition-all"
                      disabled={pending}
                    >
                      Register as Doctor
                    </button>

                    <div className="text-center mt-5">
                      <p className="text-gray-600 text-sm">
                        Already have an account?{" "}
                        <a
                          href="/login"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Login here
                        </a>
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        Not a doctor?{" "}
                        <a
                          href="/register"
                          className="text-gray-800 hover:text-black font-medium"
                        >
                          Register as Patient
                        </a>{" "}
                        or{" "}
                        <a
                          href="/trainer-form"
                          className="text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                          Register as Trainer
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

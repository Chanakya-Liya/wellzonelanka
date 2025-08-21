"use client";

import { useState, useEffect } from "react";
import {

  Eye,
  EyeOff,
 
  TriangleAlert,
 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import RoleSelectionButtons from "./RoleSelectionButtons";
import { signIn } from "next-auth/react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role is user
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of fitness-related images for the slideshow
  const images = [
    "/assets/login3.png",
    "/assets/login1.png",
    "/assets/login2.png", // Replace with actual image URL
  ];

  // Set up the slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Update form.role when RoleSelectionButtons component changes role
  const handleRoleSelection = (role: string) => {
    setForm({ ...form, role });
  };

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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json(); // Parse the response JSON

      if (res.ok) {
        setPending(false);
        toast.success(data.message); // Show success message
        router.push("../login");
      } else if (res.status === 400) {
        setError(data.message); // Set error message for 400 status
        setPending(false);
      } else if (res.status === 500) {
        setError(data.message); // Set error message for 500 status
        setPending(false);
      } else {
        setError("An unexpected error occurred."); // Handle other errors
        setPending(false);
      }
    } catch (error) {
      setPending(false);
      setError("An error occurred while submitting the form."); // Handle fetch errors
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-64 -left-64 w-96 h-96 bg-teal-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      {/* Main Content - Professional Layout */}
      <div className="relative z-10 max-w-7x1 mx-auto pt-6">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6"
          style={{ paddingTop: "120px" }}
        >
          {/* Left Side - Professional Image Section (increased size, now 7 columns) */}
          <div className="md:col-span-7 rounded-lg overflow-hidden shadow-xl relative">
            {/* Image slideshow with fade transition - increased height */}
            <div className="relative w-full" style={{ height: "680px" }}>
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
                    alt={`Fitness Image ${index + 1}`}
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
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Professional Sign Up Form (7 columns) */}
          <div className="md:col-span-5">
            <div className="max-w-lg mx-auto bg-white p-10 rounded-lg border border-gray-200 shadow-lg">
              <div className="space-y-6">
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

                {/* Account Type Selection - Using the imported component */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    I want to sign up as:
                  </label>
                  <RoleSelectionButtons
                    initialRole={form.role}
                    onChange={handleRoleSelection}
                  />
                </div>
                {/* Professional Form Fields */}
                <div className="space-y-5">
                  {!!error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6 bg-red-500 justify-center">
                      <TriangleAlert />
                      <p>{error}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="px-2 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1  block">
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
                        />
                      </div>
                    </div>

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
                        />
                      </div>
                      <div className="ml-3 text-sm mt-5">
                        <label htmlFor="terms" className="text-gray-700 ">
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
                      className="w-full mt-3 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md transition-all"
                      disabled={pending}
                    >
                      Create account
                    </button>

                    <div className="text-center">
                      <p className="text-gray-600 text-sm mt-5">
                        Already have an account?{" "}
                        <a
                          href="<a 
      href="
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/login";
                            // or use navigation from your framework
                            // navigate('/login');
                          }}
                          className="text-cyan-600  hover:text-cyan-700  font-medium"
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
                    {/* Replace this line in the Register.jsx file, around line 325 */}

                    <div className="w-full mt-3">
                    <button
                      type="button"
                      onClick={() => signIn("google")}
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

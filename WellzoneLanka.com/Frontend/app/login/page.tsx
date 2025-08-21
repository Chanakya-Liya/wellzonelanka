"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");

    // Validate email and password before making the API call
    if (!email || !password) {
      setError("Please fill in all fields.");
      setPending(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        router.push("../services");
        toast.success("Login Successful");
      } else {
        // Handle specific errors based on the response
        switch (res?.error) {
          case "CredentialsSignin":
            setError("Invalid email or password.");
            break;
          case "NetworkError":
            setError("Network error. Please check your connection.");
            break;
          default:
            setError("Something went wrong. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setPending(false);
    }
  };

  // Array of fitness-related images for the slideshow
  const images = [
    "/assets/login3.png",
    "/assets/login1.png",
    "/assets/login2.png",
  ];

  // Set up the slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-64 -left-64 w-96 h-96 bg-teal-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      {/* Main Content - Professional Layout */}
      <div className="relative z-10 max-w-7xl mx-auto pt-6">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6"
          style={{ paddingTop: "120px" }}
        >
          {/* Left Side - Professional Image Section */}
          <div className="md:col-span-7 rounded-lg overflow-hidden shadow-xl relative">
            {/* Image slideshow with fade transition */}
            <div className="relative w-full" style={{ height: "650px" }}>
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

          {/* Right Side - Professional Sign In Form */}
          <div className="md:col-span-5">
            <div className="max-w-lg mx-auto bg-white p-10 rounded-lg border border-gray-200 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back
                  </h1>
                  <h2 className="text-xl font-medium text-gray-600">
                    Sign in to{" "}
                    <span className="text-cyan-600 font-semibold">
                      WellZone Lanka
                    </span>
                  </h2>
                </div>
                {!!error && (
                  <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500 mb-6 justify-center">
                    <TriangleAlert />
                    <p>{error}</p>
                  </div>
                )}

                {/* Professional Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        disabled={pending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        disabled={pending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 bg-gray-50 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="../forgot-password"
                      className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-md font-medium shadow-sm hover:shadow-md transition-all"
                    disabled={pending}
                  >
                    {pending ? "Signing in..." : "Sign in to account"}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      No Account?{" "}
                      <a
                        href="../register"
                        className="text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        Create an account
                      </a>
                    </p>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        or continue with email
                      </span>
                    </div>
                  </div>
                  <div className="w-full">
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
                    <span className="font-medium text-gray-600">Google</span>
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
  );
};

export default LoginPage;

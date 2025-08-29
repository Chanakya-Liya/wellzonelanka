"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown on click
  const handleServicesClick = () => {
    setServicesOpen((prev) => !prev);
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="shadow-sm fixed w-full z-30 py-3 px-1 bg-opacity-25 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-[3rem] shadow-lg">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/assets/lgo.png"
                alt="Logo"
                width={60}
                height={60}
                className="hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <span className="ml-2 text-xl font-bold text-black">
              WellZone Lanka
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              Home
            </Link>

            <Link
              href="/trainer"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              Trainers
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleServicesClick}
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 group flex items-center"
              >
                Services
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link
                    href="/services"
                    className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                  >
                    FitnessCare Service
                  </Link>
                  <Link
                    href="/doctors"
                    className="block px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                  >
                    HealthCare Service
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              About us
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              Contact us
            </Link>

            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              Log in / Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

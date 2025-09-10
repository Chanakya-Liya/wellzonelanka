"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Using react-icons for a menu icon

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown on click
  const handleMobileMenuClick = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
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
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105"
            >
              Services
            </Link>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={handleMobileMenuClick}
              className="text-gray-700 hover:text-cyan-600 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel (Hidden by default, shown on small screens) */}
      <div
        ref={dropdownRef}
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-white mt-2 py-2 rounded-lg shadow-lg mx-4`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Link
            href="/"
            className="w-full text-center text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/services"
            className="w-full text-center text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/about"
            className="w-full text-center text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            About us
          </Link>
          <Link
            href="/contact"
            className="w-full text-center text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact us
          </Link>
          <Link
            href="/auth/login"
            className="w-full text-center text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Log in / Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
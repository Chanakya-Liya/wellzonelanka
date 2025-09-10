"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Check for logged-in user on component mount
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Toggle dropdown on click
  const handleServicesClick = () => {
    setServicesOpen((prev) => !prev);
  };

  // Toggle user menu
  const handleUserMenuClick = () => {
    setUserMenuOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setUserMenuOpen(false);
    // Redirect to home page
    window.location.href = '/';
  };

  // Close dropdowns if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
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

            {/* Services Dropdown */}
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

            {/* User Authentication Section */}
            {currentUser ? (
              // Logged in user menu
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300"
                >
                  <User className="h-5 w-5" />
                  <span>Hi, {currentUser.firstName}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                      <div className="font-medium">{currentUser.firstName} {currentUser.lastName}</div>
                      <div className="text-xs text-gray-500">{currentUser.email}</div>
                      <div className="text-xs text-cyan-600 capitalize">{currentUser.role}</div>
                    </div>
                    
                    {/* Role-based navigation */}
                    {currentUser.role === 'doctor' && (
                      <Link
                        href="/doctor-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Doctor Dashboard
                      </Link>
                    )}
                    
                    {currentUser.role === 'trainer' && (
                      <Link
                        href="/trainer-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Trainer Dashboard
                      </Link>
                    )}
                    
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in - show login/signup link
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105"
              >
                Log in / Sign up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

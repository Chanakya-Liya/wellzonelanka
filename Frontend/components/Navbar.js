"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const router = useRouter();
  
  // Get current pathname
  const [currentPath, setCurrentPath] = useState("");
  
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

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

  const handleUserMenuClick = () => {
    setUserMenuOpen((prev) => !prev);
    setMobileMenuOpen(false);
  };

  const handleMobileMenuClick = () => {
    setMobileMenuOpen((prev) => !prev);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  // Function to determine if a link is active
  const isActivePage = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  // Function to get link classes based on active state
  const getLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile 
      ? "block py-2 font-medium transition-colors duration-300"
      : "font-medium transition-colors duration-300 hover:scale-105";
    
    const activeClasses = "text-cyan-600 font-bold";
    const inactiveClasses = "text-gray-700 hover:text-cyan-600";
    
    return `${baseClasses} ${isActivePage(path) ? activeClasses : inactiveClasses}`;
  };

  // Function to get the dynamic service button content
  const getServiceButtonContent = () => {
    if (currentPath.startsWith('/doctors') || currentPath.startsWith('/doctor')) {
      return { text: 'Doctor', href: '/doctors', path: '/doctors', isClickable: true };
    }
    if (currentPath.startsWith('/trainers') || currentPath.startsWith('/trainer')) {
      return { text: 'Trainer', href: '#', path: '/trainer', isClickable: false };
    }
    return { text: 'Services', href: '/services', path: '/services', isClickable: true };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const UserAuthLinks = () => (
    <>
      {currentUser ? (
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={handleUserMenuClick}
            className="flex items-center space-x-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300"
          >
            <User className="h-5 w-5" />
            <span>Hi, {currentUser.firstName}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                <div className="font-medium">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-xs text-gray-500">{currentUser.email}</div>
                <div className="text-xs text-cyan-600 capitalize">{currentUser.role}</div>
              </div>
              {currentUser.role === 'doctor' && (
                <Link 
                  href="/doctor-dashboard" 
                  className={`block px-4 py-2 text-sm transition-colors ${
                    isActivePage('/doctor-dashboard') 
                      ? 'text-cyan-600 bg-cyan-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setUserMenuOpen(false)}
                >
                  Doctor Dashboard
                </Link>
              )}
              {currentUser.role === 'trainer' && (
                <Link 
                  href="/trainer-dashboard" 
                  className={`block px-4 py-2 text-sm transition-colors ${
                    isActivePage('/trainer-dashboard') 
                      ? 'text-cyan-600 bg-cyan-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setUserMenuOpen(false)}
                >
                  Trainer Dashboard
                </Link>
              )}
              {currentUser.role === 'user' && (
                <Link 
                  href="/user-profile" 
                  className={`block px-4 py-2 text-sm transition-colors ${
                    isActivePage('/user-profile') 
                      ? 'text-cyan-600 bg-cyan-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setUserMenuOpen(false)}
                >
                  My Profile
                </Link>
              )}
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/auth/login" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300 hover:scale-105">
          Log in / Sign up
        </Link>
      )}
    </>
  );

  // Get dynamic service button content
  const serviceButton = getServiceButtonContent();

  return (
    <nav className="shadow-sm fixed w-full z-30 py-3 px-1 bg-opacity-25 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-[3rem] shadow-lg">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/lgo.png"
                alt="Logo"
                width={60}
                height={60}
                className="hover:scale-105 transition-transform duration-300"
              />
              <span className="ml-2 text-xl font-bold text-black hidden sm:block">
                WellZone Lanka
              </span>
            </Link>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={getLinkClasses('/')}>
              Home
            </Link>
            {serviceButton.isClickable ? (
              <Link href={serviceButton.href} className={getLinkClasses(serviceButton.path)}>
                {serviceButton.text}
              </Link>
            ) : (
              <span className={getLinkClasses(serviceButton.path)} style={{ cursor: 'default' }}>
                {serviceButton.text}
              </span>
            )}
            <Link href="/about" className={getLinkClasses('/about')}>
              About us
            </Link>
            <Link href="/contact" className={getLinkClasses('/contact')}>
              Contact us
            </Link>
            <UserAuthLinks />
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {currentUser && (
              <button
                onClick={handleUserMenuClick}
                className="p-2 text-gray-700 rounded-md hover:text-cyan-600 hover:bg-gray-100 transition-colors"
                aria-label="User menu"
              >
                <User className="h-6 w-6" />
              </button>
            )}
            <button
              className="p-2 text-gray-700 rounded-md hover:text-cyan-600 hover:bg-gray-100 focus:outline-none"
              onClick={handleMobileMenuClick}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg transition-all duration-300 ease-in-out transform ${
          mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        } origin-top`}
      >
        <div className="py-4 px-6 space-y-2">
          <Link href="/" className={getLinkClasses('/', true)} onClick={closeMobileMenu}>
            Home
          </Link>
          {serviceButton.isClickable ? (
            <Link href={serviceButton.href} className={getLinkClasses(serviceButton.path, true)} onClick={closeMobileMenu}>
              {serviceButton.text}
            </Link>
          ) : (
            <span className={getLinkClasses(serviceButton.path, true)} style={{ cursor: 'default' }}>
              {serviceButton.text}
            </span>
          )}
          <Link href="/about" className={getLinkClasses('/about', true)} onClick={closeMobileMenu}>
            About us
          </Link>
          <Link href="/contact" className={getLinkClasses('/contact', true)} onClick={closeMobileMenu}>
            Contact us
          </Link>
          <div className="border-t border-gray-200 my-2"></div>
          {currentUser ? (
            <>
              <div className="px-2 py-1 text-sm text-gray-600">
                <div className="font-medium">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="text-xs text-gray-500">{currentUser.email}</div>
                <div className="text-xs text-cyan-600 capitalize">{currentUser.role}</div>
              </div>
              {currentUser.role === 'doctor' && (
                <Link 
                  href="/doctor-dashboard" 
                  className={`block px-2 py-2 text-sm transition-colors ${
                    isActivePage('/doctor-dashboard') 
                      ? 'text-cyan-600 bg-cyan-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Doctor Dashboard
                </Link>
              )}
              {currentUser.role === 'trainer' && (
                <Link 
                  href="/trainer-dashboard" 
                  className={`block px-2 py-2 text-sm transition-colors ${
                    isActivePage('/trainer-dashboard') 
                      ? 'text-cyan-600 bg-cyan-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={closeMobileMenu}
                >
                  Trainer Dashboard
                </Link>
              )}
              <Link 
                href="/user-profile" 
                className={`block px-2 py-2 text-sm transition-colors ${
                  isActivePage('/user-profile') 
                    ? 'text-cyan-600 bg-cyan-50 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeMobileMenu}
              >
                My Profile
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="block py-2 text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-300" onClick={closeMobileMenu}>
              Log in / Sign up
            </Link>
          )}
        </div>
      </div>

      {/* User menu for mobile (as a separate overlay) */}
      {userMenuOpen && (
        <div className="md:hidden absolute top-16 right-4 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
            <div className="font-medium">{currentUser.firstName} {currentUser.lastName}</div>
            <div className="text-xs text-gray-500">{currentUser.email}</div>
            <div className="text-xs text-cyan-600 capitalize">{currentUser.role}</div>
          </div>
          {currentUser.role === 'doctor' && (
            <Link 
              href="/doctor-dashboard" 
              className={`block px-4 py-2 text-sm transition-colors ${
                isActivePage('/doctor-dashboard') 
                  ? 'text-cyan-600 bg-cyan-50 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setUserMenuOpen(false)}
            >
              Doctor Dashboard
            </Link>
          )}
          {currentUser.role === 'trainer' && (
            <Link 
              href="/trainer-dashboard" 
              className={`block px-4 py-2 text-sm transition-colors ${
                isActivePage('/trainer-dashboard') 
                  ? 'text-cyan-600 bg-cyan-50 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setUserMenuOpen(false)}
            >
              Trainer Dashboard
            </Link>
          )}
          <Link 
            href="/user-profile" 
            className={`block px-4 py-2 text-sm transition-colors ${
              isActivePage('/user-profile') 
                ? 'text-cyan-600 bg-cyan-50 font-medium' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setUserMenuOpen(false)}
          >
            My Profile
          </Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
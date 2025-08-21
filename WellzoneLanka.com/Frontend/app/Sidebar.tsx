"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Phone,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Home
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);

  // Auto-hide sidebar when mouse leaves the sidebar area
  useEffect(() => {
    const handleMouseLeave = () => {
      setIsOpen(false);
    };

    if (sidebarRef.current) {
      sidebarRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (sidebarRef.current) {
        sidebarRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [sidebarRef]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Add event listener for trigger hover
  useEffect(() => {
    const handleTriggerHover = () => {
      setIsOpen(true);
    };

    if (triggerRef.current) {
      triggerRef.current.addEventListener("mouseenter", handleTriggerHover);
    }

    return () => {
      if (triggerRef.current) {
        triggerRef.current.removeEventListener(
          "mouseenter",
          handleTriggerHover
        );
      }
    };
  }, [triggerRef]);

  // Navigate to service pages
  const navigateToHome = () => {
    router.push("/");
    setIsOpen(false);
  };

  const navigateToTrainer = () => {
    router.push("/trainer#Trainer");
    setIsOpen(false);
  };

  const navigateToDoctor = () => {
    router.push("/doctors#Doctor");
    setIsOpen(false);
  };

  return (
    <>
      {/* Main content blur overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-md z-30 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Transparent Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-12 left-2 h-[calc(100%-4rem)] bg-transparent backdrop-blur-lg text-white w-72 z-40 transform transition-all duration-500 ease-in-out rounded-3xl flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          boxShadow: isOpen
            ? "0 10px 40px -10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.15)"
            : "",
        }}
      >
        {/* Glass effect container */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 via-blue-900/30 to-blue-800/30"></div>
          <div className="absolute inset-0 border border-white/10 rounded-3xl"></div>
        </div>

        {/* Sidebar Header with glass effect */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-blue-500/50 to-cyan-500/50 rounded-t-3xl"></div>
          <div className="absolute inset-0 bg-[url('/assets/grid-pattern.png')] opacity-10 bg-repeat"></div>
          <div className="relative p-6 z-10">
            <div className="flex items-center">
              <div className="mr-4 relative">
                <div className="absolute inset-0 bg-white rounded-full blur-sm opacity-20"></div>
                <Image
                  src="/assets/lgo.png"
                  alt="WellZone Logo"
                  width={48}
                  height={48}
                  className="relative z-10 hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  WellZone Lanka
                </div>
                <div className="text-xs font-medium text-blue-200 tracking-wide mt-1">
                  WELLNESS COMPANION
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements - more subtle for transparency */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/50 to-cyan-400/50"></div>
        </div>

        {/* Main Menu Items */}
        <div className="px-6 pt-8 pb-6 flex-1 relative z-10">
          <div className="mb-6">
            <NavItemEnhanced
              icon={<Home className="h-5 w-5" />}
              text="Home"
              subtext="Return to main dashboard"
              onClick={navigateToHome}
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-4">
              Our Services
            </h3>
            <div className="space-y-4">
              <NavItemEnhanced
                icon={<Calendar className="h-5 w-5" />}
                text="Book Fitness Trainer"
                subtext="Schedule your personalized workout session"
                onClick={navigateToTrainer}
              />
              <NavItemEnhanced
                icon={<Phone className="h-5 w-5" />}
                text="Consult with Doctors"
                subtext="Get expert medical advice and care"
                onClick={navigateToDoctor}
              />
            </div>
          </div>
        </div>

        {/* Footer with brand message - Made more transparent */}
        <div className="mt-auto mb-0 relative z-10">
          <div className="px-6 py-4 rounded-b-3xl bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-t border-blue-500/10">
            <div className="text-center">
              <p className="text-xs text-blue-200 mb-1 font-medium">
                Your wellness journey starts here
              </p>
              <div className="text-xs text-blue-300 opacity-60 italic pb-1">
                "Health is the greatest gift, contentment the greatest wealth"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced sidebar trigger - More transparent */}
      <div
        ref={triggerRef}
        className="fixed top-1/2 left-0 transform -translate-y-1/2 z-30 cursor-pointer"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/70 to-cyan-400/70 rounded-r-lg blur opacity-30 group-hover:opacity-70 transition duration-200"></div>
          <div className="relative bg-gradient-to-r from-blue-600/80 to-cyan-500/80 backdrop-blur-md h-12 w-6 rounded-r-lg flex items-center justify-center transition-all duration-300 group-hover:w-8">
            {isOpen ? (
              <ChevronLeft className="h-5 w-5 text-white" />
            ) : (
              <ChevronRight className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced Navigation Item Component - Adapted for transparent design
const NavItemEnhanced = ({ icon, text, subtext, onClick }) => {
  return (
    <div className="group relative" onClick={onClick}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-200"></div>
      <div className="relative p-4 rounded-xl bg-blue-900/30 hover:bg-blue-800/40 border border-white/10 group-hover:border-blue-400/30 cursor-pointer transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="mr-4 p-3 rounded-lg bg-blue-800/30 text-blue-300 group-hover:text-cyan-300 transition-colors duration-300 border border-white/10">
            {icon}
          </div>
          <div className="flex-1">
            <div className="font-medium text-white group-hover:text-cyan-50">
              {text}
            </div>
            {subtext && <div className="text-xs text-blue-300 mt-1 pr-6">{subtext}</div>}
          </div>
          <ArrowRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
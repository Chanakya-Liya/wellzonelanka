"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  User, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Activity,
  Search,
  Filter,
  Clock,
  MapPin,
  Dumbbell
} from "lucide-react";

export default function TrainerAppointments() {
  const [trainerName, setTrainerName] = useState("Test Trainer");
  const [trainerEmail, setTrainerEmail] = useState("trainer@gmail.com");
  const [activeTab, setActiveTab] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get trainer data from localStorage if available
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.firstName && userData.lastName) {
        setTrainerName(`${userData.firstName} ${userData.lastName}`);
      }
      if (userData.email) {
        setTrainerEmail(userData.email);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/auth/login';
  };

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      clientName: "John Smith",
      clientEmail: "john.smith@email.com",
      sessionType: "Personal Training",
      date: "2025-09-16",
      time: "9:00 AM",
      duration: "60 min",
      location: "Gym Floor A",
      status: "confirmed",
      clientAge: 28,
      goals: "Weight Loss, Muscle Building"
    },
    {
      id: 2,
      clientName: "Maria Garcia",
      clientEmail: "maria.garcia@email.com",
      sessionType: "Strength Training",
      date: "2025-09-16",
      time: "11:00 AM",
      duration: "45 min",
      location: "Weight Room",
      status: "confirmed",
      clientAge: 32,
      goals: "Strength Building"
    },
    {
      id: 3,
      clientName: "David Wilson",
      clientEmail: "david.wilson@email.com",
      sessionType: "Cardio Training",
      date: "2025-09-17",
      time: "2:00 PM",
      duration: "30 min",
      location: "Cardio Zone",
      status: "pending",
      clientAge: 25,
      goals: "Endurance, Weight Loss"
    },
    {
      id: 4,
      clientName: "Sarah Johnson",
      clientEmail: "sarah.johnson@email.com",
      sessionType: "Weight Loss Program",
      date: "2025-09-18",
      time: "4:00 PM",
      duration: "60 min",
      location: "Training Studio",
      status: "confirmed",
      clientAge: 29,
      goals: "Weight Loss, Toning"
    },
    {
      id: 5,
      clientName: "Mike Brown",
      clientEmail: "mike.brown@email.com",
      sessionType: "HIIT Training",
      date: "2025-09-15",
      time: "10:00 AM",
      duration: "45 min",
      location: "Functional Area",
      status: "completed",
      clientAge: 35,
      goals: "Fat Loss, Conditioning"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    return appointments.filter(appointment => {
      const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.sessionType.toLowerCase().includes(searchTerm.toLowerCase());
      
      switch (activeTab) {
        case 'today':
          return matchesSearch && appointment.date === today;
        case 'upcoming':
          return matchesSearch && appointment.date > today;
        case 'past':
          return matchesSearch && appointment.date < today;
        case 'all':
        default:
          return matchesSearch;
      }
    });
  };

  const filteredAppointments = filterAppointments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Dashboard Container with top padding for fixed navbar */}
      <div className="flex pt-20 min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200">
          <div className="p-6 h-full flex flex-col">
            {/* User Profile */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{trainerName}</h3>
                <p className="text-sm text-gray-500">{trainerEmail}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              <Link href="/trainer-dashboard" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Activity className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/trainer-dashboard/my-appointments" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">My Appointments</span>
              </Link>
              <Link href="/trainer-dashboard/my-sessions" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Dumbbell className="w-5 h-5" />
                <span>My Sessions</span>
              </Link>
              <Link href="/trainer-dashboard/my-clients" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="w-5 h-5" />
                <span>My Clients</span>
              </Link>
              <Link href="/trainer-dashboard/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </nav>

            {/* Logout Button */}
            <div className="mt-auto">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600 mt-2">Manage your training appointments and client sessions</p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clients or session types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'today', label: 'Today' },
                  { id: 'upcoming', label: 'Upcoming' },
                  { id: 'past', label: 'Past' },
                  { id: 'all', label: 'All' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-cyan-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAppointments.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments found</p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.clientName}</h3>
                          <p className="text-sm text-gray-500">{appointment.clientEmail}</p>
                          <p className="text-xs text-gray-500">Age: {appointment.clientAge}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Session Type:</span>
                        <span className="text-sm text-gray-900">{appointment.sessionType}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time} ({appointment.duration})</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>

                      <div className="border-t border-gray-100 pt-3">
                        <span className="text-sm font-medium text-gray-700">Goals: </span>
                        <span className="text-sm text-gray-600">{appointment.goals}</span>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium">
                          View Details
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
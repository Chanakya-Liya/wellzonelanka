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
  ArrowLeft,
  Search,
  Filter,
  Phone,
  Mail,
  Clock,
  MoreHorizontal
} from "lucide-react";

export default function MySessions() {
  const [doctorName, setDoctorName] = useState("Test Doctor");
  const [doctorEmail, setDoctorEmail] = useState("doctor@gmail.com");
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState("Today");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Set current date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setCurrentDate(formattedDate);

    // Get doctor data from localStorage if available
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.firstName && userData.lastName) {
        setDoctorName(`${userData.firstName} ${userData.lastName}`);
      }
      if (userData.email) {
        setDoctorEmail(userData.email);
      }
    }
  }, []);

  // Mock sessions data
  const sessions = [
    {
      id: 1,
      patientName: "Tharidu Johnson",
      sessionId: "Session 8/12",
      time: "9:00 AM",
      duration: "(01 Hour)",
      email: "tharidu@gmail.com",
      phone: "+94 75 084 5396",
      status: "Confirmed",
      type: "Consultation",
      notes: "Notes: Patients showed significant progress in anxiety management techniques. Discussing coping strategies for work-related stress.",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      patientName: "Tharidu Johnson",
      sessionId: "Session 9/12",
      time: "9:00 AM",
      duration: "(01 Hour)",
      email: "tharidu@gmail.com",
      phone: "+94 75 084 5396",
      status: "Confirmed",
      type: "Consultation",
      notes: "Notes: Patients showed significant progress in anxiety management techniques. Discussing coping strategies for work-related stress.",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      patientName: "Tharidu Johnson",
      sessionId: "Session 6/12",
      time: "9:00 AM",
      duration: "(01 Hour)",
      email: "tharidu@gmail.com",
      phone: "+94 75 084 5396",
      status: "Completed",
      type: "Follow-up",
      notes: "Notes: Patients showed significant progress in anxiety management techniques. Discussing coping strategies for work-related stress.",
      statusColor: "bg-red-100 text-red-800"
    },
    {
      id: 4,
      patientName: "Tharidu Johnson",
      sessionId: "Session 8/12",
      time: "9:00 AM",
      duration: "(01 Hour)",
      email: "tharidu@gmail.com",
      phone: "+94 75 084 5396",
      status: "Upcoming",
      type: "Assessment",
      notes: "Notes: Patients showed significant progress in anxiety management techniques. Discussing coping strategies for work-related stress.",
      statusColor: "bg-blue-100 text-blue-800"
    }
  ];

  const tabs = ["Today", "Upcoming", "Past", "All"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-red-100 text-red-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/auth/login';
  };

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
                <h3 className="font-semibold text-gray-900">{doctorName}</h3>
                <p className="text-sm text-gray-500">{doctorEmail}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              <Link href="/doctor-dashboard" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/doctor-dashboard/my-appointments" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>My Appointments</span>
              </Link>
              <Link href="/doctor-dashboard/my-sessions" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5" />
                <span className="font-medium">My Sessions</span>
              </Link>
              <Link href="/doctor-dashboard/my-patients" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="w-5 h-5" />
                <span>My Patients</span>
              </Link>
              <Link href="/doctor-dashboard/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
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

        {/* Main Content - My Sessions */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="font-semibold text-gray-900">{currentDate}</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              New Session
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-200 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Patient Avatar */}
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    {/* Session Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{session.patientName}</h3>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                          {session.sessionId}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.time}</span>
                          <span className="text-gray-400">{session.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{session.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{session.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.type === "Consultation" ? "bg-gray-100 text-gray-800" :
                          session.type === "Follow-up" ? "bg-purple-100 text-purple-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {session.type}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">{session.notes}</p>
                    </div>
                  </div>

                  {/* More Options */}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
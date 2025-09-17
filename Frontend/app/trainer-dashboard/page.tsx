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
  TrendingUp,
  Clock,
  Dumbbell
} from "lucide-react";

export default function TrainerDashboard() {
  const [trainerName, setTrainerName] = useState("Test Trainer");
  const [trainerEmail, setTrainerEmail] = useState("trainer@gmail.com");

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

  // Mock data for dashboard stats
  const stats = [
    { title: "Profile Views", value: "156", icon: User, color: "bg-blue-500" },
    { title: "Total Clients", value: "85", icon: Users, color: "bg-green-500" },
    { title: "New Bookings", value: "12", icon: Calendar, color: "bg-yellow-500" },
    { title: "Today Sessions", value: "4", icon: Dumbbell, color: "bg-purple-500" },
  ];

  // Mock upcoming sessions data
  const upcomingSessions = [
    {
      id: 1,
      clientName: "John Smith",
      sessionType: "Personal Training",
      time: "9:00 AM",
      duration: "60 min",
      status: "confirmed"
    },
    {
      id: 2,
      clientName: "Maria Garcia",
      sessionType: "Strength Training",
      time: "11:00 AM", 
      duration: "45 min",
      status: "confirmed"
    },
    {
      id: 3,
      clientName: "David Wilson",
      sessionType: "Cardio Training",
      time: "2:00 PM",
      duration: "30 min",
      status: "pending"
    },
    {
      id: 4,
      clientName: "Sarah Johnson",
      sessionType: "Weight Loss Program",
      time: "4:00 PM",
      duration: "60 min",
      status: "confirmed"
    }
  ];

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
              <Link href="/trainer-dashboard" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link href="/trainer-dashboard/my-appointments" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>My Appointments</span>
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
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {trainerName.split(' ')[0]}!</h1>
              <p className="text-gray-600 mt-2">Here's your training overview for today</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Today's Training Sessions</h2>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Updated just now</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No sessions scheduled for today</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Session Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {upcomingSessions.map((session) => (
                          <tr key={session.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                  <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {session.clientName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {session.sessionType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {session.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {session.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                session.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : session.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-cyan-600 hover:text-cyan-900">Start Session</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
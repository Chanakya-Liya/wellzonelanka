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
  Eye,
  CalendarDays,
  Activity,
  Search
} from "lucide-react";

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("Test Doctor");
  const [doctorEmail, setDoctorEmail] = useState("doctor@gmail.com");
  const [currentDate, setCurrentDate] = useState("");

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
            <Link href="/doctor-dashboard" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/doctor-dashboard/my-appointments" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5" />
              <span>My Appointments</span>
            </Link>
            <Link href="/doctor-dashboard/my-sessions" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Activity className="w-5 h-5" />
              <span>My Sessions</span>
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Today's Date</p>
            <p className="font-semibold text-gray-900">{currentDate}</p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gray-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-600 mb-2">Welcome!</p>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{doctorName}.</h2>
          <p className="text-gray-700 mb-4">
            Thanks for joining with us. We are always trying to get you a complete service.<br />
            You can view your daily schedule, Reach Patients Appointment at home!
          </p>
          <Link href="/doctor-dashboard/my-appointments">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              View My Appointments
            </button>
          </Link>
        </div>

        {/* Stats and Sessions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Profile Views */}
              <div className="bg-blue-50 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">1</span>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>

              {/* All Patients */}
              <div className="bg-green-50 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">100</span>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Search className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">All Patients</p>
              </div>

              {/* New Booking */}
              <div className="bg-purple-50 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">5</span>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Search className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">New Booking</p>
              </div>

              {/* Today Sessions */}
              <div className="bg-orange-50 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">2</span>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Search className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">Today Sessions</p>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Up Coming Sessions until Next Week</h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Online</div>
                        <div className="text-sm text-gray-500">Amanda</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Today</div>
                      <div className="text-sm text-gray-500">10/10/205</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      1:30PM
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Online</div>
                        <div className="text-sm text-gray-500">Amanda</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Today</div>
                      <div className="text-sm text-gray-500">10/10/205</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      5:00PM
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
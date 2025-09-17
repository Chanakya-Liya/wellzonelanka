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
  Phone,
  Mail,
  MessageCircle,
  TrendingUp,
  Target,
  Clock,
  Dumbbell,
  Award,
  FileText
} from "lucide-react";

export default function TrainerClients() {
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

  // Mock clients data
  const clients = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      age: 28,
      joinDate: "2025-01-15",
      goals: "Weight Loss, Muscle Building",
      currentWeight: "180 lbs",
      targetWeight: "165 lbs",
      progress: 65,
      totalSessions: 24,
      completedSessions: 18,
      nextSession: "2025-09-17",
      status: "active",
      achievements: ["30 Days Streak", "10lb Weight Loss"],
      notes: "Very motivated client. Showing excellent progress with consistent attendance."
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1 (555) 987-6543",
      age: 32,
      joinDate: "2024-11-20",
      goals: "Strength Building, Endurance",
      currentWeight: "140 lbs",
      targetWeight: "145 lbs",
      progress: 80,
      totalSessions: 36,
      completedSessions: 32,
      nextSession: "2025-09-18",
      status: "active",
      achievements: ["Strength PR", "60 Days Streak", "Deadlift 200lbs"],
      notes: "Exceptional dedication. Has achieved multiple personal records in strength training."
    },
    {
      id: 3,
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "+1 (555) 456-7890",
      age: 25,
      joinDate: "2025-02-10",
      goals: "Endurance, Weight Loss",
      currentWeight: "200 lbs",
      targetWeight: "175 lbs",
      progress: 40,
      totalSessions: 16,
      completedSessions: 12,
      nextSession: "2025-09-19",
      status: "active",
      achievements: ["First 5K Run"],
      notes: "Working on building cardiovascular endurance. Needs encouragement with consistency."
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 321-0987",
      age: 29,
      joinDate: "2024-12-05",
      goals: "Weight Loss, Toning",
      currentWeight: "155 lbs",
      targetWeight: "135 lbs",
      progress: 90,
      totalSessions: 42,
      completedSessions: 40,
      nextSession: "2025-09-20",
      status: "active",
      achievements: ["20lb Weight Loss", "90 Days Streak", "Marathon Ready"],
      notes: "Incredible transformation! Close to achieving target weight. Excellent role model."
    },
    {
      id: 5,
      name: "Mike Brown",
      email: "mike.brown@email.com",
      phone: "+1 (555) 654-3210",
      age: 35,
      joinDate: "2024-10-15",
      goals: "Fat Loss, Muscle Gain",
      currentWeight: "190 lbs",
      targetWeight: "180 lbs",
      progress: 25,
      totalSessions: 20,
      completedSessions: 8,
      nextSession: "No upcoming session",
      status: "inactive",
      achievements: [],
      notes: "Has been inactive for 2 weeks. May need follow-up to re-engage with training program."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeClients = clients.filter(client => client.status === 'active');
  const inactiveClients = clients.filter(client => client.status === 'inactive');

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
              <Link href="/trainer-dashboard/my-appointments" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>My Appointments</span>
              </Link>
              <Link href="/trainer-dashboard/my-sessions" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Dumbbell className="w-5 h-5" />
                <span>My Sessions</span>
              </Link>
              <Link href="/trainer-dashboard/my-clients" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5" />
                <span className="font-medium">My Clients</span>
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
              <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
              <p className="text-gray-600 mt-2">Manage your clients and track their fitness progress</p>
            </div>

            {/* Client Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clients</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{clients.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Clients</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{activeClients.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {Math.round(clients.reduce((acc, client) => acc + client.progress, 0) / clients.length)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {clients.map((client) => (
                <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Client Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{client.name}</h3>
                          <p className="text-sm text-gray-500">Age: {client.age} • Member since {new Date(client.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Goals:</span>
                        <p className="font-medium text-gray-900">{client.goals}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Next Session:</span>
                        <p className="font-medium text-gray-900">
                          {client.nextSession !== "No upcoming session" 
                            ? new Date(client.nextSession).toLocaleDateString() 
                            : client.nextSession}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Fitness Progress</span>
                      <span className="text-sm text-gray-500">{client.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${client.progress}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Current Weight:</span>
                        <p className="font-medium text-gray-900">{client.currentWeight}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Target Weight:</span>
                        <p className="font-medium text-gray-900">{client.targetWeight}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Sessions:</span>
                        <p className="font-medium text-gray-900">{client.completedSessions}/{client.totalSessions}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Attendance:</span>
                        <p className="font-medium text-gray-900">{Math.round((client.completedSessions / client.totalSessions) * 100)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {client.achievements.length > 0 && (
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        Recent Achievements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {client.achievements.map((achievement, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      Trainer Notes
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{client.notes}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm">
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <FileText className="w-4 h-4" />
                        <span>Records</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {clients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No clients found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
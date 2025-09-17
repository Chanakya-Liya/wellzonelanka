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
  Clock,
  Play,
  Pause,
  MessageCircle,
  Phone,
  Dumbbell,
  Target,
  TrendingUp
} from "lucide-react";

export default function TrainerSessions() {
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

  // Mock training sessions data
  const sessions = [
    {
      id: "TS001",
      clientName: "John Smith",
      clientAvatar: "/api/placeholder/40/40",
      sessionType: "Personal Training",
      startTime: "9:00 AM",
      duration: "60 min",
      status: "active",
      progress: 75,
      exercises: ["Push-ups", "Squats", "Deadlifts"],
      currentExercise: "Squats",
      notes: "Client showing great improvement in form. Focus on increasing weight next session.",
      heartRate: "145 bpm",
      caloriesBurned: "320 cal",
      phone: "+1 (555) 123-4567"
    },
    {
      id: "TS002",
      clientName: "Maria Garcia",
      clientAvatar: "/api/placeholder/40/40",
      sessionType: "Strength Training",
      startTime: "11:00 AM",
      duration: "45 min",
      status: "completed",
      progress: 100,
      exercises: ["Bench Press", "Lat Pulldowns", "Shoulder Press"],
      currentExercise: "Completed",
      notes: "Excellent session! Client achieved new personal record on bench press. Very motivated.",
      heartRate: "138 bpm",
      caloriesBurned: "280 cal",
      phone: "+1 (555) 987-6543"
    },
    {
      id: "TS003",
      clientName: "David Wilson",
      clientAvatar: "/api/placeholder/40/40",
      sessionType: "HIIT Training",
      startTime: "2:00 PM",
      duration: "30 min",
      status: "scheduled",
      progress: 0,
      exercises: ["Burpees", "Mountain Climbers", "Jump Squats"],
      currentExercise: "Not started",
      notes: "High intensity interval training focused on fat burning and cardiovascular improvement.",
      heartRate: "0 bpm",
      caloriesBurned: "0 cal",
      phone: "+1 (555) 456-7890"
    },
    {
      id: "TS004",
      clientName: "Sarah Johnson",
      clientAvatar: "/api/placeholder/40/40",
      sessionType: "Weight Loss Program",
      startTime: "4:00 PM",
      duration: "60 min",
      status: "in-progress",
      progress: 45,
      exercises: ["Treadmill", "Cycling", "Core Workout"],
      currentExercise: "Cycling",
      notes: "Client is responding well to cardio-focused routine. Gradual weight loss progress.",
      heartRate: "125 bpm",
      caloriesBurned: "220 cal",
      phone: "+1 (555) 321-0987"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play;
      case 'in-progress': return Activity;
      case 'completed': return Target;
      case 'scheduled': return Clock;
      default: return Clock;
    }
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
              <Link href="/trainer-dashboard/my-sessions" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <Dumbbell className="w-5 h-5" />
                <span className="font-medium">My Sessions</span>
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
              <h1 className="text-3xl font-bold text-gray-900">My Training Sessions</h1>
              <p className="text-gray-600 mt-2">Monitor and manage your active training sessions</p>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {sessions.map((session) => {
                const StatusIcon = getStatusIcon(session.status);
                return (
                  <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Session Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{session.clientName}</h3>
                            <p className="text-sm text-gray-500">Session ID: {session.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Session Type:</span>
                          <p className="font-medium text-gray-900">{session.sessionType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <p className="font-medium text-gray-900">{session.startTime} ({session.duration})</p>
                        </div>
                      </div>
                    </div>

                    {/* Session Progress */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Session Progress</span>
                        <span className="text-sm text-gray-500">{session.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${session.progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Current: <span className="font-medium">{session.currentExercise}</span>
                      </div>
                    </div>

                    {/* Exercises & Metrics */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Today's Exercises</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {session.exercises.map((exercise, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm"
                          >
                            {exercise}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600">Heart Rate:</span>
                          <span className="font-medium">{session.heartRate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-orange-500" />
                          <span className="text-gray-600">Calories:</span>
                          <span className="font-medium">{session.caloriesBurned}</span>
                        </div>
                      </div>
                    </div>

                    {/* Session Notes */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Session Notes</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{session.notes}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6">
                      <div className="flex space-x-3">
                        {session.status === 'scheduled' && (
                          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                            <Play className="w-4 h-4" />
                            <span>Start Session</span>
                          </button>
                        )}
                        {(session.status === 'active' || session.status === 'in-progress') && (
                          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            <Pause className="w-4 h-4" />
                            <span>Pause Session</span>
                          </button>
                        )}
                        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Phone className="w-4 h-4" />
                          <span>Call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sessions.length === 0 && (
              <div className="text-center py-12">
                <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No training sessions scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
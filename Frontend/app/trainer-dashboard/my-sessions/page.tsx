"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from '@/app/Footer';
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
  TrendingUp,
  Video
} from "lucide-react";

export default function TrainerSessions() {
  const [trainerName, setTrainerName] = useState("Test Trainer");
  const [trainerEmail, setTrainerEmail] = useState("trainer@gmail.com");
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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
      if (userData.id) {
        setTrainerId(userData.id);
      }
    }
  }, []);

  useEffect(() => {
    if (trainerId) {
      fetchSessions();
    }
  }, [trainerId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/trainer-appointments/${trainerId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter for today and active sessions only, and add session management data
          const today = new Date().toISOString().split('T')[0];
          const formattedSessions = data.appointments
            .filter((apt: any) => apt.date === today || apt.status === 'Confirmed')
            .map((session: any) => ({
              id: session.id,
              clientName: `${session.userfirstname} ${session.userlastname}`,
              clientAvatar: "/api/placeholder/40/40",
              sessionType: session.sessionType,
              startTime: session.time,
              date: session.date,
              duration: session.duration || '60 min',
              status: session.date === today && session.status === 'Confirmed' ? 'active' : 
                     session.status === 'Completed' ? 'completed' : 
                     session.date > today ? 'scheduled' : 'completed',
              progress: session.status === 'Completed' ? 100 : 
                       session.date === today ? Math.floor(Math.random() * 60) + 20 : 0,
              exercises: getSessionExercises(session.sessionType),
              currentExercise: session.status === 'Completed' ? 'Completed' : 
                              session.date === today ? getSessionExercises(session.sessionType)[0] : 'Not started',
              notes: session.userdescription || `Session focused on ${session.goals || 'general fitness'}.`,
              heartRate: session.date === today ? `${Math.floor(Math.random() * 50) + 120} bpm` : '0 bpm',
              caloriesBurned: session.status === 'Completed' ? `${Math.floor(Math.random() * 200) + 200} cal` : 
                             session.date === today ? `${Math.floor(Math.random() * 100) + 100} cal` : '0 cal',
              phone: session.userphonenumber,
              userEmail: session.userEmail,
              goals: session.goals
            }));
          
          setSessions(formattedSessions);
        }
      } else {
        console.error('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSessionExercises = (sessionType: string) => {
    const exerciseMap: { [key: string]: string[] } = {
      'Personal Training': ['Push-ups', 'Squats', 'Deadlifts', 'Planks'],
      'Strength Training': ['Bench Press', 'Lat Pulldowns', 'Shoulder Press', 'Rows'],
      'HIIT Training': ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees'],
      'Cardio Training': ['Treadmill', 'Cycling', 'Elliptical', 'Rowing'],
      'Weight Loss Program': ['Cardio Circuit', 'Core Workout', 'Light Weights', 'Stretching'],
      'Functional Training': ['Kettlebell Swings', 'Battle Ropes', 'Box Jumps', 'TRX']
    };
    
    return exerciseMap[sessionType] || ['Warm-up', 'Main Exercise', 'Cool-down'];
  };

  // Check if session is within 5 minutes before and 1 hour after (65 minutes total)
  const isSessionStartingSoon = (session: any) => {
    const sessionDate = new Date(session.date);
    const currentDate = new Date(currentTime);
    
    // Check if dates match (same day)
    const isSameDay = 
      sessionDate.getFullYear() === currentDate.getFullYear() &&
      sessionDate.getMonth() === currentDate.getMonth() &&
      sessionDate.getDate() === currentDate.getDate();
    
    if (!isSameDay) return false;
    
    // Parse session time (assuming format like "10:00 AM" or "14:30")
    const timeStr = session.startTime.trim();
    let hours = 0;
    let minutes = 0;
    
    // Handle 12-hour format with AM/PM
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      const isPM = timeStr.includes('PM');
      const timeParts = timeStr.replace(/AM|PM/gi, '').trim().split(':');
      hours = parseInt(timeParts[0]);
      minutes = parseInt(timeParts[1] || '0');
      
      // Convert to 24-hour format
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    } else {
      // Handle 24-hour format
      const timeParts = timeStr.split(':');
      hours = parseInt(timeParts[0]);
      minutes = parseInt(timeParts[1] || '0');
    }
    
    // Create session datetime
    const sessionDateTime = new Date(sessionDate);
    sessionDateTime.setHours(hours, minutes, 0, 0);
    
    // Calculate time difference in minutes
    const timeDiffMs = sessionDateTime.getTime() - currentTime.getTime();
    const timeDiffMinutes = timeDiffMs / (1000 * 60);
    
    // Check if within 5 minutes before or 60 minutes after (65 minutes total window)
    return timeDiffMinutes >= -60 && timeDiffMinutes <= 5;
  };

  const handleJoinMeeting = (sessionId: string) => {
    window.location.href = `https://meet.jit.si/${sessionId}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/auth/login';
  };

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
              <p className="text-sm text-gray-500 mt-1">Current Time: {currentTime.toLocaleTimeString()}</p>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No training sessions scheduled</p>
                </div>
              ) : (
                sessions.map((session: any) => {
                  const StatusIcon = getStatusIcon(session.status);
                  const showMeetingButton = isSessionStartingSoon(session);
                  
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
                            {showMeetingButton && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                Join Available
                              </span>
                            )}
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
                        <h4 className="font-medium text-gray-900 mb-3">Session Exercises</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {session.exercises.map((exercise: string, index: number) => (
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
                        <div className="flex flex-col space-y-3">
                          {showMeetingButton && (
                            <button 
                              onClick={() => handleJoinMeeting(session.id)}
                              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              <Video className="w-5 h-5" />
                              <span>Go to Meet</span>
                            </button>
                          )}
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
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
     <Footer />  
    </div>
  );
}
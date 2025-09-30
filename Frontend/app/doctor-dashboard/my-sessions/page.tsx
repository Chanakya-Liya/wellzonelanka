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
  ArrowLeft,
  Search,
  Filter,
  Phone,
  Mail,
  Clock,
  MoreHorizontal,
  Video
} from "lucide-react";
import { 
  getDoctorAppointments, 
  getDoctorTodayAppointments, 
  getDoctorUpcomingAppointments, 
  getDoctorPastAppointments,
  Appointment 
} from "../../../lib/services/appointmentService";

export default function MySessions() {
  const [doctorName, setDoctorName] = useState("Test Doctor");
  const [doctorEmail, setDoctorEmail] = useState("doctor@gmail.com");
  const [doctorId, setDoctorId] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState("Today");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessions, setSessions] = useState<Appointment[]>([]);
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
    const initializeSessions = async () => {
      try {
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
          if (userData.id) {
            setDoctorId(userData.id);
            
            // Fetch sessions (confirmed appointments) based on active tab
            await loadSessions(userData.id, activeTab);
          }
        } else {
          // Simulate doctor login for testing
          console.log('🧪 No user in localStorage, simulating doctor login...');
          const testDoctorId = 'eNRqpc8os8MBgoBe9vKi';
          const testDoctorData = {
            id: testDoctorId,
            firstName: 'Test',
            lastName: 'Doctor',
            email: 'doctor@gmail.com'
          };
          
          localStorage.setItem('currentUser', JSON.stringify(testDoctorData));
          setDoctorId(testDoctorId);
          setDoctorName('Test Doctor');
          setDoctorEmail('doctor@gmail.com');
          
          // Fetch sessions data
          await loadSessions(testDoctorId, activeTab);
        }
      } catch (error) {
        console.error('Error initializing sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSessions();
  }, [activeTab]);

  const loadSessions = async (doctorId: string, tab: string) => {
    try {
      setLoading(true);
      let sessionsData: Appointment[] = [];

      switch (tab) {
        case "Today":
          sessionsData = await getDoctorTodayAppointments(doctorId);
          break;
        case "Upcoming":
          sessionsData = await getDoctorUpcomingAppointments(doctorId);
          break;
        case "Past":
          sessionsData = await getDoctorPastAppointments(doctorId);
          break;
        case "All":
          sessionsData = await getDoctorAppointments(doctorId);
          break;
        default:
          sessionsData = await getDoctorTodayAppointments(doctorId);
      }

      // Filter for confirmed appointments only (these are considered "sessions")
      const confirmedSessions = sessionsData.filter(session => 
        session.status === 'Confirmed' || session.status === 'Completed'
      );

      setSessions(confirmedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if session is within 5 minutes
  const isSessionStartingSoon = (session: Appointment) => {
    const sessionDate = new Date(session.date);
    const currentDate = new Date(currentTime);
    
    // Check if dates match (same day)
    const isSameDay = 
      sessionDate.getFullYear() === currentDate.getFullYear() &&
      sessionDate.getMonth() === currentDate.getMonth() &&
      sessionDate.getDate() === currentDate.getDate();
    
    if (!isSameDay) return false;
    
    // Parse session time (assuming format like "10:00 AM" or "14:30")
    const timeStr = session.time.trim();
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
    
    // Check if within 5 minutes before or after
    return timeDiffMinutes >= -5 && timeDiffMinutes <= 5;
  };

  const handleJoinMeeting = (sessionId: string) => {
    window.location.href = `https://meet.jit.si/${sessionId}`;
  };

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (doctorId) {
      loadSessions(doctorId, tab);
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

          {/* Debug Information */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Debug Information</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>Doctor ID: {doctorId || "Not set"}</p>
              <p>Active Tab: {activeTab}</p>
              <p>Loading: {loading.toString()}</p>
              <p>Sessions Count: {sessions.length}</p>
              <p>Current Date: {currentDate}</p>
              <p>Current Time: {currentTime.toLocaleTimeString()}</p>
              {sessions.length > 0 && (
                <div className="mt-2">
                  <p><strong>Sample Session Dates:</strong></p>
                  {sessions.slice(0, 3).map(session => (
                    <p key={session.id} className="ml-2">
                      - {session.userfirstname}: {session.date} at {session.time} (Status: {session.status})
                    </p>
                  ))}
                </div>
              )}
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
                  className="pl-10 pr-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
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
                onClick={() => handleTabChange(tab)}
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
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading sessions...</p>
              </div>
            ) : sessions.length > 0 ? (
              sessions.map((session, index) => (
                <div key={session.id} className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Patient Avatar */}
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      
                      {/* Session Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {session.userfirstname} {session.userlastname}
                          </h3>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                            Session #{index + 1}
                          </span>
                          {isSessionStartingSoon(session) && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                              Starting Soon
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.time}</span>
                            <span className="text-gray-400">({session.serviceType})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{session.userEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{session.userphonenumber}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status || 'Confirmed')}`}>
                            {session.status || 'Confirmed'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.serviceType === "Consultation" ? "bg-gray-100 text-gray-800" :
                            session.serviceType === "Follow-up" ? "bg-purple-100 text-purple-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {session.serviceType}
                          </span>
                          <span className="text-xs text-gray-500">
                            {session.date}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">{session.userdescription}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      {isSessionStartingSoon(session) && (
                        <button 
                          onClick={() => handleJoinMeeting(session.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2 whitespace-nowrap"
                        >
                          <Video className="w-4 h-4" />
                          <span>Go to Meet</span>
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No sessions found for {activeTab.toLowerCase()}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    <Footer />
    </div>
  );
}
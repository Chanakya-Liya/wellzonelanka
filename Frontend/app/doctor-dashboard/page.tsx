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
import { 
  getDoctorAppointments, 
  getDoctorTodayAppointments, 
  getDoctorUpcomingAppointments, 
  getDoctorPastAppointments,
  getDoctorAppointmentStats,
  getAllAppointments,
  Appointment 
} from "../../lib/services/appointmentService";
import { getTodayString } from "../../lib/utils/dateUtils";

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("Test Doctor");
  const [doctorEmail, setDoctorEmail] = useState("doctor@gmail.com");
  const [doctorId, setDoctorId] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [stats, setStats] = useState({
    totalPatients: 0,
    newBookings: 0,
    todaySessions: 0,
    profileViews: 1
  });
  const [upcomingSessions, setUpcomingSessions] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
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
            
            // Fetch real data from Firebase
            try {
              console.log('🔍 Fetching dashboard data for doctorId:', userData.id);
              const [statsData, upcomingAppointments] = await Promise.all([
                getDoctorAppointmentStats(userData.id),
                getDoctorUpcomingAppointments(userData.id)
              ]);
              
              console.log('📊 Stats data:', statsData);
              console.log('📅 Upcoming appointments:', upcomingAppointments);
              
              setStats(statsData);
              setUpcomingSessions(upcomingAppointments.slice(0, 5)); // Show only first 5 upcoming sessions
            } catch (error) {
              console.error('Error fetching dashboard data:', error);
              // Keep default values on error
            }
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
          
          // Fetch real data from Firebase
          try {
            console.log('🔍 Fetching dashboard data for simulated doctorId:', testDoctorId);
            const [statsData, upcomingAppointments] = await Promise.all([
              getDoctorAppointmentStats(testDoctorId),
              getDoctorUpcomingAppointments(testDoctorId)
            ]);
            
            console.log('📊 Stats data:', statsData);
            console.log('📅 Upcoming appointments:', upcomingAppointments);
            
            setStats(statsData);
            setUpcomingSessions(upcomingAppointments.slice(0, 5)); // Show only first 5 upcoming sessions
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Keep default values on error
          }
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
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

        {/* Debug Information */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>Doctor ID: {doctorId || "Not set"}</p>
            <p>Loading: {loading.toString()}</p>
            <p>Upcoming Sessions Count: {upcomingSessions.length}</p>
            <p>Stats: {JSON.stringify(stats)}</p>
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
                  <span className="text-2xl font-bold text-gray-900">{stats.profileViews}</span>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>

              {/* All Patients */}
              <div className="bg-green-50 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{stats.totalPatients}</span>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Search className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">All Patients</p>
              </div>

              {/* New Booking */}
              <div className="bg-purple-50 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{stats.newBookings}</span>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Search className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">New Booking</p>
              </div>

              {/* Today Sessions */}
              <div className="bg-orange-50 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{stats.todaySessions}</span>
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
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                        Loading sessions...
                      </td>
                    </tr>
                  ) : upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => (
                      <tr key={session.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{session.serviceType}</div>
                            <div className="text-sm text-gray-500">{session.userfirstname} {session.userlastname}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(session.date).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : 'Upcoming'}
                          </div>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {session.date === getTodayString() ? 'Today' : 'Upcoming'}
                          </span>
                          <div className="text-sm text-gray-500">{session.date}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.time}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                        No upcoming sessions
                      </td>
                    </tr>
                  )}
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
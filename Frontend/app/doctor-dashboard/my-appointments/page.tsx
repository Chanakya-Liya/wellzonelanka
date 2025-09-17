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
import { 
  getDoctorAppointments, 
  getDoctorTodayAppointments, 
  getDoctorUpcomingAppointments, 
  getDoctorPastAppointments,
  getAllAppointments,
  Appointment 
} from "../../../lib/services/appointmentService";

export default function MyAppointments() {
  const [doctorName, setDoctorName] = useState("Test Doctor");
  const [doctorEmail, setDoctorEmail] = useState("doctor@gmail.com");
  const [doctorId, setDoctorId] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState("Today");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...");

  useEffect(() => {
    const initializeAppointments = async () => {
      try {
        setDebugInfo("Starting initialization...");
        
        // Set current date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setCurrentDate(formattedDate);

        setDebugInfo("Getting localStorage...");
        
        // Get doctor data from localStorage if available
        let currentUser = localStorage.getItem('currentUser');
        
        // TEMPORARY: If no user in localStorage, simulate the doctor from your appointment data
        if (!currentUser) {
          const simulatedDoctor = {
            id: "eNRqpc8os8MBgoBe9vKi",
            email: "anjithasahashya@gmail.com", 
            firstName: "Dr. Anjitha",
            lastName: "Vidyarathna",
            role: "doctor"
          };
          localStorage.setItem('currentUser', JSON.stringify(simulatedDoctor));
          currentUser = JSON.stringify(simulatedDoctor);
          setDebugInfo("Simulated doctor login for testing");
        }
        
        console.log('🔍 Retrieved currentUser from localStorage:', currentUser);
        setDebugInfo(`LocalStorage currentUser: ${currentUser ? 'Found' : 'Not found'}`);
        
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          console.log('👤 Parsed userData:', userData);
          setDebugInfo(`User data: ${JSON.stringify(userData)}`);
          
          if (userData.firstName && userData.lastName) {
            setDoctorName(`${userData.firstName} ${userData.lastName}`);
          }
          if (userData.email) {
            setDoctorEmail(userData.email);
          }
          if (userData.id) {
            console.log('🆔 Setting doctorId to:', userData.id);
            setDoctorId(userData.id);
            setDebugInfo(`Doctor ID set to: ${userData.id}, loading appointments...`);
            
            // Fetch appointments based on active tab
            await loadAppointments(userData.id, activeTab);
          } else {
            console.log('❌ No userData.id found in localStorage');
            setDebugInfo('No user ID found in localStorage');
          }
        } else {
          console.log('❌ No currentUser found in localStorage');
          setDebugInfo('No currentUser found in localStorage');
        }
      } catch (error) {
        console.error('Error initializing appointments:', error);
        setDebugInfo(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    initializeAppointments();
  }, [activeTab]);

  const loadAppointments = async (doctorId: string, tab: string) => {
    try {
      console.log('📅 loadAppointments called with:', { doctorId, tab });
      setDebugInfo(`Loading ${tab} appointments for doctor: ${doctorId}`);
      setLoading(true);
      let appointmentsData: Appointment[] = [];

      switch (tab) {
        case "Today":
          console.log('📅 Fetching today appointments...');
          setDebugInfo(`Fetching today appointments for: ${doctorId}`);
          appointmentsData = await getDoctorTodayAppointments(doctorId);
          break;
        case "Upcoming":
          console.log('📅 Fetching upcoming appointments...');
          setDebugInfo(`Fetching upcoming appointments for: ${doctorId}`);
          appointmentsData = await getDoctorUpcomingAppointments(doctorId);
          break;
        case "Past":
          console.log('📅 Fetching past appointments...');
          setDebugInfo(`Fetching past appointments for: ${doctorId}`);
          appointmentsData = await getDoctorPastAppointments(doctorId);
          break;
        case "All":
          console.log('📅 Fetching all appointments...');
          setDebugInfo(`Fetching ALL appointments for: ${doctorId}`);
          appointmentsData = await getDoctorAppointments(doctorId);
          break;
        default:
          console.log('📅 Fetching today appointments (default)...');
          setDebugInfo(`Fetching today appointments (default) for: ${doctorId}`);
          appointmentsData = await getDoctorTodayAppointments(doctorId);
      }

      console.log('📋 Received appointments data:', appointmentsData);
      setDebugInfo(`Received ${appointmentsData.length} appointments`);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('❌ Error loading appointments:', error);
      setDebugInfo(`Error loading appointments: ${error}`);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["Today", "Upcoming", "Past", "All"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Completed":
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
      loadAppointments(doctorId, tab);
    }
  };

  const debugAllAppointments = async () => {
    console.log('🐛 Debug: Starting comprehensive debug...');
    
    // Check localStorage
    const currentUser = localStorage.getItem('currentUser');
    const selectedDoctor = localStorage.getItem('selectedDoctor');
    
    console.log('🐛 Debug: localStorage currentUser:', currentUser);
    console.log('🐛 Debug: localStorage selectedDoctor:', selectedDoctor);
    
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      console.log('🐛 Debug: Parsed currentUser:', userData);
      console.log('🐛 Debug: Current user ID:', userData.id);
    }
    
    if (selectedDoctor) {
      const doctorData = JSON.parse(selectedDoctor);
      console.log('🐛 Debug: Parsed selectedDoctor:', doctorData);
      console.log('🐛 Debug: Selected doctor ID:', doctorData.id);
    }
    
    // Get all appointments
    console.log('🐛 Debug: Fetching all appointments...');
    const allAppointments = await getAllAppointments();
    console.log('🐛 Debug: All appointments:', allAppointments);
    
    // Check if current user has appointments
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      const myAppointments = allAppointments.filter(apt => apt.doctorId === userData.id);
      console.log('🐛 Debug: My appointments (matching current user ID):', myAppointments);
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
              <Link href="/doctor-dashboard/my-appointments" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">My Appointments</span>
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

        {/* Main Content - My Appointments */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
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
                  placeholder="Search appointments..."
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
              New Appointment
            </button>
            {/* <button 
              onClick={debugAllAppointments}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Debug All Appointments
            </button> */}
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

          {/* Debug Information
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
            <div className="text-sm text-yellow-700">
              <p><strong>Debug Status:</strong> {debugInfo}</p>
              <p><strong>Doctor ID:</strong> {doctorId || 'Not set'}</p>
              <p><strong>Doctor Name:</strong> {doctorName}</p>
              <p><strong>Active Tab:</strong> {activeTab}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Appointments Count:</strong> {appointments.length}</p>
              <p><strong>Current Date:</strong> {currentDate}</p>
            </div>
          </div> */}

          {/* Appointments List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading appointments...</p>
              </div>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Patient Avatar */}
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {appointment.userfirstname} {appointment.userlastname}
                          </h3>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                            <span className="text-gray-400">({appointment.serviceType})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{appointment.userEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{appointment.userphonenumber}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status || 'Pending')}`}>
                            {appointment.status || 'Pending'}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {appointment.serviceType}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(appointment.date).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">{appointment.userdescription}</p>
                      </div>
                    </div>

                    {/* More Options */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No appointments found for {activeTab.toLowerCase()}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
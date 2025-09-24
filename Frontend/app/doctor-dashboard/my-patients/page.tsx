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
  CalendarDays,
  MessageCircle,
  FileText
} from "lucide-react";
import { getDoctorPatients } from "../../../lib/services/appointmentService";

export default function MyPatients() {
  const [doctorName, setDoctorName] = useState("Test Doctor");
  const [doctorEmail, setDoctorEmail] = useState("doctor@gmail.com");
  const [doctorId, setDoctorId] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState("All Patients");
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [allPatients, setAllPatients] = useState<any[]>([]); // Store all patients for filtering
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePatients = async () => {
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
            
            // Fetch patients data
            await loadPatients(userData.id);
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
          
          // Fetch patients data
          await loadPatients(testDoctorId);
        }
      } catch (error) {
        console.error('Error initializing patients:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePatients();
  }, []);

  const loadPatients = async (doctorId: string) => {
    try {
      setLoading(true);
      const patientsData = await getDoctorPatients(doctorId);
      
      console.log('👥 Loaded patients data:', patientsData);
      
      // Store all patients for filtering
      setAllPatients(patientsData);
      
      // Apply current filters
      filterPatients(patientsData, activeTab, searchTerm);
    } catch (error) {
      console.error('Error loading patients:', error);
      setAllPatients([]);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = (patientsData: any[], tab: string, search: string) => {
    let filteredPatients = [...patientsData];
    
    // Filter by tab
    if (tab !== "All Patients") {
      filteredPatients = filteredPatients.filter(patient => patient.status === tab);
    }
    
    // Filter by search term
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredPatients = filteredPatients.filter(patient => 
        patient.patientName.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower) ||
        patient.phone.includes(search)
      );
    }
    
    setPatients(filteredPatients);
  };

  const tabs = ["All Patients", "Active", "New", "Inactive"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-orange-100 text-orange-800";
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
    filterPatients(allPatients, tab, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    filterPatients(allPatients, activeTab, newSearchTerm);
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
              <Link href="/doctor-dashboard/my-sessions" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Activity className="w-5 h-5" />
                <span>My Sessions</span>
              </Link>
              <Link href="/doctor-dashboard/my-patients" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5" />
                <span className="font-medium">My Patients</span>
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

        {/* Main Content - My Patients */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
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
              <p>Patients Count: {patients.length}</p>
              <p>Search Term: {searchTerm || "None"}</p>
              {patients.length > 0 && (
                <div className="mt-2">
                  <p><strong>Sample Patient Appointment Dates:</strong></p>
                  {patients.slice(0, 3).map(patient => (
                    <div key={patient.userId} className="ml-2">
                      <p>- {patient.userfirstname} {patient.userlastname}:</p>
                      {patient.appointments.slice(0, 2).map((apt: any, idx: number) => (
                        <p key={idx} className="ml-4 text-xs">
                          {apt.date} ({apt.serviceType})
                        </p>
                      ))}
                    </div>
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
                  placeholder="Search Patients..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              {/* <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button> */}
            </div>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              Add Patients
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

          {/* Patients List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading patients...</p>
              </div>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
              <div key={patient.id} className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Patient Avatar */}
                    <div className="w-16 h-16 bg-white rounded-lg border border-cyan-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    
                    {/* Patient Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{patient.patientName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Age {patient.age}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarDays className="w-4 h-4" />
                          <span>Last Visit: {patient.lastVisit}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Total Appointments: {patient.totalAppointments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Patient ID: {patient.id}</span>
                        </div>
                      </div>

                      {patient.nextAppointment && (
                        <div className="mb-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Next Appointment: {patient.nextAppointment}
                          </span>
                        </div>
                      )}

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Medical Conditions:</span>
                          <span className="text-gray-600 ml-2">{patient.medicalConditions || "None recorded"}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Allergies:</span>
                          <span className="text-gray-600 ml-2">{patient.allergies || "None recorded"}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Address:</span>
                          <span className="text-gray-600 ml-2">{patient.address || "Not provided"}</span>
                        </div>
                      </div>
                      
                      {/* Recent Appointments */}
                      {patient.appointments && patient.appointments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-cyan-200">
                          <h4 className="font-medium text-gray-700 mb-2">Recent Appointments</h4>
                          <div className="space-y-1">
                            {patient.appointments.slice(0, 3).map((appointment: any, index: number) => (
                              <div key={index} className="text-xs text-gray-600 bg-white p-2 rounded border">
                                <div className="flex justify-between items-center">
                                  <span>{appointment.date} at {appointment.time}</span>
                                  <span className="text-cyan-600 font-medium">{appointment.serviceType}</span>
                                </div>
                                {appointment.description && (
                                  <div className="mt-1 text-gray-500">{appointment.description}</div>
                                )}
                              </div>
                            ))}
                            {patient.appointments.length > 3 && (
                              <div className="text-xs text-gray-500 italic">
                                +{patient.appointments.length - 3} more appointments
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <FileText className="w-4 h-4" />
                      <span>Records</span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No patients found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
     <Footer />
    </div>
  );
}
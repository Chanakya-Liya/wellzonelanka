"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from '@/app/Footer';
import { 
  User, 
  Calendar, 
  Users, 
  Settings as SettingsIcon, 
  LogOut, 
  Activity,
  ArrowLeft,
  Edit,
  Save,
  X
} from "lucide-react";
import { 
  getDoctorProfile,
  submitDoctorProfileChanges,
  getDoctorPendingChanges
} from "../../../lib/services/appointmentService";

export default function DoctorSettings() {
  const [doctorName, setDoctorName] = useState("Test Doctor");
  const [doctorEmail, setDoctorEmail] = useState("doctor@gmail.com");
  const [doctorId, setDoctorId] = useState("");
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const [profileUpdateMessage, setProfileUpdateMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    specialization: "",
    experience: "",
    bio: "",
    address: "",
    education: "",
    certifications: ""
  });

  useEffect(() => {
    const initializeDoctorData = async () => {
      try {
        setLoading(true);
        
        // Get doctor data from localStorage or simulate login
        const currentUser = localStorage.getItem('currentUser');
        let userId = '';
        
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          userId = userData.id;
          setDoctorId(userId);
          if (userData.firstName && userData.lastName) {
            setDoctorName(`${userData.firstName} ${userData.lastName}`);
          }
          if (userData.email) {
            setDoctorEmail(userData.email);
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
          userId = testDoctorId;
        }

        // Fetch doctor profile from Firebase
        if (userId) {
          console.log('🔍 Fetching doctor profile for ID:', userId);
          const doctorProfile = await getDoctorProfile(userId);
          
          if (doctorProfile) {
            console.log('👨‍⚕️ Doctor profile loaded:', doctorProfile);
            setFormData({
              fullName: doctorProfile.fullName || `Dr. ${doctorProfile.firstName} ${doctorProfile.lastName}`,
              firstName: doctorProfile.firstName || "",
              lastName: doctorProfile.lastName || "",
              email: doctorProfile.email || "",
              phone: doctorProfile.phone || "",
              licenseNumber: doctorProfile.licenseNumber || "",
              specialization: doctorProfile.specialization || "",
              experience: doctorProfile.experience || "",
              bio: doctorProfile.bio || "",
              address: doctorProfile.address || "",
              education: doctorProfile.education || "",
              certifications: doctorProfile.certifications || ""
            });
            
            // Update displayed name and email
            setDoctorName(doctorProfile.fullName || `${doctorProfile.firstName} ${doctorProfile.lastName}`);
            setDoctorEmail(doctorProfile.email || "");
          } else {
            console.log('❌ Doctor profile not found, keeping empty fields');
          }

          // Fetch pending changes
          const pendingChangesData = await getDoctorPendingChanges(userId);
          setPendingChanges(pendingChangesData);
          console.log('📋 Pending changes loaded:', pendingChangesData.length);
        }
      } catch (error) {
        console.error('Error initializing doctor data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDoctorData();
  }, []);

  // Separate useEffect for profile update checking
  useEffect(() => {
    if (!doctorId) return;

    // Set up polling to check for approved profile changes
    const checkForProfileUpdates = async () => {
      try {
        console.log('🔄 Checking for profile updates...');
        
        // Fetch latest doctor profile
        const latestProfile = await getDoctorProfile(doctorId);
        
        if (latestProfile && latestProfile.lastProfileUpdate) {
          const lastUpdate = new Date(latestProfile.lastProfileUpdate);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          
          // If profile was updated in the last 5 minutes, refresh the data
          if (lastUpdate > fiveMinutesAgo) {
            console.log('✅ Profile was recently updated, refreshing data...');
            
            // Update form data with latest profile
            setFormData({
              fullName: latestProfile.fullName || `Dr. ${latestProfile.firstName} ${latestProfile.lastName}`,
              firstName: latestProfile.firstName || "",
              lastName: latestProfile.lastName || "",
              email: latestProfile.email || "",
              phone: latestProfile.phone || "",
              licenseNumber: latestProfile.licenseNumber || "",
              specialization: latestProfile.specialization || "",
              experience: latestProfile.experience || "",
              bio: latestProfile.bio || "",
              address: latestProfile.address || "",
              education: latestProfile.education || "",
              certifications: latestProfile.certifications || ""
            });
            
            // Update displayed name and email
            setDoctorName(latestProfile.fullName || `${latestProfile.firstName} ${latestProfile.lastName}`);
            setDoctorEmail(latestProfile.email || "");
            
            // Refresh pending changes
            const pendingChangesData = await getDoctorPendingChanges(doctorId);
            setPendingChanges(pendingChangesData);
            
            // Show success message
            setProfileUpdateMessage('✅ Your profile has been updated! The admin approved your changes.');
            setTimeout(() => setProfileUpdateMessage(null), 10000); // Hide after 10 seconds
          }
        }
      } catch (error) {
        console.error('Error checking for profile updates:', error);
      }
    };

    // Check for updates every 30 seconds
    const updateInterval = setInterval(checkForProfileUpdates, 30000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(updateInterval);
    };
  }, [doctorId]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/auth/login';
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('💾 Submitting profile changes for approval:', formData);
      
      if (!doctorId) {
        console.error('❌ No doctor ID available');
        return;
      }

      // Submit changes for admin approval
      await submitDoctorProfileChanges(doctorId, formData);
      
      console.log('✅ Profile changes submitted successfully');
      setIsEditing(false);
      
      // Refresh pending changes
      const pendingChangesData = await getDoctorPendingChanges(doctorId);
      setPendingChanges(pendingChangesData);
      
      // Show success message (you can replace with a proper toast/notification)
      alert('Profile changes submitted for admin approval!');
      
    } catch (error) {
      console.error('❌ Error submitting profile changes:', error);
      alert('Error submitting changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshProfile = async () => {
    if (!doctorId) return;
    
    try {
      setLoading(true);
      console.log('🔄 Manually refreshing profile data...');
      
      // Fetch latest doctor profile
      const latestProfile = await getDoctorProfile(doctorId);
      
      if (latestProfile) {
        console.log('👨‍⚕️ Latest profile loaded:', latestProfile);
        
        // Update form data with latest profile
        setFormData({
          fullName: latestProfile.fullName || `Dr. ${latestProfile.firstName} ${latestProfile.lastName}`,
          firstName: latestProfile.firstName || "",
          lastName: latestProfile.lastName || "",
          email: latestProfile.email || "",
          phone: latestProfile.phone || "",
          licenseNumber: latestProfile.licenseNumber || "",
          specialization: latestProfile.specialization || "",
          experience: latestProfile.experience || "",
          bio: latestProfile.bio || "",
          address: latestProfile.address || "",
          education: latestProfile.education || "",
          certifications: latestProfile.certifications || ""
        });
        
        // Update displayed name and email
        setDoctorName(latestProfile.fullName || `${latestProfile.firstName} ${latestProfile.lastName}`);
        setDoctorEmail(latestProfile.email || "");
        
        // Check if profile was recently updated
        if (latestProfile.lastProfileUpdate) {
          const lastUpdate = new Date(latestProfile.lastProfileUpdate);
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          
          if (lastUpdate > oneHourAgo) {
            setProfileUpdateMessage('✅ Profile data refreshed! Your profile is up to date.');
            setTimeout(() => setProfileUpdateMessage(null), 5000);
          }
        }
      }
      
      // Refresh pending changes
      const pendingChangesData = await getDoctorPendingChanges(doctorId);
      setPendingChanges(pendingChangesData);
      
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setLoading(false);
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
              <Link href="/doctor-dashboard/my-sessions" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Activity className="w-5 h-5" />
                <span>My Sessions</span>
              </Link>
              <Link href="/doctor-dashboard/my-patients" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="w-5 h-5" />
                <span>My Patients</span>
              </Link>
              <Link href="/doctor-dashboard/settings" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
                <SettingsIcon className="w-5 h-5" />
                <span className="font-medium">Settings</span>
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

        {/* Main Content - Settings */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your profile and account settings</p>
            </div>

            {/* Profile Update Success Message */}
            {profileUpdateMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {profileUpdateMessage}
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        onClick={() => setProfileUpdateMessage(null)}
                        className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                      >
                        <span className="sr-only">Dismiss</span>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading doctor profile...</p>
              </div>
            ) : (
              <>
                {/* Debug Information
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">Debug Information</h3>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>Doctor ID: {doctorId || "Not set"}</p>
                    <p>Active Tab: {activeTab}</p>
                    <p>Is Editing: {isEditing.toString()}</p>
                    <p>Pending Changes: {pendingChanges.length}</p>
                  </div>
                </div> */}

            {/* Settings Tabs */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-white text-cyan-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('changes')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'changes'
                      ? 'bg-white text-cyan-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pending Changes
                </button>
              </div>
            </div>

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Doctor Profile</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-gray-600">Update your professional information</p>
                        {formData.firstName && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Profile Active
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleRefreshProfile}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isEditing
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-cyan-600 text-white hover:bg-cyan-700'
                        }`}
                      >
                        {isEditing ? (
                          <>
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4" />
                            <span>Edit Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 text-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formData.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formData.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formData.phone}</p>
                      )}
                    </div>

                    {/* License Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical License Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formData.licenseNumber}</p>
                      )}
                    </div>

                    {/* Specialization */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.specialization}
                          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formData.specialization}</p>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formData.experience} years</p>
                      )}
                    </div>
                  </div>

                  {/* Professional Bio */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Write a brief professional bio..."
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[100px]">{formData.bio}</p>
                    )}
                  </div>

                  {/* Practice Address */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Practice Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter your practice address..."
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg whitespace-pre-line">{formData.address}</p>
                    )}
                  </div>

                  {/* Education */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.education}
                        onChange={(e) => setFormData({...formData, education: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="List your medical education..."
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg whitespace-pre-line">{formData.education}</p>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.certifications}
                        onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="List your certifications..."
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg whitespace-pre-line">{formData.certifications}</p>
                    )}
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Submitting...' : 'Submit for Approval'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pending Changes Tab */}
            {activeTab === 'changes' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Pending Changes</h2>
                      <p className="text-gray-600 mt-1">Review changes waiting for approval</p>
                    </div>
                    <button
                      onClick={handleRefreshProfile}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {pendingChanges.length > 0 ? (
                    <div className="space-y-4">
                      {pendingChanges.map((change) => (
                        <div key={change.id} className={`border rounded-lg p-4 ${
                          change.status === 'approved' ? 'border-green-200 bg-green-50' :
                          change.status === 'rejected' ? 'border-red-200 bg-red-50' :
                          'border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">Profile Update Request</h3>
                              <p className="text-sm text-gray-500">Submitted: {new Date(change.submittedAt).toLocaleDateString()}</p>
                              {change.reviewedAt && (
                                <p className="text-sm text-gray-500">Reviewed: {new Date(change.reviewedAt).toLocaleDateString()}</p>
                              )}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              change.status === 'approved' ? 'bg-green-100 text-green-800' :
                              change.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              change.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {change.status === 'approved' ? '✅ Approved' :
                               change.status === 'rejected' ? '❌ Rejected' :
                               change.status === 'pending' ? '⏳ Pending' :
                               change.status}
                            </span>
                          </div>
                          
                          {change.status === 'approved' && (
                            <div className="mb-3 p-2 bg-green-100 rounded text-sm text-green-800">
                              ✅ Your profile has been updated with these changes!
                            </div>
                          )}
                          
                          {change.status === 'rejected' && change.adminNotes && (
                            <div className="mb-3 p-2 bg-red-100 rounded text-sm text-red-800">
                              ❌ Admin notes: {change.adminNotes}
                            </div>
                          )}
                          
                          {/* Show changed fields */}
                          <div className="space-y-2 text-sm">
                            <p className="font-medium text-gray-700 mb-2">Changed Fields:</p>
                            {Object.entries(change.proposedChanges).map(([key, value]) => (
                              <div key={key} className="grid grid-cols-3 gap-4">
                                <span className="font-medium text-gray-700 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="text-gray-600 truncate col-span-2">
                                  {typeof value === 'string' ? (value || 'Empty') : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <SettingsIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No pending changes at this time</p>
                    </div>
                  )}
                </div>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>
    <Footer />
    </div>
  );
}
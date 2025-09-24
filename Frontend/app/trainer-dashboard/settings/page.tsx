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
  Edit,
  Save,
  X,
  Dumbbell,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface PendingChange {
  id: string;
  changeType: string;
  trainerId: string;
  originalData: any;
  proposedChanges: any;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export default function TrainerSettings() {
  const [trainerName, setTrainerName] = useState("Test Trainer");
  const [trainerEmail, setTrainerEmail] = useState("trainer@gmail.com");
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<any>({});
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [formData, setFormData] = useState({
    fullName: "Coach Sarah Martinez",
    email: "sarah.martinez@wellzone.com",
    phone: "+1 (555) 123-4567",
    licenseNumber: "PT12345678",
    specialization: "Personal Training, Strength & Conditioning",
    experience: "8",
    bio: "Certified personal trainer with 8+ years of experience helping clients achieve their fitness goals through personalized training programs and nutritional guidance.",
    address: "123 Fitness Center Drive, Suite 100\nWellness District, NY 10001",
    education: "Bachelor of Science in Exercise Science - State University (2017)\nNASM Certified Personal Trainer (2017)\nACE Group Fitness Instructor (2018)",
    certifications: "NASM-CPT (National Academy of Sports Medicine)\nACE Group Fitness Instructor\nFirst Aid/CPR Certified\nNutrition Coaching Certification"
  });

  useEffect(() => {
    // Get trainer data from localStorage if available
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.firstName && userData.lastName) {
        setTrainerName(`${userData.firstName} ${userData.lastName}`);
        const newFormData = {
          fullName: `${userData.firstName} ${userData.lastName}`,
          email: userData.email || '',
          phone: userData.phone || '',
          licenseNumber: userData.licenseNumber || '',
          specialization: userData.specialization || '',
          experience: userData.experience?.toString() || '',
          bio: userData.bio || '',
          address: userData.address || '',
          education: userData.education || '',
          certifications: userData.certifications || ''
        };
        setFormData(newFormData);
        setOriginalData(newFormData); // Store original data for comparison
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
      fetchPendingChanges();
    }
  }, [trainerId]);

  const fetchPendingChanges = async () => {
    if (!trainerId) return;
    
    try {
      const response = await fetch(`/api/trainer-profile-changes/${trainerId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPendingChanges(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching pending changes:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/auth/login';
  };

  const handleSave = async () => {
    if (!trainerId) {
      alert('Trainer ID not found. Please log in again.');
      return;
    }

    // Compare current form data with original data to find changes
    const changes: any = {};
    let hasChanges = false;

    Object.keys(formData).forEach(key => {
      if (formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]) {
        changes[key] = formData[key as keyof typeof formData];
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      alert('No changes detected.');
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/trainer-profile-changes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerId,
          changes
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Profile changes submitted for approval!');
        setIsEditing(false);
        fetchPendingChanges(); // Refresh pending changes
        
        // Reset form to original data since changes are pending
        setFormData(originalData);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting changes:', error);
      alert('Failed to submit changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getChangedFields = () => {
    const changedFields: string[] = [];
    Object.keys(formData).forEach(key => {
      if (formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]) {
        changedFields.push(key);
      }
    });
    return changedFields;
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
              <Link href="/trainer-dashboard/my-sessions" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Dumbbell className="w-5 h-5" />
                <span>My Sessions</span>
              </Link>
              <Link href="/trainer-dashboard/my-clients" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="w-5 h-5" />
                <span>My Clients</span>
              </Link>
              <Link href="/trainer-dashboard/settings" className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
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

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your trainer profile and account settings</p>
            </div>

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
                      <h2 className="text-xl font-semibold text-gray-900">Trainer Profile</h2>
                      <p className="text-gray-600 mt-1">Update your professional information</p>
                    </div>
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
                        Trainer License Number
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

                  {/* Gym Address */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gym/Training Facility Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter your training facility address..."
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg whitespace-pre-line">{formData.address}</p>
                    )}
                  </div>

                  {/* Education */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education & Training
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.education}
                        onChange={(e) => setFormData({...formData, education: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="List your education and training background..."
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
                        onClick={() => {
                          setFormData(originalData); // Reset to original data
                          setIsEditing(false);
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading || getChangedFields().length === 0}
                        className="flex items-center space-x-2 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Submit for Approval ({getChangedFields().length} changes)</span>
                          </>
                        )}
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
                      onClick={fetchPendingChanges}
                      className="flex items-center space-x-2 px-4 py-2 text-cyan-600 border border-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {pendingChanges.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No pending changes at this time</p>
                      <p className="text-sm text-gray-400 mt-2">All your profile updates are current</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingChanges.map((change) => (
                        <div key={change.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                                change.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : change.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {change.status === 'pending' && <AlertCircle className="w-4 h-4" />}
                                {change.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                                {change.status === 'rejected' && <XCircle className="w-4 h-4" />}
                                <span className="capitalize">{change.status}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                Profile Update Request
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Submitted: {new Date(change.submittedAt).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Changed Fields */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-3">Changes Requested:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(change.proposedChanges).map(([field, newValue]) => {
                                const originalValue = change.originalData[field];
                                const fieldLabels: { [key: string]: string } = {
                                  fullName: 'Full Name',
                                  email: 'Email',
                                  phone: 'Phone',
                                  licenseNumber: 'License Number',
                                  specialization: 'Specialization',
                                  experience: 'Experience',
                                  bio: 'Bio',
                                  address: 'Address',
                                  education: 'Education',
                                  certifications: 'Certifications'
                                };
                                
                                return (
                                  <div key={field} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-medium text-sm text-gray-700 mb-2">
                                      {fieldLabels[field] || field}
                                    </div>
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-xs text-gray-500">Current:</span>
                                        <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                                          {originalValue || 'Not set'}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-xs text-green-600">Proposed:</span>
                                        <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
                                          {newValue as string}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Admin Notes */}
                          {change.adminNotes && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <h5 className="font-medium text-blue-900 mb-2">Admin Notes:</h5>
                              <p className="text-sm text-blue-800">{change.adminNotes}</p>
                            </div>
                          )}

                          {/* Review Info */}
                          {change.reviewedAt && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>
                                  Reviewed by: {change.reviewedBy || 'Admin'}
                                </span>
                                <span>
                                  {new Date(change.reviewedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    <Footer />
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { withAuth } from "@/hooks/useAuth";
import { firebaseDataService } from "@/lib/firebase-database";
import { toast } from "sonner";
import { 
  User, 
  Edit, 
  LogOut, 
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Appointment {
  id: string;
  doctorName: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  type?: 'consultation' | 'followup' | 'checkup';
  userEmail: string;
  userId: string;
  useradress: string;
  userdescription: string;
  userfirstname: string;
  userlastname: string;
  userphonenumber: string;
  doctorId: string;
}

interface UserData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  membershipType: string;
}

function UserProfile() {
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    membershipType: "Standard Member"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user data from localStorage
      const currentUserData = localStorage.getItem('currentUser');
      if (!currentUserData) {
        toast.error('No user data found');
        return;
      }

      const user = JSON.parse(currentUserData);
      setCurrentUser(user);
      
      // Fetch user from database to get complete profile
      const dbUser = await firebaseDataService.getUserByEmail(user.email);
      if (dbUser) {
        setUserData({
          id: dbUser.id,
          firstName: dbUser.firstName || '',
          lastName: dbUser.lastName || '',
          email: dbUser.email || '',
          phone: (dbUser as any).phone || '',
          bio: (dbUser as any).bio || '',
          membershipType: "Premium Member"
        });
      }

      // Fetch user appointments
      await fetchUserAppointments(user.email);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAppointments = async (userEmail: string) => {
    try {
      const { appointments: doctorAppointments, trainerAppointments } = 
        await firebaseDataService.getAllUserAppointments(userEmail);
      
      // Combine both types of appointments
      const allAppointments: Appointment[] = [
        ...doctorAppointments.map(apt => ({
          ...apt,
          id: apt.id || '',
          status: apt.status as 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed',
          type: 'consultation' as const
        })),
        ...trainerAppointments.map(apt => ({
          ...apt,
          id: apt.id || '',
          status: apt.status as 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed',
          type: 'followup' as const,
          serviceType: apt.serviceType || 'Personal Training'
        }))
      ];
      
      // Sort by date
      allAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setAppointments(allAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !userData.id) {
      toast.error('Unable to save profile - user not found');
      return;
    }

    try {
      setSaving(true);
      
      // Update profile in Firebase
      await firebaseDataService.updateUserProfile(userData.id, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        bio: userData.bio
      });

      // Update localStorage
      const updatedUser = {
        ...currentUser,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/auth/login';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleAppointmentDetails = (appointmentId: string) => {
    setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content with top padding for fixed navbar */}
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and account preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                  
                  {/* Profile Avatar */}
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  {/* User Name */}
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {userData.firstName} {userData.lastName}
                  </h4>

                  {/* Membership Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white mb-4">
                    <User className="w-4 h-4 mr-1" />
                    {userData.membershipType}
                  </div>

                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 mx-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                      <p className="text-gray-600 text-sm mt-1">Update your personal information</p>
                    </div>
                    <div className="flex space-x-2">
                      {isEditing && (
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            loadUserData(); // Reload original data
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                      <button
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        disabled={saving}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : isEditing ? (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.firstName}
                          onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {userData.firstName}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.lastName}
                          onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {userData.lastName}
                        </div>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {userData.email}
                        </div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                          {userData.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={userData.bio}
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[100px]">
                        {userData.bio}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* My Appointments Section */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Appointments</h3>
                    <p className="text-gray-600 text-sm mt-1">View and manage your upcoming appointments</p>
                  </div>
                  <Calendar className="w-6 h-6 text-cyan-500" />
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{appointment.doctorName}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{appointment.serviceType}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{appointment.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{appointment.useradress || 'Address not specified'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <button 
                              onClick={() => toggleAppointmentDetails(appointment.id)}
                              className="px-3 py-1 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors text-sm font-medium flex items-center space-x-1"
                            >
                              <span>{expandedAppointment === appointment.id ? 'Hide Details' : 'View Details'}</span>
                              {expandedAppointment === appointment.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Expanded Details Section */}
                        {expandedAppointment === appointment.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <h5 className="font-semibold text-gray-900 mb-3">Patient Information</h5>
                                <div className="flex items-center space-x-2 text-sm">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">
                                    {appointment.userfirstname} {appointment.userlastname}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{appointment.userEmail}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{appointment.userphonenumber}</span>
                                </div>
                                <div className="flex items-start space-x-2 text-sm">
                                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <span className="text-gray-600">{appointment.useradress}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h5 className="font-semibold text-gray-900 mb-3">Appointment Details</h5>
                                <div className="text-sm">
                                  <span className="text-gray-500">Appointment Type:</span>
                                  <p className="text-gray-900 capitalize">{appointment.type || 'Consultation'}</p>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Service:</span>
                                  <p className="text-gray-900">{appointment.serviceType}</p>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Status:</span>
                                  <p className="text-gray-900">{appointment.status}</p>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Doctor/Trainer ID:</span>
                                  <p className="text-gray-900 font-mono text-xs">{appointment.doctorId}</p>
                                </div>
                              </div>
                            </div>
                            
                            {appointment.userdescription && (
                              <div className="mt-4">
                                <h5 className="font-semibold text-gray-900 mb-2">Additional Notes</h5>
                                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                                  {appointment.userdescription}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with authentication
export default withAuth(UserProfile, {
  showLoadingMessage: "Please log in to access your profile and appointments."
});
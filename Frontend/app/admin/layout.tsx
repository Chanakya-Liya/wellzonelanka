"use client";

import { useState, useEffect } from 'react';
import { Search, User, Dumbbell, Users, Link2, MoreVertical, Download, ChevronDown, LogOut, Home, TrendingUp, Activity, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddExerciseModal from './add-exercises/popup/page';
import { firebaseDataService } from '@/lib/firebase-database';
import AdminRouteGuard from './AdminRouteGuard';
import AdminNavigationBlock from './AdminNavigationBlock';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// Define all interfaces
interface UserRequest {
  id: string;
  name: string;
  email: string;
  age: number;
  lastVisit: string;
  phone: string;
  type: 'user' | 'doctor' | 'trainer';
  specialization?: string; // For trainers
  title?: string; // For doctors
  isApproved?: boolean; // Track approval/suspension status
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  age: number;
  lastVisit: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'deleted' | 'pending';
  type?: 'signup' | 'profile_change' | 'all_doctors';
  firstName?: string;
  lastName?: string;
  role: string;
  specialization?: string;
  licenseNumber?: string;
  experience?: number;
  isApproved: boolean;
  createdAt?: string;
}

interface Trainer {
  id: string;
  name: string;
  email: string;
  age: number;
  lastVisit: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  specialization: string;
  firstName?: string;
  lastName?: string;
  role: string;
  experience?: number;
  isApproved: boolean;
  createdAt?: string;
}

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  muscles: string;
  description: string;
}

// Home Dashboard Component
function HomeDashboard({ setActiveSection }: { setActiveSection?: (section: string) => void }) {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalTrainers: 0,
    userStats: {
      activeUsers: 0,
      suspendedUsers: 0,
      pendingDoctors: 0,
      activeDoctors: 0,
      pendingTrainers: 0,
      activeTrainers: 0
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data simultaneously
        const [usersResponse, doctorsResponse, trainersResponse] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/doctors'),
          fetch('/api/admin/trainers')
        ]);

        const usersData = await usersResponse.json();
        const doctorsData = await doctorsResponse.json();
        const trainersData = await trainersResponse.json();

        if (usersData.success && doctorsData.success && trainersData.success) {
          const users = usersData.data.users || [];
          const doctors = doctorsData.data.all || [];
          const trainers = trainersData.data.all || [];

          // Calculate statistics
          const activeUsers = users.filter((user: any) => user.isApproved !== false).length;
          const suspendedUsers = users.filter((user: any) => user.isApproved === false).length;
          const activeDoctors = doctors.filter((doctor: any) => doctor.isApproved === true).length;
          const pendingDoctors = doctors.filter((doctor: any) => doctor.isApproved === false).length;
          const activeTrainers = trainers.filter((trainer: any) => trainer.isApproved === true).length;
          const pendingTrainers = trainers.filter((trainer: any) => trainer.isApproved === false).length;

          setDashboardData({
            totalUsers: users.length,
            totalDoctors: doctors.length,
            totalTrainers: trainers.length,
            userStats: {
              activeUsers,
              suspendedUsers,
              pendingDoctors,
              activeDoctors,
              pendingTrainers,
              activeTrainers
            }
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare pie chart data
  const pieChartData = {
    labels: ['Regular Users', 'Doctors', 'Trainers'],
    datasets: [
      {
        data: [dashboardData.totalUsers, dashboardData.totalDoctors, dashboardData.totalTrainers],
        backgroundColor: [
          '#3B82F6', // Blue for users
          '#10B981', // Green for doctors
          '#8B5CF6', // Purple for trainers
        ],
        borderColor: [
          '#2563EB',
          '#059669',
          '#7C3AED',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#2563EB',
          '#059669',
          '#7C3AED',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const totalPlatformUsers = dashboardData.totalUsers + dashboardData.totalDoctors + dashboardData.totalTrainers;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the admin dashboard. Here's your platform overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-bold mt-2">{dashboardData.totalUsers}</p>
              <div className="flex items-center mt-3 space-x-2">
                <UserCheck className="h-4 w-4" />
                <span className="text-sm">Active: {dashboardData.userStats.activeUsers}</span>
                <span className="text-blue-200">•</span>
                <span className="text-sm">Suspended: {dashboardData.userStats.suspendedUsers}</span>
              </div>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Total Doctors Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Total Doctors</p>
              <p className="text-3xl font-bold mt-2">{dashboardData.totalDoctors}</p>
              <div className="flex items-center mt-3 space-x-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Active: {dashboardData.userStats.activeDoctors}</span>
                <span className="text-green-200">•</span>
                <span className="text-sm">Pending: {dashboardData.userStats.pendingDoctors}</span>
              </div>
            </div>
            <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
              <User className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Total Trainers Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Total Trainers</p>
              <p className="text-3xl font-bold mt-2">{dashboardData.totalTrainers}</p>
              <div className="flex items-center mt-3 space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Active: {dashboardData.userStats.activeTrainers}</span>
                <span className="text-purple-200">•</span>
                <span className="text-sm">Pending: {dashboardData.userStats.pendingTrainers}</span>
              </div>
            </div>
            <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
              <Dumbbell className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart and Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">User Distribution</h3>
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Platform Statistics</h3>
          <div className="space-y-6">
            {/* Total Platform Users */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 rounded-full p-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-700">Total Platform Users</span>
              </div>
              <span className="text-2xl font-bold text-indigo-600">{totalPlatformUsers}</span>
            </div>

            {/* User Status Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 border-b pb-2">Status Breakdown</h4>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="font-semibold text-green-600">{dashboardData.userStats.activeUsers}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Suspended Users</span>
                <span className="font-semibold text-red-600">{dashboardData.userStats.suspendedUsers}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Doctors</span>
                <span className="font-semibold text-green-600">{dashboardData.userStats.activeDoctors}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Doctors</span>
                <span className="font-semibold text-yellow-600">{dashboardData.userStats.pendingDoctors}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Trainers</span>
                <span className="font-semibold text-green-600">{dashboardData.userStats.activeTrainers}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Trainers</span>
                <span className="font-semibold text-yellow-600">{dashboardData.userStats.pendingTrainers}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveSection?.('users')}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View All Users
                </button>
                <button 
                  onClick={() => setActiveSection?.('doc-admin')}
                  className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  Manage Doctors
                </button>
                <button 
                  onClick={() => setActiveSection?.('trainer-admin')}
                  className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  Manage Trainers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Users Component (formerly New Users)
function UsersPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from Firebase on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        
        if (data.success) {
          // Transform API response to UserRequest format
          const allUsers = [
            ...data.data.users.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'user' as const,
              isApproved: user.isApproved !== false, // Default to true if not explicitly false
            })),
            ...data.data.doctors.all.map((user: any) => ({
              id: user.id,
              name: `Dr. ${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'doctor' as const,
              title: user.specialization,
              isApproved: user.isApproved !== false,
            })),
            ...data.data.trainers.all.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'trainer' as const,
              specialization: user.specialization,
              isApproved: user.isApproved !== false,
            }))
          ];

          setUsers(allUsers);
        } else {
          console.error('Failed to fetch users:', data.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filterUsers = (users: UserRequest[]) => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.specialization && user.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (user.title && user.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (activeFilter === 'all') return matchesSearch;
      if (activeFilter === 'users') return user.type === 'user' && matchesSearch;
      if (activeFilter === 'doctors') return user.type === 'doctor' && matchesSearch;
      if (activeFilter === 'trainers') return user.type === 'trainer' && matchesSearch;
      
      return matchesSearch;
    });
  };

  const handleAccept = async (id: string) => {
    try {
      // Show confirmation popup
      const confirmed = window.confirm('Are you sure you want to reactivate this user account?');
      if (!confirmed) return;

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id, isApproved: true }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success popup
        alert('User account reactivated successfully! They can now login again.');
        
        // Refresh the users list
        const refreshResponse = await fetch('/api/admin/users');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          const allUsers = [
            ...refreshData.data.users.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'user' as const,
              isApproved: user.isApproved !== false,
            })),
            ...refreshData.data.doctors.all.map((user: any) => ({
              id: user.id,
              name: `Dr. ${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'doctor' as const,
              title: user.specialization,
              isApproved: user.isApproved !== false,
            })),
            ...refreshData.data.trainers.all.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'trainer' as const,
              specialization: user.specialization,
              isApproved: user.isApproved !== false,
            }))
          ];
          setUsers(allUsers);
        }
        
        console.log('User reactivated:', id);
      } else {
        console.error('Failed to reactivate user:', data.error);
        alert('Failed to reactivate user. Please try again.');
      }
    } catch (error) {
      console.error('Error reactivating user:', error);
      alert('An error occurred while reactivating the user.');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      // Show confirmation popup
      const confirmed = window.confirm('Are you sure you want to suspend this user? They will not be able to login until reactivated.');
      if (!confirmed) return;

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id, isApproved: false }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success popup
        alert('User suspended successfully! They will not be able to login until reactivated.');
        
        // Refresh the users list
        const refreshResponse = await fetch('/api/admin/users');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          const allUsers = [
            ...refreshData.data.users.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'user' as const,
              isApproved: user.isApproved !== false,
            })),
            ...refreshData.data.doctors.all.map((user: any) => ({
              id: user.id,
              name: `Dr. ${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'doctor' as const,
              title: user.specialization,
              isApproved: user.isApproved !== false,
            })),
            ...refreshData.data.trainers.all.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              type: 'trainer' as const,
              specialization: user.specialization,
              isApproved: user.isApproved !== false,
            }))
          ];
          setUsers(allUsers);
        }
        
        console.log('User suspended:', id);
      } else {
        console.error('Failed to suspend user:', data.error);
        alert('Failed to suspend user. Please try again.');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('An error occurred while suspending the user.');
    }
  };

  const handleDownloadPDF = (id: string) => {
    console.log('Downloading PDF for:', id);
  };

  const getUserTypeColor = (type: string) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800',
      doctor: 'bg-green-100 text-green-800',
      trainer: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUserTypeLabel = (type: string) => {
    const labels = {
      user: 'User',
      doctor: 'Doctor',
      trainer: 'Trainer'
    };
    return labels[type as keyof typeof labels] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search users, doctors, trainers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="flex items-center text-gray-800 gap-2">
            <div className="flex items-center text-gray-800 gap-2 bg-white px-4 py-2 rounded-lg shadow">
              {new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          {[
            { key: 'all', label: 'All users' },
            { key: 'users', label: 'Regular Users' },
            { key: 'doctors', label: 'Doctors' },
            { key: 'trainers', label: 'Trainers' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filterUsers(users).length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
          </div>
        ) : (
          filterUsers(users).map((user: UserRequest) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm p-6 relative">
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${getUserTypeColor(user.type)}`}>
              {getUserTypeLabel(user.type)}
              {user.type === 'doctor' && user.title && ` - ${user.title}`}
              {user.type === 'trainer' && user.specialization && ` - ${user.specialization}`}
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isApproved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isApproved ? 'Active' : 'Suspended'}
                  </span>
                </div>
                <div className="space-y-2 mt-2 text-sm text-gray-600">
                  <p>📧 {user.email}</p>
                  <p>👤 Age {user.age}</p>
                  <p>🕒 Last Visit: {user.lastVisit}</p>
                  <p>📱 {user.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              {user.isApproved ? (
                <button
                  onClick={() => handleDecline(user.id)}
                  className="px-6 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                >
                  Suspend
                </button>
              ) : (
                <button
                  onClick={() => handleAccept(user.id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Re-give access
                </button>
              )}
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}

// Doctor Admin Component
function DocAdminPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [profileChanges, setProfileChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors and profile changes from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch doctors
        const doctorsResponse = await fetch('/api/admin/doctors');
        const doctorsData = await doctorsResponse.json();
        
        // Fetch profile changes
        const profileChangesResponse = await fetch('/api/admin/profile-changes');
        const profileChangesData = await profileChangesResponse.json();
        
        if (doctorsData.success) {
          // Transform API response to Doctor format
          const transformedDoctors: Doctor[] = doctorsData.data.all.map((user: any) => ({
            id: user.id,
            name: `Dr. ${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: 0,
            lastVisit: new Date().toISOString().split('T')[0],
            phone: '+94 XX XXX XXXX',
            status: user.isApproved ? 'active' as const : 'pending' as const,
            type: user.isApproved ? 'all_doctors' as const : 'signup' as const,
            role: 'doctor',
            specialization: user.specialization,
            licenseNumber: user.licenseNumber,
            experience: user.experience,
            isApproved: user.isApproved,
            createdAt: user.createdAt
          }));

          setDoctors(transformedDoctors);
        } else {
          console.error('Failed to fetch doctors:', doctorsData.error);
        }

        if (profileChangesData.doctorChanges) {
          console.log('📋 Profile changes API response:', profileChangesData);
          console.log('👨‍⚕️ Doctor profile changes:', profileChangesData.doctorChanges);
          setProfileChanges(profileChangesData.doctorChanges || []);
        } else {
          console.error('Failed to fetch profile changes:', profileChangesData.error || 'No doctor changes found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.dropdown-menu')) {
        setOpenMenuId(null);
      }
      if (showFilters && !(event.target as Element).closest('.filter-dropdown')) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId, showFilters]);

  const getFilteredData = () => {
    console.log('🔍 Filtering data with activeFilter:', activeFilter);
    console.log('📋 Available profile changes:', profileChanges);
    
    if (activeFilter === 'profile_change') {
      // Return profile changes that match search and are pending
      const filtered = profileChanges.filter(change => {
        const doctorName = `Dr. ${change.originalData?.firstName || ''} ${change.originalData?.lastName || ''}`;
        const email = change.originalData?.email || '';
        const matchesSearch = doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && change.status === 'pending';
      });
      console.log('🔍 Filtered profile changes:', filtered);
      return filtered;
    } else if (activeFilter === 'accepted') {
      // Return accepted profile changes that match search
      const filtered = profileChanges.filter(change => {
        const doctorName = `Dr. ${change.originalData?.firstName || ''} ${change.originalData?.lastName || ''}`;
        const email = change.originalData?.email || '';
        const matchesSearch = doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && change.status === 'approved';
      });
      console.log('🔍 Filtered accepted profile changes:', filtered);
      return filtered;
    } else if (activeFilter === 'all') {
      // Return both doctors and profile changes that match the filter
      const doctorsFiltered = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
        return !doctor.isApproved && matchesSearch; // Only show unapproved
      });
      
      const profileChangesFiltered = profileChanges.filter(change => {
        const doctorName = `Dr. ${change.originalData?.firstName || ''} ${change.originalData?.lastName || ''}`;
        const email = change.originalData?.email || '';
        const matchesSearch = doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && change.status === 'pending';
      });
      
      console.log('🔍 Filtered doctors for all requests:', doctorsFiltered);
      console.log('🔍 Filtered profile changes for all requests:', profileChangesFiltered);
      
      // Combine both arrays and return
      return [...doctorsFiltered, ...profileChangesFiltered];
    } else {
      // Return doctors that match the filter
      const filtered = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        switch (activeFilter) {
          case 'signup':
            return doctor.type === 'signup' && !doctor.isApproved && matchesSearch; // Only unapproved signups
          case 'all_doctors':
            return doctor.isApproved && matchesSearch; // Only show approved doctors
          case 'active':
          case 'inactive':
          case 'suspended':
          case 'deleted':
            return doctor.isApproved && doctor.status === activeFilter && matchesSearch; // Only approved with specific status
          default:
            return false;
        }
      });
      console.log('🔍 Filtered doctors:', filtered);
      return filtered;
    }
  };

  const filteredData = getFilteredData();

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-blue-100 text-blue-800',
      suspended: 'bg-red-100 text-red-800',
      deleted: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAcceptDoctor = async (doctorId: string) => {
    try {
      const response = await fetch('/api/admin/doctors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId, isApproved: true }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the doctors list
        const refreshResponse = await fetch('/api/admin/doctors');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          const transformedDoctors: Doctor[] = refreshData.data.all.map((user: any) => ({
            id: user.id,
            name: `Dr. ${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: 0,
            lastVisit: new Date().toISOString().split('T')[0],
            phone: '+94 XX XXX XXXX',
            status: user.isApproved ? 'active' as const : 'pending' as const,
            type: user.isApproved ? 'all_doctors' as const : 'signup' as const,
            role: 'doctor',
            specialization: user.specialization,
            licenseNumber: user.licenseNumber,
            experience: user.experience,
            isApproved: user.isApproved,
            createdAt: user.createdAt
          }));
          setDoctors(transformedDoctors);
        }
        
        console.log('Doctor approved:', doctorId);
      } else {
        console.error('Failed to approve doctor:', data.error);
      }
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleAcceptProfileChange = async (changeId: string, originalData: any, proposedChanges: any) => {
    try {
      // Show confirmation popup
      const confirmed = window.confirm(`Are you sure you want to approve this profile change for Dr. ${originalData?.firstName} ${originalData?.lastName}?`);
      if (!confirmed) return;

      console.log('Accepting profile change:', changeId);
      console.log('Original data:', originalData);
      console.log('Proposed changes:', proposedChanges);
      
      const response = await fetch('/api/admin/profile-changes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          changeId, 
          action: 'approve',
          adminId: 'current-admin-id', // You should get this from session
          adminNotes: 'Approved by admin'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success popup
        alert('Profile change approved successfully!');
        
        // Refresh the data
        const fetchData = async () => {
          // Fetch doctors
          const doctorsResponse = await fetch('/api/admin/doctors');
          const doctorsData = await doctorsResponse.json();
          
          // Fetch profile changes
          const profileChangesResponse = await fetch('/api/admin/profile-changes');
          const profileChangesData = await profileChangesResponse.json();
          
          if (doctorsData.success) {
            const transformedDoctors: Doctor[] = doctorsData.data.all.map((user: any) => ({
              id: user.id,
              name: `Dr. ${user.firstName} ${user.lastName}`,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              status: user.isApproved ? 'active' as const : 'pending' as const,
              type: user.isApproved ? 'all_doctors' as const : 'signup' as const,
              role: 'doctor',
              specialization: user.specialization,
              licenseNumber: user.licenseNumber,
              experience: user.experience,
              isApproved: user.isApproved,
              createdAt: user.createdAt
            }));
            setDoctors(transformedDoctors);
          }

          if (profileChangesData.doctorChanges) {
            setProfileChanges(profileChangesData.doctorChanges || []);
          }
        };
        
        await fetchData();
        console.log('Profile change accepted successfully');
      } else {
        console.error('Failed to accept profile change:', data.error);
        alert('Failed to approve profile change. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting profile change:', error);
      alert('An error occurred while approving the profile change.');
    }
  };

  const handleDeclineProfileChange = async (changeId: string) => {
    try {
      // Show confirmation popup
      const confirmed = window.confirm('Are you sure you want to decline this profile change?');
      if (!confirmed) return;

      console.log('Declining profile change:', changeId);
      
      const response = await fetch('/api/admin/profile-changes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          changeId, 
          action: 'reject',
          adminId: 'current-admin-id', // You should get this from session
          adminNotes: 'Declined by admin'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success popup
        alert('Profile change declined successfully!');
        
        // Refresh the profile changes
        const profileChangesResponse = await fetch('/api/admin/profile-changes');
        const profileChangesData = await profileChangesResponse.json();
        
        if (profileChangesData.doctorChanges) {
          setProfileChanges(profileChangesData.doctorChanges || []);
        }
        
        console.log('Profile change declined successfully');
      } else {
        console.error('Failed to decline profile change:', data.error);
        alert('Failed to decline profile change. Please try again.');
      }
    } catch (error) {
      console.error('Error declining profile change:', error);
      alert('An error occurred while declining the profile change.');
    }
  };

  const handleDeclineDoctor = async (doctorId: string) => {
    try {
      const response = await fetch('/api/admin/doctors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId, isApproved: false }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the doctors list
        const refreshResponse = await fetch('/api/admin/doctors');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          const transformedDoctors: Doctor[] = refreshData.data.all.map((user: any) => ({
            id: user.id,
            name: `Dr. ${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: 0,
            lastVisit: new Date().toISOString().split('T')[0],
            phone: '+94 XX XXX XXXX',
            status: user.isApproved ? 'active' as const : 'pending' as const,
            type: user.isApproved ? 'all_doctors' as const : 'signup' as const,
            role: 'doctor',
            specialization: user.specialization,
            licenseNumber: user.licenseNumber,
            experience: user.experience,
            isApproved: user.isApproved,
            createdAt: user.createdAt
          }));
          setDoctors(transformedDoctors);
        }
        
        console.log('Doctor declined:', doctorId);
      } else {
        console.error('Failed to decline doctor:', data.error);
      }
    } catch (error) {
      console.error('Error declining doctor:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search Doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Today's Date</span>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow text-gray-800">
            {new Date().toISOString().split('T')[0]}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 relative filter-dropdown">
        {[
          { key: 'all', label: 'All requests' },
          { key: 'signup', label: 'Sign up' },
          { key: 'profile_change', label: 'Profile Changes' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'all_doctors', label: 'All Doctors' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => {
              setActiveFilter(filter.key);
              if (filter.key === 'all_doctors') {
                setShowFilters(!showFilters);
              } else {
                setShowFilters(false);
              }
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeFilter === filter.key || (showFilters && filter.key === 'all_doctors')
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {filter.label}
            {filter.key === 'all_doctors' && <ChevronDown className="h-4 w-4" />}
          </button>
        ))}

        {showFilters && activeFilter === 'all_doctors' && (
          <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-20 w-48">
            {[
              { key: 'active', label: 'Active Doctors' },
              { key: 'inactive', label: 'Inactive Doctors' },
              { key: 'suspended', label: 'Suspended Doctors' },
              { key: 'deleted', label: 'Deleted Doctors' }
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => {
                  setActiveFilter(status.key);
                  setShowFilters(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm rounded-lg transition-colors text-gray-800 ${
                  activeFilter === status.key
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search terms' : 'No doctors match the selected criteria'}
            </p>
          </div>
        ) : (
          filteredData.map((item: any) => {
            // Check if it's a profile change or a doctor
            const isProfileChange = item.originalData && item.proposedChanges;
            
            if (isProfileChange) {
              // Render profile change item
              const change = item;
              const doctorName = `Dr. ${change.originalData?.firstName || ''} ${change.originalData?.lastName || ''}`;
              
              return (
                <div key={change.id} className={`bg-white rounded-xl shadow-sm p-6 relative hover:shadow-md transition-shadow ${change.status === 'approved' ? 'border-l-4 border-green-500' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-800">{doctorName}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          change.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : change.status === 'rejected' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {change.status === 'approved' ? '✅ Accepted' : 
                           change.status === 'rejected' ? '❌ Declined' : 
                           'Profile Change'}
                        </div>
                      </div>
                      <div className="space-y-2 mt-2 text-sm text-gray-600">
                        <p>📧 {change.originalData?.email || ''}</p>
                        <p>🩺 {change.originalData?.specialization || ''}</p>
                        <p>📋 License: {change.originalData?.licenseNumber || ''}</p>
                        <p>📅 Submitted: {new Date(change.submittedAt).toLocaleDateString()}</p>
                        {change.reviewedAt && (
                          <p>✅ Reviewed: {new Date(change.reviewedAt).toLocaleDateString()}</p>
                        )}
                        <p className="font-medium text-blue-600">
                          🔄 Changed Fields: {Object.keys(change.proposedChanges || {}).join(', ')}
                        </p>
                      </div>
                      
                      {change.status === 'pending' && (
                        <div className="flex gap-3 mt-4">
                          <button 
                            onClick={() => handleDeclineProfileChange(change.id)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                          >
                            Decline
                          </button>
                          <button 
                            onClick={() => handleAcceptProfileChange(change.id, change.originalData, change.proposedChanges)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                      
                      {change.status === 'approved' && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-green-800 font-medium">✅ Profile changes have been applied to the user account</p>
                        </div>
                      )}
                      
                      {change.status === 'rejected' && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-red-800 font-medium">❌ Profile changes were declined</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Render doctor item
              const doctor = item;
              return (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm p-6 relative hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(doctor.status)}`}>
                        {doctor.status}
                      </div>
                      
                      {/* Three dots menu */}
                      <div className="dropdown-menu relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === doctor.id ? null : doctor.id)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Dropdown menu */}
                        {openMenuId === doctor.id && (
                          <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 w-48">
                            <button
                              onClick={() => {
                                console.log('View Details for doctor:', doctor.id);
                                alert(`Doctor Details:
Name: ${doctor.firstName} ${doctor.lastName}
Email: ${doctor.email}
Role: ${doctor.role}
Specialization: ${doctor.specialization}
License Number: ${doctor.licenseNumber}
Experience: ${doctor.experience} years
Phone: ${doctor.phone}
Age: ${doctor.age}
Signed up: ${new Date(doctor.createdAt || '').toLocaleDateString()}
Approval Status: ${doctor.isApproved ? 'Approved' : 'Pending Approval'}`);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors text-gray-800"
                            >
                              <User className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                console.log('View Request for doctor:', doctor.id);
                                alert(`Request Information:
Request Type: ${doctor.type || 'signup'}
Status: ${doctor.status}
Submitted: ${new Date(doctor.createdAt || '').toLocaleDateString()}
Approval Required: ${!doctor.isApproved ? 'Yes' : 'No'}
Last Visit: ${doctor.lastVisit}

This is a ${doctor.type === 'signup' ? 'new doctor signup' : 'profile change'} request that requires admin approval.`);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors text-gray-800"
                            >
                              <Search className="w-4 h-4" />
                              View Request
                            </button>
                            <button
                              onClick={() => {
                                console.log('Downloading PDF for doctor:', doctor.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors text-gray-800"
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2 text-sm text-gray-600">
                    <p>📧 {doctor.email}</p>
                    <p>👤 Age {doctor.age}</p>
                    <p>🩺 {doctor.specialization}</p>
                    <p>� License: {doctor.licenseNumber}</p>
                    <p>💼 Experience: {doctor.experience} years</p>
                    <p>�🕒 Last Visit: {doctor.lastVisit}</p>
                    <p>📱 {doctor.phone}</p>
                    <p className={`font-medium ${!doctor.isApproved ? 'text-orange-600' : 'text-green-600'}`}>
                      ⚠️ {doctor.isApproved ? 'Approved' : 'Pending Approval'}
                    </p>
                  </div>
                  
                  {!doctor.isApproved && (
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => handleDeclineDoctor(doctor.id)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleAcceptDoctor(doctor.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
}

// Trainer Admin Component
function TrainerAdminPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [profileChanges, setProfileChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch trainers and profile changes from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch trainers
        const trainersResponse = await fetch('/api/admin/trainers');
        const trainersData = await trainersResponse.json();
        
        // Fetch profile changes
        const profileChangesResponse = await fetch('/api/admin/profile-changes');
        const profileChangesData = await profileChangesResponse.json();
        
        if (trainersData.success) {
          // Transform API response to Trainer format
          const transformedTrainers: Trainer[] = trainersData.data.all.map((user: any) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: 0,
            lastVisit: new Date().toISOString().split('T')[0],
            phone: '+94 XX XXX XXXX',
            status: user.isApproved ? 'active' as const : 'pending' as const,
            specialization: user.specialization || 'General Fitness',
            role: 'trainer',
            experience: user.experience,
            isApproved: user.isApproved,
            createdAt: user.createdAt
          }));

          setTrainers(transformedTrainers);
        } else {
          console.error('Failed to fetch trainers:', trainersData.error);
        }

        if (profileChangesData.trainerChanges) {
          console.log('📋 Trainer profile changes API response:', profileChangesData);
          console.log('💪 Trainer profile changes:', profileChangesData.trainerChanges);
          setProfileChanges(profileChangesData.trainerChanges || []);
        } else {
          console.error('Failed to fetch trainer profile changes:', profileChangesData.error || 'No trainer changes found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.dropdown-menu')) {
        setOpenMenuId(null);
      }
      if (showFilters && !(event.target as Element).closest('.filter-dropdown')) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId, showFilters]);

  const getFilteredTrainerData = () => {
    console.log('🔍 Filtering trainer data with activeFilter:', activeFilter);
    console.log('📋 Available trainer profile changes:', profileChanges);
    
    if (activeFilter === 'profile_change') {
      // Return profile changes that match search and are pending
      const filtered = profileChanges.filter(change => {
        const trainerName = `${change.originalData?.firstName || ''} ${change.originalData?.lastName || ''}`;
        const email = change.originalData?.email || '';
        const matchesSearch = trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && change.status === 'pending';
      });
      console.log('🔍 Filtered trainer profile changes:', filtered);
      return filtered;
    } else if (activeFilter === 'accepted') {
      // Return accepted profile changes that match search
      const filtered = profileChanges.filter(change => {
        const trainerName = `${change.originalData?.firstName || ''} ${change.originalData?.lastName || ''}`;
        const email = change.originalData?.email || '';
        const matchesSearch = trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && change.status === 'approved';
      });
      console.log('🔍 Filtered accepted trainer profile changes:', filtered);
      return filtered;
    } else if (activeFilter === 'all') {
      // Return both trainers and profile changes that match the filter
      const trainersFiltered = trainers.filter(trainer => {
        const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase());
        return !trainer.isApproved && matchesSearch; // Only show unapproved
      });
      
      const profileChangesFiltered = profileChanges.filter(change => {
        const trainerName = `${change.originalData?.firstName || ''} ${change.originalData?.lastName || ''}`;
        const email = change.originalData?.email || '';
        const matchesSearch = trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && change.status === 'pending';
      });
      
      console.log('🔍 Filtered trainers for all requests:', trainersFiltered);
      console.log('🔍 Filtered profile changes for all requests:', profileChangesFiltered);
      
      // Combine both arrays and return
      return [...trainersFiltered, ...profileChangesFiltered];
    } else {
      // Return trainers that match the filter
      const filtered = trainers.filter(trainer => {
        const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase());
        
        switch (activeFilter) {
          case 'signup':
            return !trainer.isApproved && trainer.status === 'pending' && matchesSearch; // Only unapproved signups
          case 'all_trainers':
            return trainer.isApproved && matchesSearch; // Only show approved trainers
          case 'active':
          case 'inactive':
          case 'pending':
            return trainer.isApproved && trainer.status === activeFilter && matchesSearch; // Only approved with specific status
          default:
            return false;
        }
      });
      console.log('🔍 Filtered trainers:', filtered);
      return filtered;
    }
  };

  const filteredTrainerData = getFilteredTrainerData();

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAcceptTrainer = async (trainerId: string) => {
    try {
      const response = await fetch('/api/admin/trainers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainerId, isApproved: true }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the trainers list
        const refreshResponse = await fetch('/api/admin/trainers');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          const transformedTrainers: Trainer[] = refreshData.data.all.map((user: any) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: 0,
            lastVisit: new Date().toISOString().split('T')[0],
            phone: '+94 XX XXX XXXX',
            status: user.isApproved ? 'active' as const : 'pending' as const,
            specialization: user.specialization || 'General Fitness',
            role: 'trainer',
            experience: user.experience,
            isApproved: user.isApproved,
            createdAt: user.createdAt
          }));
          setTrainers(transformedTrainers);
        }
        
        console.log('Trainer approved:', trainerId);
      } else {
        console.error('Failed to approve trainer:', data.error);
      }
    } catch (error) {
      console.error('Error approving trainer:', error);
    }
    setOpenMenuId(null);
  };

  const handleAcceptTrainerProfileChange = async (changeId: string, originalData: any, proposedChanges: any) => {
    try {
      // Show confirmation popup
      const confirmed = window.confirm(`Are you sure you want to approve this profile change for ${originalData?.firstName} ${originalData?.lastName}?`);
      if (!confirmed) return;

      console.log('Accepting trainer profile change:', changeId);
      console.log('Original data:', originalData);
      console.log('Proposed changes:', proposedChanges);
      
      const response = await fetch('/api/admin/profile-changes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          changeId, 
          action: 'approve',
          adminId: 'current-admin-id', // You should get this from session
          adminNotes: 'Approved by admin'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success popup
        alert('Profile change approved successfully!');
        
        // Refresh the data
        const fetchData = async () => {
          // Fetch trainers
          const trainersResponse = await fetch('/api/admin/trainers');
          const trainersData = await trainersResponse.json();
          
          // Fetch profile changes
          const profileChangesResponse = await fetch('/api/admin/profile-changes');
          const profileChangesData = await profileChangesResponse.json();
          
          if (trainersData.success) {
            const transformedTrainers: Trainer[] = trainersData.data.all.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              age: 0,
              lastVisit: new Date().toISOString().split('T')[0],
              phone: '+94 XX XXX XXXX',
              status: user.isApproved ? 'active' as const : 'pending' as const,
              specialization: user.specialization || 'General Fitness',
              role: 'trainer',
              experience: user.experience,
              isApproved: user.isApproved,
              createdAt: user.createdAt
            }));
            setTrainers(transformedTrainers);
          }

          if (profileChangesData.trainerChanges) {
            setProfileChanges(profileChangesData.trainerChanges || []);
          }
        };
        
        await fetchData();
        console.log('Trainer profile change accepted successfully');
      } else {
        console.error('Failed to accept trainer profile change:', data.error);
        alert('Failed to approve profile change. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting trainer profile change:', error);
      alert('An error occurred while approving the profile change.');
    }
  };

  const handleDeclineTrainerProfileChange = async (changeId: string) => {
    try {
      // Show confirmation popup
      const confirmed = window.confirm('Are you sure you want to decline this profile change?');
      if (!confirmed) return;

      console.log('Declining trainer profile change:', changeId);
      
      const response = await fetch('/api/admin/profile-changes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          changeId, 
          action: 'reject',
          adminId: 'current-admin-id', // You should get this from session
          adminNotes: 'Declined by admin'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success popup
        alert('Profile change declined successfully!');
        
        // Refresh the profile changes
        const profileChangesResponse = await fetch('/api/admin/profile-changes');
        const profileChangesData = await profileChangesResponse.json();
        
        if (profileChangesData.trainerChanges) {
          setProfileChanges(profileChangesData.trainerChanges || []);
        }
        
        console.log('Trainer profile change declined successfully');
      } else {
        console.error('Failed to decline trainer profile change:', data.error);
        alert('Failed to decline profile change. Please try again.');
      }
    } catch (error) {
      console.error('Error declining trainer profile change:', error);
      alert('An error occurred while declining the profile change.');
    }
  };

  const handleDeclineTrainer = async (trainerId: string) => {
    try {
      const response = await fetch('/api/admin/trainers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainerId, isApproved: false }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the trainers list
        const refreshResponse = await fetch('/api/admin/trainers');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          const transformedTrainers: Trainer[] = refreshData.data.all.map((user: any) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: 0,
            lastVisit: new Date().toISOString().split('T')[0],
            phone: '+94 XX XXX XXXX',
            status: user.isApproved ? 'active' as const : 'pending' as const,
            specialization: user.specialization || 'General Fitness',
            role: 'trainer',
            experience: user.experience,
            isApproved: user.isApproved,
            createdAt: user.createdAt
          }));
          setTrainers(transformedTrainers);
        }
        
        console.log('Trainer declined:', trainerId);
      } else {
        console.error('Failed to decline trainer:', data.error);
      }
    } catch (error) {
      console.error('Error declining trainer:', error);
    }
    setOpenMenuId(null);
  };

  const handleDownloadPDF = (trainerId: string) => {
    console.log('Downloading PDF for trainer:', trainerId);
    setOpenMenuId(null);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search Trainers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Today's Date</span>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow text-gray-800">
            {new Date().toISOString().split('T')[0]}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6 relative filter-dropdown">
        {[
          { key: 'all', label: 'All requests' },
          { key: 'signup', label: 'Sign up' },
          { key: 'profile_change', label: 'Profile Changes' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'all_trainers', label: 'All Trainers' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => {
              setActiveFilter(filter.key);
              if (filter.key === 'all_trainers') {
                setShowFilters(!showFilters);
              } else {
                setShowFilters(false);
              }
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeFilter === filter.key || (showFilters && filter.key === 'all_trainers')
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {filter.label}
            {filter.key === 'all_trainers' && <ChevronDown className="h-4 w-4" />}
          </button>
        ))}

        {/* Filters Dropdown */}
        {showFilters && activeFilter === 'all_trainers' && (
          <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-20 w-48">
            {[
              { key: 'active', label: 'Active Trainers' },
              { key: 'inactive', label: 'Inactive Trainers' },
              { key: 'pending', label: 'Pending Trainers' }
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => {
                  setActiveFilter(status.key);
                  setShowFilters(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm rounded-lg transition-colors text-gray-800 ${
                  activeFilter === status.key
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrainerData.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No trainers found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search terms' : 'No trainers match the selected criteria'}
            </p>
          </div>
        ) : (
          filteredTrainerData.map((item: any) => {
            // Check if it's a profile change or a trainer
            const isProfileChange = item.originalData && item.proposedChanges;
            
            if (isProfileChange) {
              // Render profile change item
              const change = item;
              const trainerName = `${change.originalData?.firstName || ''} ${change.originalData?.lastName || ''}`;
              
              return (
                <div key={change.id} className={`bg-white rounded-xl shadow-sm p-6 relative hover:shadow-md transition-shadow ${change.status === 'approved' ? 'border-l-4 border-green-500' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-800">{trainerName}</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          change.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : change.status === 'rejected' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {change.status === 'approved' ? '✅ Accepted' : 
                           change.status === 'rejected' ? '❌ Declined' : 
                           'Profile Change'}
                        </div>
                      </div>
                      <div className="space-y-2 mt-2 text-sm text-gray-600">
                        <p>📧 {change.originalData?.email || ''}</p>
                        <p>💪 {change.originalData?.specialization || ''}</p>
                        <p>💼 Experience: {change.originalData?.experience || 0} years</p>
                        <p>📅 Submitted: {new Date(change.submittedAt).toLocaleDateString()}</p>
                        {change.reviewedAt && (
                          <p>✅ Reviewed: {new Date(change.reviewedAt).toLocaleDateString()}</p>
                        )}
                        <p className="font-medium text-purple-600">
                          🔄 Changed Fields: {Object.keys(change.proposedChanges || {}).join(', ')}
                        </p>
                      </div>
                      
                      {change.status === 'pending' && (
                        <div className="flex gap-3 mt-4">
                          <button 
                            onClick={() => handleDeclineTrainerProfileChange(change.id)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                          >
                            Decline
                          </button>
                          <button 
                            onClick={() => handleAcceptTrainerProfileChange(change.id, change.originalData, change.proposedChanges)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                      
                      {change.status === 'approved' && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-green-800 font-medium">✅ Profile changes have been applied to the user account</p>
                        </div>
                      )}
                      
                      {change.status === 'rejected' && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-red-800 font-medium">❌ Profile changes were declined</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Render trainer item
              const trainer = item;
              return (
            <div key={trainer.id} className="bg-white rounded-xl shadow-sm p-6 relative hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">{trainer.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(trainer.status)}`}>
                      {trainer.status}
                    </div>
                  </div>
                  <div className="space-y-2 mt-2 text-sm text-gray-600">
                    <p>📧 {trainer.email}</p>
                    <p>👤 Age {trainer.age}</p>
                    <p>💪 {trainer.specialization}</p>
                    <p>� Experience: {trainer.experience} years</p>
                    <p>�🕒 Last Visit: {trainer.lastVisit}</p>
                    <p>📱 {trainer.phone}</p>
                    <p className={`font-medium ${!trainer.isApproved ? 'text-orange-600' : 'text-green-600'}`}>
                      ⚠️ {trainer.isApproved ? 'Approved' : 'Pending Approval'}
                    </p>
                  </div>
                  
                  {!trainer.isApproved && (
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => handleDeclineTrainer(trainer.id)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleAcceptTrainer(trainer.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>

                {/* Three dots menu */}
                <div className="dropdown-menu relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === trainer.id ? null : trainer.id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === trainer.id && (
                    <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 w-48">
                      <button
                        onClick={() => {
                          console.log('View Details for trainer:', trainer.id);
                          alert(`Trainer Details:
Name: ${trainer.firstName} ${trainer.lastName}
Email: ${trainer.email}
Role: ${trainer.role}
Specialization: ${trainer.specialization}
Experience: ${trainer.experience} years
Phone: ${trainer.phone}
Age: ${trainer.age}
Signed up: ${new Date(trainer.createdAt || '').toLocaleDateString()}
Approval Status: ${trainer.isApproved ? 'Approved' : 'Pending Approval'}`);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors text-gray-800"
                      >
                        <User className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          console.log('View Request for trainer:', trainer.id);
                          alert(`Request Information:
Request Type: trainer signup
Status: ${trainer.status}
Submitted: ${new Date(trainer.createdAt || '').toLocaleDateString()}
Approval Required: ${!trainer.isApproved ? 'Yes' : 'No'}
Last Visit: ${trainer.lastVisit}

This is a new trainer signup request that requires admin approval.`);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors text-gray-800"
                      >
                        <Search className="w-4 h-4" />
                        View Request
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(trainer.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors text-gray-800"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
}

// Add Exercises Component
function AddExercisesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Squats',
      bodyPart: 'Lower Body',
      muscles: 'Quadriceps, Hamstrings, Glutes',
      description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.'
    },
    {
      id: '2',
      name: 'Push-ups',
      bodyPart: 'Upper Body',
      muscles: 'Chest, Shoulders, Triceps',
      description: 'A fundamental upper body exercise that builds strength and stability.'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.muscles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExercise = (exerciseData: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      id: (exercises.length + 1).toString(),
      ...exerciseData
    };
    setExercises([...exercises, newExercise]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search Exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-gray-800 bg-white px-4 py-2 rounded-lg shadow">
            {new Date().toISOString().split('T')[0]}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex flex-col items-center text-center">
        <h2 className="text-lg text-gray-800 font-semibold mb-2">Add New Exercise</h2>
        <p className="text-gray-500 text-sm mb-4">Added exercises to the website will be listed here</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Add New Exercise
        </button>
      </div>

      <div className="space-y-4">
        {filteredExercises.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No exercises found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first exercise'}
            </p>
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-sm p-6 flex items-start justify-between hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-gray-800">{exercise.name}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {exercise.bodyPart}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-medium">Muscles:</span> {exercise.muscles}
                  </p>
                  <p className="text-gray-500 mt-2">{exercise.description}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <AddExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExercise}
      />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      localStorage.removeItem('currentUser');
      router.push('/auth/login');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomeDashboard setActiveSection={setActiveSection} />;
      case 'users':
        return <UsersPage />;
      case 'doc-admin':
        return <DocAdminPage />;
      case 'trainer-admin':
        return <TrainerAdminPage />;
      case 'add-exercises':
        return <AddExercisesPage />;
      default:
        return <HomeDashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <AdminRouteGuard>
      <AdminNavigationBlock />
      <div className="flex min-h-screen bg-gray-100">
        {/* Left Sidebar - This will stay persistent */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl text-gray-800 font-semibold block">Admin Panel</span>
                <span className="text-sm text-gray-500">Management System</span>
              </div>
            </div>
            
            <nav className="space-y-2 text-gray-800">
              <button 
                onClick={() => setActiveSection('home')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeSection === 'home'
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Home className="w-5 h-5" />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveSection('users')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeSection === 'users'
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Users className="w-5 h-5" />
                All Users
              </button>
              <button 
                onClick={() => setActiveSection('doc-admin')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeSection === 'doc-admin'
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <User className="w-5 h-5" />
                Doctor's
              </button>
              <button 
                onClick={() => setActiveSection('trainer-admin')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeSection === 'trainer-admin'
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Dumbbell className="w-5 h-5" />
                Trainer's
              </button>
              <button 
                onClick={() => setActiveSection('add-exercises')}
                className={`w-full flex text-gray-800 items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeSection === 'add-exercises'
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Link2 className="w-5 h-5" />
                Exercises
              </button>
            </nav>

            {/* Logout Section */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area - This will change based on active section */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </AdminRouteGuard>
  );
}
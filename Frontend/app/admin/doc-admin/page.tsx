"use client";

import { useState } from 'react';
import { Search, User, Dumbbell, Users, Home, Link2, MoreVertical, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Interface for doctor data
interface Doctor {
  id: string;
  name: string;
  email: string;
  age: number;
  lastVisit: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'deleted' | 'pending';
  type?: 'signup' | 'profile_change' | 'all_doctors';
}

export default function DocAdminPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([
    // Sign up requests
    {
      id: '1',
      name: 'Dr.Esitha Ekanayake',
      email: 'esitha@gmail.com',
      age: 29,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'active',
      type: 'signup'
    },
    {
      id: '2',
      name: 'Dr. Pasindu Wijesinghe',
      email: 'pasindu@gmail.com',
      age: 32,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'pending',
      type: 'signup'
    },

    // Profile change requests
    {
      id: '3',
      name: 'Dr.Anjitha Wikramasinghe',
      email: 'anjitha@gmail.com',
      age: 29,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'inactive',
      type: 'profile_change'
    },
    {
      id: '4',
      name: 'Dr. Kasun Perera',
      email: 'kasun@gmail.com',
      age: 35,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'active',
      type: 'profile_change'
    },

    // All Doctors - Active
    {
      id: '5',
      name: 'Dr. Thevinu Bimsath',
      email: 'thevinu@gmail.com',
      age: 29,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'active',
      type: 'all_doctors'
    },
    {
      id: '6',
      name: 'Dr. Sarah Silva',
      email: 'sarah@gmail.com',
      age: 31,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'active',
      type: 'all_doctors'
    },

    // All Doctors - Inactive
    {
      id: '7',
      name: 'Dr. John Fernando',
      email: 'john@gmail.com',
      age: 45,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'inactive',
      type: 'all_doctors'
    },
    {
      id: '8',
      name: 'Dr. Emma Perera',
      email: 'emma@gmail.com',
      age: 38,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'inactive',
      type: 'all_doctors'
    },

    // All Doctors - Suspended
    {
      id: '9',
      name: 'Dr. Michael Chang',
      email: 'michael@gmail.com',
      age: 42,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'suspended',
      type: 'all_doctors'
    },
    {
      id: '10',
      name: 'Dr. Lisa Wong',
      email: 'lisa@gmail.com',
      age: 36,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'suspended',
      type: 'all_doctors'
    },

    // All Doctors - Deleted
    {
      id: '11',
      name: 'Dr. David Miller',
      email: 'david@gmail.com',
      age: 39,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'deleted',
      type: 'all_doctors'
    },
    {
      id: '12',
      name: 'Dr. Anna Johnson',
      email: 'anna@gmail.com',
      age: 33,
      lastVisit: '2025-09-15',
      phone: '+94 75 084 5396',
      status: 'deleted',
      type: 'all_doctors'
    }
  ]);

  // Navigation handler
  const handleNavigation = (path: string) => {
    if (path === 'new-users') {
      router.push('/admin');
    } else {
      router.push(`/admin/${path}`);
    }
  };

  // Filter doctors based on status and search query
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeFilter) {
      case 'all':
        return matchesSearch;
      case 'signup':
        return doctor.type === 'signup' && matchesSearch;
      case 'profile_change':
        return doctor.type === 'profile_change' && matchesSearch;
      case 'all_doctors':
        return doctor.type === 'all_doctors' && matchesSearch;
      case 'active':
      case 'inactive':
      case 'suspended':
      case 'deleted':
        return doctor.type === 'all_doctors' && doctor.status === activeFilter && matchesSearch;
      default:
        return false;
    }
  });

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

  // Add handler for PDF download
  const handleDownloadPDF = (doctorId: string) => {
    console.log('Downloading PDF for doctor:', doctorId);
    // Implement PDF download logic
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-xl font-semibold">Admin</span>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => handleNavigation('doc-admin')}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg bg-blue-50 text-blue-600"
            >
              <User className="w-5 h-5" />
              Doctor's
            </button>
            <button 
              onClick={() => handleNavigation('trainer-admin')}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Dumbbell className="w-5 h-5" />
              Trainer's
            </button>
            <button 
              onClick={() => handleNavigation('new-users')}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Users className="w-5 h-5" />
              Users
            </button>
            <button 
              onClick={() => handleNavigation('add-exercises')}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Link2 className="w-5 h-5" />
              Exercises
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          {/* Search Bar */}
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search Requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Today's Date */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Today's Date</span>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              {format(new Date(), 'yyyy-MM-dd')}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6 relative">
          {['all', 'signup', 'profile_change', 'all_doctors'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                if (filter === 'all_doctors') {
                  setShowFilters(!showFilters);
                }
              }}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeFilter === filter
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'All requests' : 
               filter === 'signup' ? 'Sign up' :
               filter === 'profile_change' ? 'Profile Changes' : 'All Doctors'}
              {filter === 'all_doctors' && <ChevronDown className="h-4 w-4" />}
            </button>
          ))}

          {/* Filters Dropdown */}
          {showFilters && activeFilter === 'all_doctors' && (
            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg p-2 z-10 w-48">
              {['active', 'inactive', 'suspended', 'deleted'].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-lg"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-sm p-6 relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(doctor.status)}`}>
                      {doctor.status}
                    </div>
                  </div>
                  <div className="space-y-2 mt-2 text-sm text-gray-600">
                    <p>📧 {doctor.email}</p>
                    <p>👤 Age {doctor.age}</p>
                    <p>🕒 Last Visit: {doctor.lastVisit}</p>
                    <p>📱 {doctor.phone}</p>
                  </div>
                  
                  {/* Accept/Decline buttons for non-all_doctors type */}
                  {doctor.type !== 'all_doctors' && (
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        Decline
                      </button>
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Accept
                      </button>
                    </div>
                  )}
                </div>

                {/* Three dots menu */}
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === doctor.id ? null : doctor.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === doctor.id && (
                    <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg py-2 z-10 w-48">
                      <button
                        onClick={() => handleDownloadPDF(doctor.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download as PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
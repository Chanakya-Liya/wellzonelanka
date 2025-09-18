"use client";

import { useState, useEffect } from 'react';
import { Search, MoreVertical, Download, User, Dumbbell, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Interface for user data
interface UserRequest {
  id: string;
  name: string;
  email: string;
  age: number;
  lastVisit: string;
  phone: string;
  type: 'new_user' | 'profile_change';
}

export default function AdminPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [requests, setRequests] = useState<UserRequest[]>([
    {
      id: '1',
      name: 'Tharidu Johnson',
      email: 'tharidu@gmail.com',
      age: 26,
      lastVisit: '2025-06-15',
      phone: '+94 75 084 5396',
      type: 'new_user'
    },
    {
      id: '2',
      name: 'Tharidu Johnson',
      email: 'tharidu@gmail.com', 
      age: 26,
      lastVisit: '2025-06-15',
      phone: '+94 75 084 5396',
      type: 'profile_change'
    },
    {
      id: '3',
      name: 'Tharidu Johnson',
      email: 'tharidu@gmail.com',
      age: 26, 
      lastVisit: '2025-06-15',
      phone: '+94 75 084 5396',
      type: 'new_user'
    },
    {
      id: '4',
      name: 'Pasindu Johnson',
      email: 'pasindu@gmail.com',
      age: 26,
      lastVisit: '2025-06-15', 
      phone: '+94 75 084 5396',
      type: 'profile_change'
    },
    {
      id: '5',
      name: 'Tharidu Johnson',
      email: 'tharidu@gmail.com',
      age: 26,
      lastVisit: '2025-06-15',
      phone: '+94 75 084 5396',
      type: 'new_user'
    },
    {
      id: '6',
      name: 'Tharidu Johnson',
      email: 'tharidu@gmail.com',
      age: 26,
      lastVisit: '2025-06-15',
      phone: '+94 75 084 5396',
      type: 'profile_change'
    }
  ]);

  // Filter handlers
  const filterRequests = (requests: UserRequest[]) => {
    return requests.filter(request => {
      const matchesSearch = request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          request.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === 'all') return matchesSearch;
      if (activeFilter === 'signup') return request.type === 'new_user' && matchesSearch;
      if (activeFilter === 'profile') return request.type === 'profile_change' && matchesSearch;
      
      return matchesSearch;
    });
  };

  // Action handlers
  const handleAccept = (id: string) => {
    // Implement accept logic
    console.log('Accepted:', id);
  };

  const handleDecline = (id: string) => {
    // Implement decline logic
    console.log('Declined:', id);
  };

  const handleDownloadPDF = (id: string) => {
    // Implement PDF download logic
    console.log('Downloading PDF for:', id);
  };

  // Add navigation handlers
  const handleNavigation = (path: string) => {
    router.push(`/admin/${path}`);
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
            <span className="text-xl text-gray-800 font-semibold">Admin</span>
          </div>
          
          <nav className="space-y-2 text-gray-800">
            <button 
              onClick={() => handleNavigation('doc-admin')}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
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
              onClick={() => handleNavigation('add-exercises')}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <svg 
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              Exercises
            </button>
            <button 
              onClick={() => handleNavigation('new-users')}
              className="w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg bg-blue-50 text-blue-600"
            >
              <Users className="w-5 h-5" />
              New Users
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            {/* Search Bar */}
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search Requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            {/* Today's Date */}
            <div className="flex items-center text-gray-800 gap-2">
              <div className="flex items-center text-gray-800 gap-2 bg-white px-4 py-2 rounded-lg shadow">
                {format(new Date(), 'yyyy-MM-dd')}
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            {['all', 'signup', 'profile'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  activeFilter === filter
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? 'All requests' : 
                 filter === 'signup' ? 'Sign up' : 
                 'Profile Changes'}
              </button>
            ))}
          </div>
        </div>

        {/* Request Cards Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filterRequests(requests).map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm p-6 relative">
              {/* Type Badge */}
              <div className={`absolute top-4 right-12 px-3 py-1 rounded-full text-sm ${
                request.type === 'new_user' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {request.type === 'new_user' ? 'New user' : 'Profile Change'}
              </div>

              {/* Menu Button */}
              <button
                onClick={() => setOpenMenuId(openMenuId === request.id ? null : request.id)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {openMenuId === request.id && (
                <div className="absolute top-12 right-4 bg-white shadow-lg rounded-lg py-2 z-10">
                  <button
                    onClick={() => handleDownloadPDF(request.id)}
                    className="w-full px-4 py-2 text-left text-gray-800 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download as PDF
                  </button>
                </div>
              )}

              {/* User Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{request.name}</h3>
                  <div className="space-y-2 mt-2 text-sm text-gray-600">
                    <p>📧 {request.email}</p>
                    <p>👤 Age {request.age}</p>
                    <p>🕒 Last Visit: {request.lastVisit}</p>
                    <p>📱 {request.phone}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleDecline(request.id)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAccept(request.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
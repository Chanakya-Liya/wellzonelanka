"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is admin
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      // No user logged in, redirect to login
      router.push('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(currentUser);
      
      if (user.role !== 'admin') {
        // Not an admin, redirect to appropriate dashboard or home
        if (user.role === 'doctor') {
          router.push('/doctor-dashboard');
        } else if (user.role === 'trainer') {
          router.push('/trainer-dashboard');
        } else {
          router.push('/');
        }
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
      return;
    }
  }, [router]);

  return <>{children}</>;
}
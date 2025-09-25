"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNavigationBlock() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const currentUser = localStorage.getItem('currentUser');
    let isAdmin = false;

    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        isAdmin = user.role === 'admin';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    if (!isAdmin) return;

    // Block navigation to non-admin pages
    const handlePopState = (event: PopStateEvent) => {
      const currentPath = window.location.pathname;
      
      // If admin tries to navigate away from admin pages
      if (!currentPath.startsWith('/admin') && !currentPath.startsWith('/auth')) {
        event.preventDefault();
        window.history.pushState(null, '', '/admin');
        router.push('/admin');
        alert('As an admin, you can only access the admin panel. Use the logout button to exit.');
      }
    };

    // Override browser back/forward buttons
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    // Block manual URL changes
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(state, title, url) {
      if (typeof url === 'string' && !url.startsWith('/admin') && !url.startsWith('/auth') && !url.startsWith('/api')) {
        alert('As an admin, you can only access the admin panel. Use the logout button to exit.');
        return;
      }
      return originalPushState.apply(window.history, arguments as any);
    };

    window.history.replaceState = function(state, title, url) {
      if (typeof url === 'string' && !url.startsWith('/admin') && !url.startsWith('/auth') && !url.startsWith('/api')) {
        alert('As an admin, you can only access the admin panel. Use the logout button to exit.');
        return;
      }
      return originalReplaceState.apply(window.history, arguments as any);
    };

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [router]);

  return null;
}
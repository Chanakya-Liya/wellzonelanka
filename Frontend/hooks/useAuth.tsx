import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(redirectTo?: string): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          setUser(userData);
        } else {
          setUser(null);
          if (redirectTo) {
            router.push(redirectTo);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        if (redirectTo) {
          router.push(redirectTo);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [router, redirectTo]);

  return {
    user,
    loading,
    isAuthenticated: !!user
  };
}

// Higher Order Component for protecting pages
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    allowedRoles?: string[];
    showLoadingMessage?: string;
  }
) {
  const { 
    redirectTo = '/auth/login', 
    allowedRoles = [], 
    showLoadingMessage = 'Please log in to access this page.' 
  } = options || {};

  return function AuthenticatedComponent(props: P) {
    const { user, loading, isAuthenticated } = useAuth(redirectTo);

    // Show loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4">
              <svg className="w-16 h-16 text-cyan-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">{showLoadingMessage}</p>
            <div className="space-y-3">
              <a
                href="/auth/login"
                className="block w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Check role-based access if roles are specified
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role || '')) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4">
              <svg className="w-16 h-16 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <a
              href="/"
              className="inline-block bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      );
    }

    // User is authenticated and has proper role, render the component
    return <WrappedComponent {...props} />;
  };
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get user data from localStorage (this will need to be adjusted based on your auth implementation)
  // For now, we'll use a different approach - checking for admin session
  
  // If accessing admin routes
  if (pathname.startsWith('/admin')) {
    // You can add admin authentication check here
    // For now, we'll allow access to admin routes
    return NextResponse.next()
  }

  // If user is admin and trying to access non-admin routes (except auth routes)
  if (!pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
    // Check if user is admin (this would need to be implemented based on your session management)
    // For now, we'll implement this in the client-side component
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
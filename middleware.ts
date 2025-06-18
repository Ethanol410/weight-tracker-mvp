import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // Only apply middleware to protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/entry') ||
      request.nextUrl.pathname.startsWith('/charts')) {
    
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const payload = await verifyToken(token)
    
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Add user info to headers for API routes
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.userId)
    response.headers.set('x-user-email', payload.email)
    
    return response
  }
  
  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/register')) {
    
    const token = request.cookies.get('auth-token')?.value
    
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/entry/:path*', '/charts/:path*', '/login', '/register']
}

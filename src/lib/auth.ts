import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

// Alias for tests compatibility
export const generateToken = createToken

export async function verifyToken(token: string): Promise<{ userId: string; email: string }> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: string; email: string }
  } catch {
    throw new Error('Invalid token')
  }
}

// Helper function for API routes to verify authentication
export async function verifyAuthToken(request: NextRequest): Promise<{ userId: string; email: string } | NextResponse> {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token d\'authentification manquant' },
      { status: 401 }
    )
  }
  
  try {
    return await verifyToken(token)
  } catch {
    return NextResponse.json(
      { error: 'Token d\'authentification invalide' },
      { status: 401 }
    )
  }
}

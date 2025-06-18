/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/register/route'

// Mock the database
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock the auth functions
jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashedPassword123'),
}))

import { prisma } from '@/lib/db'

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should register a new user successfully', async () => {
    // Mock database responses
    prisma.user.findUnique.mockResolvedValue(null) // User doesn't exist
    prisma.user.create.mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
    })

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('Utilisateur créé avec succès')
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('test@example.com')
  })

  it('should reject registration with duplicate email', async () => {
    // Mock existing user
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
    })

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Un utilisateur avec cet email existe déjà')
  })

  it('should reject registration with invalid data', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'invalid-email',
        password: '123',
        confirmPassword: '456',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })
})

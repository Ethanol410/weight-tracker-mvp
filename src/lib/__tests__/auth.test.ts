/**
 * @jest-environment node
 */

import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth'

describe('Auth Functions', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123'
      const hashed = await hashPassword(password)
      
      expect(hashed).toBeDefined()
      expect(hashed).not.toBe(password)
      expect(hashed.length).toBeGreaterThan(20)
    })

    it('should verify correct password', async () => {
      const password = 'testPassword123'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword(password, hashed)
      
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hashed)
      
      expect(isValid).toBe(false)
    })

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('JWT Token Generation and Verification', () => {
    const testPayload = { userId: 'test-user-123', email: 'test@example.com' }

    it('should generate a valid JWT token', async () => {
      const token = await generateToken(testPayload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should verify valid token and return payload', async () => {
      const token = await generateToken(testPayload)
      const verified = await verifyToken(token)
      
      expect(verified).toBeDefined()
      expect(verified.userId).toBe(testPayload.userId)
      expect(verified.email).toBe(testPayload.email)
    })

    it('should reject invalid token', async () => {
      const invalidToken = 'invalid.token.here'
      
      await expect(verifyToken(invalidToken)).rejects.toThrow()
    })

    it('should reject malformed token', async () => {
      const malformedToken = 'notajwttoken'
      
      await expect(verifyToken(malformedToken)).rejects.toThrow()
    })
  })
})

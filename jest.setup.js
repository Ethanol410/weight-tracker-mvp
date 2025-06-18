import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock fetch
global.fetch = jest.fn()

// Mock jose library for JWT functions
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('header.payload.signature'), // Proper JWT format
  })),
  jwtVerify: jest.fn().mockImplementation((token) => {
    // Mock different behaviors based on token
    if (token === 'header.payload.signature') {
      return Promise.resolve({
        payload: { userId: 'test-user-123', email: 'test@example.com' }
      })
    } else if (token === 'invalid.token.here' || token === 'notajwttoken') {
      return Promise.reject(new Error('Invalid token'))
    } else {
      return Promise.reject(new Error('JWT verification failed'))
    }
  }),
}))

// Mock window.location only if it doesn't exist or is not configurable
if (typeof window !== 'undefined') {
  const locationDescriptor = Object.getOwnPropertyDescriptor(window, 'location')
  if (!locationDescriptor || locationDescriptor.configurable) {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000',
        origin: 'http://localhost:3000',
        pathname: '/',
        search: '',
        hash: '',
      },
      writable: true,
      configurable: true,
    })
  }
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})

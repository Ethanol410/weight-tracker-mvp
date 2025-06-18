import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/forms/LoginForm'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

// Mock fetch
global.fetch = jest.fn()

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form correctly', () => {
    render(<LoginForm />)
    
    expect(screen.getByText('Connexion')).toBeInTheDocument()
    expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/adresse email/i) as HTMLInputElement
    const form = emailInput.closest('form')!
    
    // Submit form directly to ensure the event is triggered
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText(/L'email est requis/i)).toBeInTheDocument()
      expect(screen.getByText(/Le mot de passe est requis/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/adresse email/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab() // Trigger blur event
    
    await waitFor(() => {
      expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument()
    })
  })
  it('should handle successful login', async () => {
    const mockPush = jest.fn()
    const { useRouter } = await import('next/navigation')
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })

    // Mock successful login response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const user = userEvent.setup()
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/adresse email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    const form = emailInput.closest('form')!
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should handle login error', async () => {
    // Mock failed login response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email ou mot de passe incorrect' }),
    })

    const user = userEvent.setup()
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/adresse email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    
    const form = emailInput.closest('form')!
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText(/email ou mot de passe incorrect/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    // Mock slow response
    ;(global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true }),
        }), 100)
      )
    )

    const user = userEvent.setup()
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/adresse email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    const form = emailInput.closest('form')!
    fireEvent.submit(form)
    
    // Check loading state immediately after submission
    expect(screen.getByText(/connexion.../i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('should clear field errors when user starts typing', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/adresse email/i)
    const form = emailInput.closest('form')!
    
    // Trigger validation error by submitting empty form
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText(/L'email est requis/i)).toBeInTheDocument()
    })
    
    // Start typing to clear error
    await user.type(emailInput, 'test@example.com')
    
    await waitFor(() => {
      expect(screen.queryByText(/L'email est requis/i)).not.toBeInTheDocument()
    })
  })
})

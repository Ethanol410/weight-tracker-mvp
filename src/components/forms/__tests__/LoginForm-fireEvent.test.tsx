import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

describe('LoginForm FireEvent Test', () => {
  it('should show validation errors when form is submitted directly', async () => {
    // Block fetch to prevent actual network calls
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch should not be called'))
    
    render(<LoginForm />)
    
    // Verify initial state
    const emailInput = screen.getByLabelText(/adresse email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/mot de passe/i) as HTMLInputElement
    expect(emailInput.value).toBe('')
    expect(passwordInput.value).toBe('')
    
    // Get the form element and submit it directly
    const form = emailInput.closest('form')
    expect(form).toBeTruthy()
    
    // Fire submit event directly on the form
    fireEvent.submit(form!)
    
    // Wait for React to process the state changes
    await waitFor(
      () => {
        const emailErrorElement = screen.queryByText(/L'email est requis/i)
        if (!emailErrorElement) {
          // If not found, let's see what errors ARE displayed
          const allErrors = screen.queryAllByText(/(requis|invalide|erreur)/i)
          console.log('All error texts found:', allErrors.map(el => el.textContent))
          throw new Error('Email validation error not found')
        }
        expect(emailErrorElement).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
    
    await waitFor(
      () => {
        const passwordErrorElement = screen.queryByText(/Le mot de passe est requis/i)
        expect(passwordErrorElement).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })
})

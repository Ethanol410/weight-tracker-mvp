import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DailyEntryForm from '@/components/forms/DailyEntryForm'

describe('DailyEntryForm Component', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render form with all required fields', () => {
    render(<DailyEntryForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/poids/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/niveau de fatigue/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/calories consommées/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre de pas/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enregistrer l'entrée/i })).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    render(<DailyEntryForm onSubmit={mockOnSubmit} />)
    
    const weightInput = screen.getByLabelText(/poids/i) as HTMLInputElement
    const form = weightInput.closest('form')!
    
    // Submit form directly to trigger validation
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText(/Le poids doit être entre 30 et 300 kg/i)).toBeInTheDocument()
      expect(screen.getByText(/Les calories doivent être entre 0 et 10000/i)).toBeInTheDocument()
      expect(screen.getByText(/Le nombre de pas doit être entre 0 et 100000/i)).toBeInTheDocument()
    })    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should validate weight range', async () => {
    const user = userEvent.setup()
    render(<DailyEntryForm onSubmit={mockOnSubmit} />)
    
    const weightInput = screen.getByLabelText(/poids/i)
    
    // Test weight too low
    await user.type(weightInput, '25')
    fireEvent.blur(weightInput)
    
    await waitFor(() => {
      expect(screen.getByText(/le poids doit être entre 30 et 300 kg/i)).toBeInTheDocument()
    })
    
    // Clear the error by entering a valid value
    await user.clear(weightInput)
    await user.type(weightInput, '70')
    
    // Test weight too high  
    await user.clear(weightInput)
    await user.type(weightInput, '350')
    fireEvent.blur(weightInput)
    
    await waitFor(() => {
      expect(screen.getByText(/le poids doit être entre 30 et 300 kg/i)).toBeInTheDocument()
    })
  })
  it('should validate fatigue level range', async () => {
    render(<DailyEntryForm onSubmit={mockOnSubmit} />)
    
    const fatigueSelect = screen.getByLabelText(/niveau de fatigue/i)
    
    // Check that default value is within range
    expect(fatigueSelect).toHaveValue('5')
    
    // All options should be valid
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(10) // 1-10
  })

  it('should show fatigue level visual indicator', () => {
    render(<DailyEntryForm onSubmit={mockOnSubmit} />)
    
    // Should show visual bars for fatigue level
    const fatigueBars = screen.getByLabelText(/niveau de fatigue/i).parentElement?.querySelectorAll('.h-2')
    expect(fatigueBars).toHaveLength(10) // 10 indicator bars
  })

  it('should submit valid data', async () => {
    const user = userEvent.setup()
    render(<DailyEntryForm onSubmit={mockOnSubmit} />)
    
    const dateInput = screen.getByLabelText(/date/i)
    const weightInput = screen.getByLabelText(/poids/i)
    const fatigueSelect = screen.getByLabelText(/niveau de fatigue/i)
    const caloriesInput = screen.getByLabelText(/calories/i)
    const stepsInput = screen.getByLabelText(/nombre de pas/i)
    
    await user.clear(dateInput)
    await user.type(dateInput, '2024-01-15')
    await user.clear(weightInput)
    await user.type(weightInput, '70.5')
    await user.selectOptions(fatigueSelect, '7')
    await user.clear(caloriesInput)
    await user.type(caloriesInput, '2000')
    await user.clear(stepsInput)
    await user.type(stepsInput, '8000')
    
    const form = weightInput.closest('form')!
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        date: '2024-01-15',
        weight: 70.5,
        fatigueLevel: 7,
        caloriesConsumed: 2000,
        steps: 8000,
      })
    })
  })
  it('should handle edit mode correctly', () => {
    const initialData = {
      id: '1',
      date: new Date('2024-01-15'),
      weight: 75.0,
      fatigueLevel: 6,
      caloriesConsumed: 2200,
      steps: 9000,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    render(
      <DailyEntryForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={initialData}
        mode="edit"
      />
    )
    
    // Use getAllByText to handle multiple occurrences of "Modifier l'entrée"
    const modifierTexts = screen.getAllByText(/modifier l'entrée/i)
    expect(modifierTexts.length).toBeGreaterThan(0)
    
    expect(screen.getByDisplayValue('75')).toBeInTheDocument()
    // Check that the select has the correct value selected
    const fatigueSelect = screen.getByLabelText(/niveau de fatigue/i) as HTMLSelectElement
    expect(fatigueSelect.value).toBe('6')
    expect(screen.getByDisplayValue('2200')).toBeInTheDocument()
    expect(screen.getByDisplayValue('9000')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /modifier l'entrée/i })).toBeInTheDocument()
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <DailyEntryForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )
    
    const cancelButton = screen.getByRole('button', { name: /annuler/i })
    await user.click(cancelButton)
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('should show loading state during submission', async () => {
    render(<DailyEntryForm onSubmit={mockOnSubmit} isLoading={true} />)
    
    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/enregistrement.../i)).toBeInTheDocument()
  })

  it('should clear errors when user starts typing', async () => {
    const user = userEvent.setup()
    render(<DailyEntryForm onSubmit={mockOnSubmit} />)
    
    const weightInput = screen.getByLabelText(/poids/i)
    const form = weightInput.closest('form')!
    
    // Trigger validation error
    fireEvent.submit(form)
    await waitFor(() => {
      expect(screen.getByText(/le poids doit être entre 30 et 300 kg/i)).toBeInTheDocument()
    })
    
    // Start typing to clear error
    await user.type(weightInput, '70')
    
    await waitFor(() => {
      expect(screen.queryByText(/le poids doit être entre 30 et 300 kg/i)).not.toBeInTheDocument()
    })
  })
})

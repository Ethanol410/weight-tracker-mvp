import { formatDateInput, cn } from '@/lib/utils'

describe('Utils Functions', () => {
  describe('formatDateInput', () => {
    it('should format date correctly for input field', () => {
      const date = new Date('2024-01-15T10:30:00.000Z')
      const formatted = formatDateInput(date)
      expect(formatted).toBe('2024-01-15')
    })

    it('should handle current date', () => {
      const now = new Date()
      const formatted = formatDateInput(now)
      const expected = now.toISOString().split('T')[0]
      expect(formatted).toBe(expected)
    })

    it('should pad single digits with zero', () => {
      const date = new Date('2024-02-05T10:30:00.000Z')
      const formatted = formatDateInput(date)
      expect(formatted).toBe('2024-02-05')
    })
  })

  describe('cn (className utility)', () => {
    it('should merge classnames correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toContain('base-class')
      expect(result).toContain('additional-class')
    })

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toContain('base-class')
      expect(result).toContain('conditional-class')
      expect(result).not.toContain('hidden-class')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'valid-class')
      expect(result).toContain('base-class')
      expect(result).toContain('valid-class')
    })
  })
})

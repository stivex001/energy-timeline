import { describe, it, expect } from 'vitest'
import { formatTime12Hour, formatTimeLabel } from '../timeFormatting'

describe('formatTime12Hour', () => {
  it('should format AM times correctly', () => {
    const date = new Date(2024, 0, 1, 9, 30, 0) // Local time: Jan 1, 2024 9:30 AM
    expect(formatTime12Hour(date)).toBe('9:30 AM')
  })

  it('should format PM times correctly', () => {
    const date = new Date(2024, 0, 1, 14, 30, 0) // Local time: Jan 1, 2024 2:30 PM
    expect(formatTime12Hour(date)).toBe('2:30 PM')
  })

  it('should handle midnight (12:00 AM)', () => {
    const date = new Date(2024, 0, 1, 0, 0, 0) // Local time: Jan 1, 2024 12:00 AM
    expect(formatTime12Hour(date)).toBe('12:00 AM')
  })

  it('should handle noon (12:00 PM)', () => {
    const date = new Date(2024, 0, 1, 12, 0, 0) // Local time: Jan 1, 2024 12:00 PM
    expect(formatTime12Hour(date)).toBe('12:00 PM')
  })

  it('should pad minutes with zero', () => {
    const date = new Date(2024, 0, 1, 9, 5, 0) // Local time: Jan 1, 2024 9:05 AM
    expect(formatTime12Hour(date)).toBe('9:05 AM')
  })
})

describe('formatTimeLabel', () => {
  it('should format time without minutes when minutes are 0', () => {
    const date = new Date(2024, 0, 1, 9, 0, 0) // Local time: Jan 1, 2024 9:00 AM
    expect(formatTimeLabel(date)).toBe('9 AM')
  })

  it('should format time with minutes when minutes are not 0', () => {
    const date = new Date(2024, 0, 1, 9, 30, 0) // Local time: Jan 1, 2024 9:30 AM
    // formatTimeLabel doesn't include AM/PM when minutes are not 0
    expect(formatTimeLabel(date)).toBe('9:30')
  })

  it('should handle midnight (12 AM)', () => {
    const date = new Date(2024, 0, 1, 0, 0, 0) // Local time: Jan 1, 2024 12:00 AM
    expect(formatTimeLabel(date)).toBe('12 AM')
  })

  it('should handle noon (12 PM)', () => {
    const date = new Date(2024, 0, 1, 12, 0, 0) // Local time: Jan 1, 2024 12:00 PM
    expect(formatTimeLabel(date)).toBe('12 PM')
  })

  it('should pad minutes with zero', () => {
    const date = new Date(2024, 0, 1, 9, 5, 0) // Local time: Jan 1, 2024 9:05 AM
    // formatTimeLabel doesn't include AM/PM when minutes are not 0
    expect(formatTimeLabel(date)).toBe('9:05')
  })
})

import { describe, it, expect } from 'vitest'
import { processHighlightsWithDates, findCurrentPhase } from '../highlightHelpers'

describe('processHighlightsWithDates', () => {
  it('should convert highlight times to Date objects', () => {
    const highlights = [
      { time: '2024-01-01T10:00:00Z', label: 'Morning', color: '#256EFF' },
      { time: '2024-01-01T14:00:00Z', label: 'Afternoon', color: '#DC8F69' },
    ]

    const result = processHighlightsWithDates(highlights)

    expect(result).toHaveLength(2)
    expect(result[0].date).toBeInstanceOf(Date)
    expect(result[0].date.toISOString()).toBe('2024-01-01T10:00:00.000Z')
    expect(result[0].label).toBe('Morning')
    expect(result[1].date).toBeInstanceOf(Date)
    expect(result[1].date.toISOString()).toBe('2024-01-01T14:00:00.000Z')
  })

  it('should handle empty array', () => {
    const result = processHighlightsWithDates([])
    expect(result).toHaveLength(0)
  })
})

describe('findCurrentPhase', () => {
  it('should return null for empty highlights', () => {
    const result = findCurrentPhase(new Date(), [])
    expect(result).toBeNull()
  })

  it('should return the phase when current time is between two highlights', () => {
    const highlights = [
      {
        time: '2024-01-01T10:00:00Z',
        label: 'Morning',
        color: '#256EFF',
        date: new Date('2024-01-01T10:00:00Z'),
      },
      {
        time: '2024-01-01T14:00:00Z',
        label: 'Afternoon',
        color: '#DC8F69',
        date: new Date('2024-01-01T14:00:00Z'),
      },
    ]

    const currentTime = new Date('2024-01-01T12:00:00Z')
    const result = findCurrentPhase(currentTime, highlights)

    expect(result).toBe(highlights[0])
  })

  it('should return the last highlight when current time is after all highlights', () => {
    const highlights = [
      {
        time: '2024-01-01T10:00:00Z',
        label: 'Morning',
        color: '#256EFF',
        date: new Date('2024-01-01T10:00:00Z'),
      },
      {
        time: '2024-01-01T14:00:00Z',
        label: 'Afternoon',
        color: '#DC8F69',
        date: new Date('2024-01-01T14:00:00Z'),
      },
    ]

    const currentTime = new Date('2024-01-01T16:00:00Z')
    const result = findCurrentPhase(currentTime, highlights)

    expect(result).toBe(highlights[1])
  })

  it('should return the last highlight when current time is after all highlights', () => {
    const highlights = [
      {
        time: '2024-01-01T10:00:00Z',
        label: 'Morning',
        color: '#256EFF',
        date: new Date('2024-01-01T10:00:00Z'),
      },
      {
        time: '2024-01-01T14:00:00Z',
        label: 'Afternoon',
        color: '#DC8F69',
        date: new Date('2024-01-01T14:00:00Z'),
      },
    ]

    const currentTime = new Date('2024-01-01T08:00:00Z')
    const result = findCurrentPhase(currentTime, highlights)

    // When time is before all highlights, the function returns the last highlight
    // (as per the implementation logic)
    expect(result).toBe(highlights[highlights.length - 1])
  })

  it('should handle unsorted highlights by sorting them', () => {
    const highlights = [
      {
        time: '2024-01-01T14:00:00Z',
        label: 'Afternoon',
        color: '#DC8F69',
        date: new Date('2024-01-01T14:00:00Z'),
      },
      {
        time: '2024-01-01T10:00:00Z',
        label: 'Morning',
        color: '#256EFF',
        date: new Date('2024-01-01T10:00:00Z'),
      },
    ]

    const currentTime = new Date('2024-01-01T12:00:00Z')
    const result = findCurrentPhase(currentTime, highlights)

    expect(result).toBe(highlights[1]) // Morning (first after sorting)
  })
})

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEnergyInsights } from '../useEnergyInsights'
import type { EnergyPoint, EnergyHighlight } from '../../components/type'

describe('useEnergyInsights', () => {
  const mockData: EnergyPoint[] = [
    {
      id: 1,
      time: '2024-01-01T10:00:00Z',
      level: 0.5,
    },
    {
      id: 2,
      time: '2024-01-01T12:00:00Z',
      level: 0.7,
    },
  ]

  const mockHighlights: EnergyHighlight[] = [
    {
      time: '2024-01-01T10:00:00Z',
      label: 'Morning',
      color: '#256EFF',
    },
    {
      time: '2024-01-01T14:00:00Z',
      label: 'Afternoon',
      color: '#DC8F69',
    },
  ]

  it('should return parsed data, current phase, and energy level', () => {
    const currentTime = new Date('2024-01-01T11:00:00Z')

    const { result } = renderHook(() =>
      useEnergyInsights({
        data: mockData,
        highlights: mockHighlights,
        currentTime,
      })
    )

    expect(result.current.parsedData).toBeDefined()
    expect(result.current.currentPhase).toBeDefined()
    expect(result.current.currentEnergyLevel).toBeDefined()
  })

  it('should find current phase when time is between highlights', () => {
    const currentTime = new Date('2024-01-01T12:00:00Z')

    const { result } = renderHook(() =>
      useEnergyInsights({
        data: mockData,
        highlights: mockHighlights,
        currentTime,
      })
    )

    expect(result.current.currentPhase).not.toBeNull()
    expect(result.current.currentPhase?.label).toBe('Morning')
  })

  it('should handle Date object for currentTime', () => {
    const currentTime = new Date('2024-01-01T11:00:00Z')

    const { result } = renderHook(() =>
      useEnergyInsights({
        data: mockData,
        highlights: mockHighlights,
        currentTime,
      })
    )

    expect(result.current.currentEnergyLevel).toBeGreaterThanOrEqual(0)
    expect(result.current.currentEnergyLevel).toBeLessThanOrEqual(1)
  })

  it('should handle string for currentTime', () => {
    const currentTime = '2024-01-01T11:00:00Z'

    const { result } = renderHook(() =>
      useEnergyInsights({
        data: mockData,
        highlights: mockHighlights,
        currentTime,
      })
    )

    expect(result.current.currentEnergyLevel).toBeGreaterThanOrEqual(0)
    expect(result.current.currentEnergyLevel).toBeLessThanOrEqual(1)
  })

  it('should return null phase when no highlights match', () => {
    const emptyHighlights: EnergyHighlight[] = []
    const currentTime = new Date('2024-01-01T11:00:00Z')

    const { result } = renderHook(() =>
      useEnergyInsights({
        data: mockData,
        highlights: emptyHighlights,
        currentTime,
      })
    )

    expect(result.current.currentPhase).toBeNull()
  })
})

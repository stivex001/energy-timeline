import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useParsedData } from '../useParsedData'
import type { EnergyPoint } from '../../components/type'

describe('useParsedData', () => {
  const mockData: EnergyPoint[] = [
    {
      id: 1,
      time: '2024-01-01T10:00:00Z',
      level: 0.5,
    },
    {
      id: 2,
      time: '2024-01-01T11:00:00Z',
      level: 0.7,
    },
  ]

  it('should parse time strings to Date objects', () => {
    const { result } = renderHook(() => useParsedData(mockData))

    expect(result.current.length).toBeGreaterThan(0)
    expect(result.current[0].date).toBeInstanceOf(Date)
    expect(result.current[0].date.toISOString()).toBe('2024-01-01T10:00:00.000Z')
  })

  it('should preserve original data properties', () => {
    const { result } = renderHook(() => useParsedData(mockData))

    expect(result.current[0].id).toBe(1)
    expect(result.current[0].level).toBe(0.5)
    expect(result.current[0].time).toBe('2024-01-01T10:00:00Z')
  })

  it('should interpolate points between data points', () => {
    const { result } = renderHook(() => useParsedData(mockData))

    // Should have original points plus interpolated points
    // With 1 hour gap and 15-minute intervals, we should have interpolated points
    expect(result.current.length).toBeGreaterThan(2)
  })

  it('should handle empty array', () => {
    const { result } = renderHook(() => useParsedData([]))
    expect(result.current).toHaveLength(0)
  })

  it('should handle single data point', () => {
    const singlePoint: EnergyPoint[] = [
      {
        id: 1,
        time: '2024-01-01T10:00:00Z',
        level: 0.5,
      },
    ]

    const { result } = renderHook(() => useParsedData(singlePoint))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].date).toBeInstanceOf(Date)
  })

  it('should memoize result when data does not change', () => {
    const { result, rerender } = renderHook(() => useParsedData(mockData))

    const firstResult = result.current

    rerender()

    // Should return the same reference if data hasn't changed
    expect(result.current).toBe(firstResult)
  })
})

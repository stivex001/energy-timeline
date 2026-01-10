import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useChartScales } from '../useChartScales'
import type { ParsedDataPoint } from '../../components/type'

describe('useChartScales', () => {
  const mockParsedData: ParsedDataPoint[] = [
    {
      id: 1,
      time: '2024-01-01T10:00:00Z',
      level: 0.5,
      date: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: 2,
      time: '2024-01-01T12:00:00Z',
      level: 0.7,
      date: new Date('2024-01-01T12:00:00Z'),
    },
    {
      id: 3,
      time: '2024-01-01T14:00:00Z',
      level: 0.6,
      date: new Date('2024-01-01T14:00:00Z'),
    },
  ]

  it('should return xScale and yScale', () => {
    const { result } = renderHook(() => useChartScales(mockParsedData, 800))

    expect(result.current.xScale).toBeDefined()
    expect(result.current.yScale).toBeDefined()
  })

  it('should create xScale with correct domain from data', () => {
    const { result } = renderHook(() => useChartScales(mockParsedData, 800))

    const domain = result.current.xScale.domain()
    expect(domain[0].getTime()).toBe(new Date('2024-01-01T10:00:00Z').getTime())
    expect(domain[1].getTime()).toBe(new Date('2024-01-01T14:00:00Z').getTime())
  })

  it('should create yScale with domain [0, 1]', () => {
    const { result } = renderHook(() => useChartScales(mockParsedData, 800))

    const domain = result.current.yScale.domain()
    expect(domain[0]).toBe(0)
    expect(domain[1]).toBe(1)
  })

  it('should map dates to x positions correctly', () => {
    const { result } = renderHook(() => useChartScales(mockParsedData, 800))

    const x1 = result.current.xScale(new Date('2024-01-01T10:00:00Z'))
    const x2 = result.current.xScale(new Date('2024-01-01T14:00:00Z'))

    expect(x2).toBeGreaterThan(x1)
  })

  it('should map energy levels to y positions correctly', () => {
    const { result } = renderHook(() => useChartScales(mockParsedData, 800))

    const y1 = result.current.yScale(0)
    const y2 = result.current.yScale(1)

    // Lower energy (0) should be at bottom (higher y value)
    // Higher energy (1) should be at top (lower y value)
    expect(y1).toBeGreaterThan(y2)
  })

  it('should handle empty data array', () => {
    const { result } = renderHook(() => useChartScales([], 800))

    expect(result.current.xScale).toBeDefined()
    expect(result.current.yScale).toBeDefined()
  })
})

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRealTime } from '../useRealTime'

describe('useRealTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return current date initially', () => {
    const { result } = renderHook(() => useRealTime())
    expect(result.current).toBeInstanceOf(Date)
  })

  it('should update time after interval', () => {
    const initialTime = new Date('2024-01-01T12:00:00Z')
    vi.setSystemTime(initialTime)

    const { result } = renderHook(() => useRealTime(1000))

    expect(result.current.getTime()).toBe(initialTime.getTime())

    // Advance system time and timer by 1 second
    act(() => {
      vi.setSystemTime(new Date(initialTime.getTime() + 1000))
      vi.advanceTimersByTime(1000)
    })

    // The time should have updated
    expect(result.current.getTime()).toBeGreaterThan(initialTime.getTime())
  })

  it('should use custom update interval', () => {
    const initialTime = new Date('2024-01-01T12:00:00Z')
    vi.setSystemTime(initialTime)

    const { result } = renderHook(() => useRealTime(2000))

    const firstTime = result.current.getTime()

    // Advance system time and timer by 2 seconds
    act(() => {
      vi.setSystemTime(new Date(initialTime.getTime() + 2000))
      vi.advanceTimersByTime(2000)
    })

    // The time should have updated
    expect(result.current.getTime()).toBeGreaterThan(firstTime)
  })

  it('should cleanup interval on unmount', () => {
    const { unmount } = renderHook(() => useRealTime(1000))

    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})

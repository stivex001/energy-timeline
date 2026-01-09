import { describe, it, expect } from 'vitest'
import { getFocusState } from '../focusState'

describe('getFocusState', () => {
  it('should return "High focus" for levels >= 0.6', () => {
    expect(getFocusState(0.6)).toBe('High focus')
    expect(getFocusState(0.7)).toBe('High focus')
    expect(getFocusState(1.0)).toBe('High focus')
  })

  it('should return "Medium focus" for levels >= 0.3 and < 0.6', () => {
    expect(getFocusState(0.3)).toBe('Medium focus')
    expect(getFocusState(0.45)).toBe('Medium focus')
    expect(getFocusState(0.59)).toBe('Medium focus')
  })

  it('should return "Low focus" for levels < 0.3', () => {
    expect(getFocusState(0.29)).toBe('Low focus')
    expect(getFocusState(0.1)).toBe('Low focus')
    expect(getFocusState(0)).toBe('Low focus')
  })

  it('should handle edge cases', () => {
    expect(getFocusState(0.3)).toBe('Medium focus') // Boundary: medium
    expect(getFocusState(0.299)).toBe('Low focus') // Just below medium
    expect(getFocusState(0.6)).toBe('High focus') // Boundary: high
    expect(getFocusState(0.599)).toBe('Medium focus') // Just below high
  })
})

import { describe, it, expect } from 'vitest'
import { getEnergyColor } from '../energyColor'

describe('getEnergyColor', () => {
  it('should return high energy color for levels >= 0.6', () => {
    expect(getEnergyColor(0.6)).toBe('#256EFF')
    expect(getEnergyColor(0.7)).toBe('#256EFF')
    expect(getEnergyColor(1.0)).toBe('#256EFF')
  })

  it('should return medium energy color for levels >= 0.3 and < 0.6', () => {
    expect(getEnergyColor(0.3)).toBe('#DC8F69')
    expect(getEnergyColor(0.45)).toBe('#DC8F69')
    expect(getEnergyColor(0.59)).toBe('#DC8F69')
  })

  it('should return low energy color for levels < 0.3', () => {
    expect(getEnergyColor(0.29)).toBe('#B7148E')
    expect(getEnergyColor(0.1)).toBe('#B7148E')
    expect(getEnergyColor(0)).toBe('#B7148E')
  })

  it('should handle edge cases', () => {
    expect(getEnergyColor(0.3)).toBe('#DC8F69') // Boundary: medium
    expect(getEnergyColor(0.299)).toBe('#B7148E') // Just below medium
    expect(getEnergyColor(0.6)).toBe('#256EFF') // Boundary: high
    expect(getEnergyColor(0.599)).toBe('#DC8F69') // Just below high
  })
})

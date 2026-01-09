import { describe, it, expect } from 'vitest'
import { findClosestDataPoint, findCurrentEnergyLevel } from '../dataPointHelpers'

describe('findClosestDataPoint', () => {
  it('should return null for empty array', () => {
    const result = findClosestDataPoint([], new Date())
    expect(result).toBeNull()
  })

  it('should return the only point when array has one element', () => {
    const point = { date: new Date('2024-01-01T12:00:00Z'), level: 0.5 }
    const result = findClosestDataPoint([point], new Date('2024-01-01T13:00:00Z'))
    expect(result).toBe(point)
  })

  it('should find the closest point to target time', () => {
    const points = [
      { date: new Date('2024-01-01T10:00:00Z'), level: 0.3 },
      { date: new Date('2024-01-01T12:00:00Z'), level: 0.5 },
      { date: new Date('2024-01-01T14:00:00Z'), level: 0.7 },
    ]
    const target = new Date('2024-01-01T11:30:00Z')
    const result = findClosestDataPoint(points, target)
    expect(result).toBe(points[1]) // 12:00 is closest to 11:30
  })

  it('should handle exact matches', () => {
    const points = [
      { date: new Date('2024-01-01T10:00:00Z'), level: 0.3 },
      { date: new Date('2024-01-01T12:00:00Z'), level: 0.5 },
    ]
    const target = new Date('2024-01-01T12:00:00Z')
    const result = findClosestDataPoint(points, target)
    expect(result).toBe(points[1])
  })

  it('should handle points before the first point', () => {
    const points = [
      { date: new Date('2024-01-01T12:00:00Z'), level: 0.5 },
      { date: new Date('2024-01-01T14:00:00Z'), level: 0.7 },
    ]
    const target = new Date('2024-01-01T10:00:00Z')
    const result = findClosestDataPoint(points, target)
    expect(result).toBe(points[0])
  })

  it('should handle points after the last point', () => {
    const points = [
      { date: new Date('2024-01-01T10:00:00Z'), level: 0.3 },
      { date: new Date('2024-01-01T12:00:00Z'), level: 0.5 },
    ]
    const target = new Date('2024-01-01T15:00:00Z')
    const result = findClosestDataPoint(points, target)
    expect(result).toBe(points[1])
  })
})

describe('findCurrentEnergyLevel', () => {
  it('should return 0 for empty array', () => {
    const result = findCurrentEnergyLevel([], new Date())
    expect(result).toBe(0)
  })

  it('should return the level of the closest point', () => {
    const parsedData = [
      { date: new Date('2024-01-01T10:00:00Z'), level: 0.3 },
      { date: new Date('2024-01-01T12:00:00Z'), level: 0.5 },
      { date: new Date('2024-01-01T14:00:00Z'), level: 0.7 },
    ]
    const currentTime = new Date('2024-01-01T11:30:00Z')
    const result = findCurrentEnergyLevel(parsedData, currentTime)
    expect(result).toBe(0.5)
  })

  it('should handle exact time matches', () => {
    const parsedData = [{ date: new Date('2024-01-01T12:00:00Z'), level: 0.5 }]
    const currentTime = new Date('2024-01-01T12:00:00Z')
    const result = findCurrentEnergyLevel(parsedData, currentTime)
    expect(result).toBe(0.5)
  })
})

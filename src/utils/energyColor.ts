const ENERGY_COLORS = {
  high: '#256EFF', // >= 0.6
  medium: '#DC8F69', // >= 0.3
  low: '#B7148E', // < 0.3
}

export const getEnergyColor = (level: number) => {
  if (level >= 0.6) return ENERGY_COLORS.high
  if (level >= 0.3) return ENERGY_COLORS.medium
  return ENERGY_COLORS.low
}

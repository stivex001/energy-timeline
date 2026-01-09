const ENERGY_COLORS = {
  high: "#256EFF", // >= 0.6
  medium: "#DC8F69", // >= 0.3
  low: "#B7148E", // < 0.3
};

export const getEnergyColor = (level: number) => {
  if (level >= 0.6) return ENERGY_COLORS.high;
  if (level >= 0.3) return ENERGY_COLORS.medium;
  return ENERGY_COLORS.low;
};

export const getFocusState = (level: number): string => {
  if (level >= 0.6) return "High focus";
  if (level >= 0.3) return "Medium focus";
  return "Low focus";
};

export const formatTime12Hour = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

export const formatTimeLabel = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return minutes === 0
    ? `${displayHours} ${ampm}`
    : `${displayHours}:${minutes.toString().padStart(2, "0")}`;
};

export const findClosestDataPoint = <T extends { date: Date }>(
  data: T[],
  targetTime: Date
): T | null => {
  if (data.length === 0) return null;

  let closest = data[0];
  let minDiff = Math.abs(data[0].date.getTime() - targetTime.getTime());

  for (const point of data) {
    const diff = Math.abs(point.date.getTime() - targetTime.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }

  return closest;
};

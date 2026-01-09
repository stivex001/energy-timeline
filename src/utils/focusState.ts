export const getFocusState = (level: number): string => {
  if (level >= 0.6) return "High focus";
  if (level >= 0.3) return "Medium focus";
  return "Low focus";
};


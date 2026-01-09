export type HighlightWithDate = {
  time: string;
  label: string;
  color: string;
  date: Date;
};

export const processHighlightsWithDates = (
  highlights: Array<{ time: string; label: string; color: string }>
): HighlightWithDate[] => {
  return highlights.map((highlight) => ({
    ...highlight,
    date: new Date(highlight.time),
  }));
};

export const findCurrentPhase = (
  currentTime: Date,
  highlightsWithDates: HighlightWithDate[]
): HighlightWithDate | null => {
  if (highlightsWithDates.length === 0) return null;

  const sortedHighlights = [...highlightsWithDates].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Check if current time is between any two highlights
  for (let i = 0; i < sortedHighlights.length - 1; i++) {
    if (
      currentTime >= sortedHighlights[i].date &&
      currentTime < sortedHighlights[i + 1].date
    ) {
      return sortedHighlights[i];
    }
  }

  // If current time is after all highlights, return the last one
  return sortedHighlights[sortedHighlights.length - 1] || null;
};

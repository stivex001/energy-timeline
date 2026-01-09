export interface EnergyPoint {
  id: number;
  time: string;
  level: number;
}

export interface EnergyHighlight {
  time: string;
  label: string;
  color: string;
}

export interface TimelineMessage {
  title: string;
  description: string;
}

export type EnergyTimelineProps = {
  data: EnergyPoint[];
  highlights: EnergyHighlight[];
  currentTime: string;
  message: TimelineMessage;
};

export type HoveredPoint = {
  svgX: number;
  svgY: number;
  screenX: number;
  screenY: number;
  level: number;
  time: Date;
};

export type ParsedDataPoint = EnergyPoint & { date: Date };

export type ChartSegment = {
  path: string;
  color: string;
  startIndex: number;
  endIndex: number;
};

export type TimeLabel = {
  time: Date;
  x: number;
  label: string;
};

export type BackgroundSegment = {
  x1: number;
  x2: number;
  label: string;
};

export type HighlightWithPosition = EnergyHighlight & {
  x: number;
  y: number;
  date: Date;
  level: number;
};

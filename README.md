# Energy Timeline 

A React-based energy timeline visualization component that displays a user's energy levels throughout a 24-hour period as a smooth, color-coded curve using D3.js and SVG.

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/stivex001/energy-timeline.git
cd energy-timeline
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📋 Approach

### Architecture & Code Organization

I structured the project with a focus on **separation of concerns** and **reusability**:

#### Component Structure
```
src/components/EnergyTimeline/
├── EnergyTimeline.tsx          # Main container component
├── EnergyChart.tsx             # Chart visualization component
├── HighlightsLabels.tsx       # Highlights labels component
├── ChartTooltip.tsx            # Hover tooltip component
├── RecommendationText.tsx      # Recommendation text component
├── SleepInfoCards.tsx          # Sleep information cards
├── SleepDebt.tsx               # Sleep debt visualization
└── YourSleep.tsx               # Sleep graph component
```

#### Hooks Structure
```
src/hooks/
├── constants.ts                # Chart constants (width, height, margins)
├── useParsedData.ts            # Data parsing and interpolation
├── useChartScales.ts           # D3 scale calculations
├── useChartSegments.ts         # Curve segment generation
├── useTimeLabels.ts            # Time label generation
├── useHighlights.ts            # Highlight processing
├── useCurrentTimePosition.ts   # Current time indicator position
├── useBackgroundSegments.ts   # Background segment generation
├── useHover.ts                 # Mouse interaction handling
├── useEnergyInsights.ts        # Energy insights logic
└── useRealTime.ts              # Real-time tracking hook
```

#### Utils Structure
```
src/utils/
├── energyColor.ts              # Energy color calculation
├── focusState.ts               # Focus state calculation
├── timeFormatting.ts           # Time formatting functions
├── dataPointHelpers.ts         # Data point utilities
├── highlightHelpers.ts         # Highlight processing
├── chartSegments.ts            # Chart segment generation
├── chartTimeLabels.ts          # Time label generation
├── chartBackground.ts          # Background segment generation
└── chartHighlights.ts          # Highlight processing for chart
```

#### Key Design Decisions

1. **Modular Components**: Each UI element is extracted into its own reusable component
   - `HighlightsLabels` - Handles highlight labels positioning
   - `ChartTooltip` - Manages hover tooltip display
   - `RecommendationText` & `SleepInfoCards` - Separate content sections
   - `SleepDebt` & `YourSleep` - Sleep tracking visualizations

2. **Custom Hooks Pattern**: Chart logic is separated into individual hook files
   - Each hook in its own file within `src/hooks/` folder
   - `useParsedData` - Data transformation and interpolation
   - `useChartScales` - D3 scale calculations
   - `useChartSegments` - Curve segment generation
   - `useHover` - Mouse interaction handling
   - `useEnergyInsights` - Energy insights and phase detection
   - `useRealTime` - Real-time tracking with automatic updates
   - Each hook has a single responsibility and is easily testable

3. **Utility Functions**: Pure functions organized by concern
   - Each utility in its own file within `src/utils/` folder
   - `energyColor.ts` - Energy level color mapping
   - `focusState.ts` - Focus state calculation
   - `timeFormatting.ts` - Time formatting utilities
   - `dataPointHelpers.ts` - Data point finding and energy level calculation
   - `highlightHelpers.ts` - Highlight processing and phase detection
   - Chart-specific utilities separated (segments, labels, backgrounds, highlights)

4. **Type Safety**: All types centralized in `components/type.ts`
   - Single source of truth for type definitions
   - Easy to maintain and extend
   - Shared across components, hooks, and utilities

### Implementation Details

#### Energy Curve Rendering
- Uses D3.js `scaleTime` for x-axis (time) and `scaleLinear` for y-axis (energy level 0-1)
- Implements `d3.line()` with `curveCatmullRom` for smooth curve interpolation
- Data points are interpolated every 15 minutes for smoother visualization
- Curve is split into colored segments based on energy thresholds
- Real-time indicator updates automatically every minute to show current position

#### Color Coding
- **High energy (≥ 0.6)**: `#256EFF` (Blue)
- **Medium energy (≥ 0.3)**: `#DC8F69` (Orange)
- **Low energy (< 0.3)**: `#B7148E` (Pink/Magenta)

#### Interactive Features
- **Hover Tooltip**: Shows current phase label and focus state when hovering over the curve
- **Current Time Indicator**: Dashed white vertical line with dot showing real-time position
- **Real-time Updates**: Current time indicator and insights update automatically every minute
- **Dynamic Messages**: Title and description change based on current energy level and phase
- **Responsive SVG**: Uses `viewBox` for proper scaling across screen sizes

#### Layout
- Modal-style container with sticky header
- Scrollable content area with hidden scrollbar
- Gradient background matching design specifications

## ⚖️ Tradeoffs & Assumptions

### Tradeoffs

1. **Data Interpolation**
   - **Decision**: Interpolate data points every 15 minutes between hourly data
   - **Tradeoff**: More data points = smoother curve but slightly more computation
   - **Rationale**: Better visual appearance outweighs minimal performance cost

2. **Component Extraction**
   - **Decision**: Extracted many small components (HighlightsLabels, ChartTooltip, etc.)
   - **Tradeoff**: More files but better maintainability
   - **Rationale**: Easier to test, modify, and reuse components

3. **Hooks and Utils Organization**
   - **Decision**: Separated hooks and utilities into dedicated folders with individual files
   - **Tradeoff**: More files but better organization and discoverability
   - **Rationale**: Each hook/utility has a single responsibility, making code easier to understand and maintain

4. **Direct Data Import**
   - **Decision**: Component imports data directly instead of props drilling
   - **Tradeoff**: Less flexible but cleaner for this use case
   - **Rationale**: Avoids unnecessary prop passing for a self-contained component

5. **Real-time Updates**
   - **Decision**: Implemented real-time tracking that updates every minute
   - **Tradeoff**: Slight performance cost but provides live updates
   - **Rationale**: Better user experience with always-current information

### Assumptions

1. **Time Format**: Assumes ISO 8601 format for time strings (`YYYY-MM-DDTHH:mm:ssZ`)

2. **Energy Levels**: Assumes energy values are normalized between 0 and 1

3. **24-Hour Period**: Assumes data spans exactly 24 hours (midnight to midnight)

4. **Browser Support**: Assumes modern browsers with SVG and CSS Grid support

5. **Data Structure**: Assumes data points are sorted chronologically

6. **Responsive Design**: Assumes the component will be used in a container with max-width constraints

## 🛠️ Technical Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **D3.js v7** - Data visualization and scales
- **Tailwind CSS v4** - Styling (CSS-first configuration)
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
energy-timeline/
├── src/
│   ├── components/
│   │   ├── EnergyTimeline/      # Main timeline component
│   │   │   ├── EnergyTimeline.tsx
│   │   │   ├── EnergyChart.tsx
│   │   │   ├── HighlightsLabels.tsx
│   │   │   ├── ChartTooltip.tsx
│   │   │   ├── RecommendationText.tsx
│   │   │   ├── SleepInfoCards.tsx
│   │   │   ├── SleepDebt.tsx
│   │   │   └── YourSleep.tsx
│   │   └── type.ts              # TypeScript type definitions
│   ├── hooks/                   # Custom React hooks
│   │   ├── constants.ts
│   │   ├── useParsedData.ts
│   │   ├── useChartScales.ts
│   │   ├── useChartSegments.ts
│   │   ├── useTimeLabels.ts
│   │   ├── useHighlights.ts
│   │   ├── useCurrentTimePosition.ts
│   │   ├── useBackgroundSegments.ts
│   │   ├── useHover.ts
│   │   ├── useEnergyInsights.ts
│   │   └── useRealTime.ts
│   ├── utils/                   # Utility functions
│   │   ├── energyColor.ts
│   │   ├── focusState.ts
│   │   ├── timeFormatting.ts
│   │   ├── dataPointHelpers.ts
│   │   ├── highlightHelpers.ts
│   │   ├── chartSegments.ts
│   │   ├── chartTimeLabels.ts
│   │   ├── chartBackground.ts
│   │   └── chartHighlights.ts
│   ├── data/
│   │   └── sampleData.ts        # Sample energy data
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── package.json
├── vite.config.ts
└── README.md
```

## ✨ Features

- ✅ 24-hour energy timeline visualization
- ✅ Smooth, color-coded energy curve with Catmull-Rom interpolation
- ✅ Real-time updates (indicator and insights update every minute)
- ✅ Dynamic title and description based on current energy level and phase
- ✅ Interactive hover tooltips showing phase and focus state
- ✅ Current time indicator with dashed line and dot
- ✅ Energy phase highlights with labels
- ✅ Time labels with 12-hour format (displayed every 4 hours)
- ✅ Background day segments
- ✅ Sleep debt and sleep graph visualizations
- ✅ Modal-style layout with sticky header
- ✅ Scrollable content with hidden scrollbar
- ✅ Responsive design
- ✅ Clean, maintainable code structure with separated concerns

## 🎨 Design Notes

- Dark theme with gradient background (`#101929` to `#08090d`)
- Color-coded energy levels for quick visual understanding
- Subtle background segments for day parts
- Clean typography and spacing
- Hidden scrollbar for cleaner appearance

## 📝 Notes

- The component is self-contained and imports its own data
- All styling uses Tailwind CSS (CSS variables used for dynamic values)
- The chart is responsive and scales properly with viewBox
- Hover interactions work correctly with SVG coordinate transformations
- Real-time indicator automatically tracks current time and updates every minute
- Dynamic messages provide contextual insights based on current energy state
- Code is organized with hooks and utilities in separate folders for better maintainability
- Font family: Segoe UI Variable Display (applied globally)

## 🔮 Future Enhancements

Potential improvements for production:
- Add animation transitions for data updates
- Implement zoom/pan functionality
- Add data export capabilities
- Support for multiple day views
- Accessibility improvements (ARIA labels, keyboard navigation)
- Performance optimizations for large datasets

# Energy Timeline - Web Developer Interview Task

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
├── EnergyChartNew.tsx          # Chart visualization component
├── HighlightsLabels.tsx       # Highlights labels component
├── ChartTooltip.tsx            # Hover tooltip component
├── RecommendationText.tsx      # Recommendation text component
├── SleepInfoCards.tsx          # Sleep information cards
├── useChartHooks.ts            # Custom React hooks for chart logic
├── chartHelpers.ts             # Chart calculation helpers
└── utils.ts                    # Utility functions
```

#### Key Design Decisions

1. **Modular Components**: Each UI element is extracted into its own reusable component
   - `HighlightsLabels` - Handles highlight labels positioning
   - `ChartTooltip` - Manages hover tooltip display
   - `RecommendationText` & `SleepInfoCards` - Separate content sections

2. **Custom Hooks Pattern**: Chart logic is separated into custom hooks
   - `useParsedData` - Data transformation
   - `useChartScales` - D3 scale calculations
   - `useChartSegments` - Curve segment generation
   - `useHover` - Mouse interaction handling
   - Each hook has a single responsibility

3. **Helper Functions**: Pure functions for calculations
   - `chartHelpers.ts` - Chart-specific calculations (segments, labels, backgrounds)
   - `utils.ts` - General utilities (color mapping, time formatting, data finding)

4. **Type Safety**: All types centralized in `type.ts`
   - Single source of truth for type definitions
   - Easy to maintain and extend

### Implementation Details

#### Energy Curve Rendering
- Uses D3.js `scaleTime` for x-axis (time) and `scaleLinear` for y-axis (energy level 0-1)
- Implements `d3.line()` with `curveCatmullRom` for smooth curve interpolation
- Data points are interpolated every 15 minutes for smoother visualization
- Curve is split into colored segments based on energy thresholds

#### Color Coding
- **High energy (≥ 0.6)**: `#256EFF` (Blue)
- **Medium energy (≥ 0.3)**: `#DC8F69` (Orange)
- **Low energy (< 0.3)**: `#B7148E` (Pink/Magenta)

#### Interactive Features
- **Hover Tooltip**: Shows current phase label and focus state
- **Current Time Indicator**: White vertical line with dot showing current position
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

3. **Direct Data Import**
   - **Decision**: Component imports data directly instead of props drilling
   - **Tradeoff**: Less flexible but cleaner for this use case
   - **Rationale**: Avoids unnecessary prop passing for a self-contained component

4. **Highlight Filtering**
   - **Decision**: Show all highlights (filtering removed per user preference)
   - **Tradeoff**: Potential overlap but shows complete information
   - **Rationale**: User requested to show all highlights

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
│   │   │   ├── EnergyChartNew.tsx
│   │   │   ├── HighlightsLabels.tsx
│   │   │   ├── ChartTooltip.tsx
│   │   │   ├── RecommendationText.tsx
│   │   │   ├── SleepInfoCards.tsx
│   │   │   ├── useChartHooks.ts
│   │   │   ├── chartHelpers.ts
│   │   │   └── utils.ts
│   │   └── type.ts              # TypeScript type definitions
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
- ✅ Smooth, color-coded energy curve
- ✅ Interactive hover tooltips
- ✅ Current time indicator
- ✅ Energy phase highlights
- ✅ Time labels with 12-hour format
- ✅ Background day segments
- ✅ Modal-style layout with sticky header
- ✅ Responsive design
- ✅ Clean, maintainable code structure

## 🎨 Design Notes

- Dark theme with gradient background (`#101929` to `#08090d`)
- Color-coded energy levels for quick visual understanding
- Subtle background segments for day parts
- Clean typography and spacing
- Hidden scrollbar for cleaner appearance

## 📝 Notes

- The component is self-contained and imports its own data
- All styling uses Tailwind CSS (no inline styles except for dynamic positioning)
- The chart is responsive and scales properly with viewBox
- Hover interactions work correctly with SVG coordinate transformations

## 🔮 Future Enhancements

Potential improvements for production:
- Add animation transitions for data updates
- Implement zoom/pan functionality
- Add data export capabilities
- Support for multiple day views
- Accessibility improvements (ARIA labels, keyboard navigation)
- Performance optimizations for large datasets

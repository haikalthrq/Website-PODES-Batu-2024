# Analysis Module Documentation

This module implements the generic, config-driven "Ringkasan Seluruh Indikator" section that works consistently across ALL categories in the PODES Batu 2024 dashboard.

## Architecture Overview

The analysis module follows a data-driven approach where new categories and indicators can be added through configuration without code changes.

### Key Components

- **`IndicatorsSummary.jsx`** - Main accordion container component
- **`IndicatorPanel.jsx`** - Individual indicator panel with charts and statistics
- **`useIndicatorComputations.js`** - Custom hook for data processing
- **`BarChartHorizontal.jsx`** - Ranking chart wrapper
- **`BarChartSimple.jsx`** - Distribution chart wrapper  
- **`RankingTable.jsx`** - Collapsible ranking table

### Configuration System

Categories and indicators are configured in `src/config/categories.config.js`.

## Adding New Categories

To add a new category with quantitative indicators:

### 1. Update Categories Configuration

Edit `src/config/categories.config.js`:

```javascript
export const CATEGORIES_CONFIG = {
  // Existing categories...
  
  ekonomi: {
    key: 'Ekonomi',
    title: 'Ekonomi',
    defaultOpenIndicator: 'pasar',
    indicators: [
      {
        key: 'pasar',
        label: 'Jumlah Pasar',
        dataKey: 'jumlah_pasar',
        accessor: (row) => row.jumlah_pasar || 0,
        colorTokens: {
          ranking: CHART_COLORS.blue,
          distribusi: CHART_COLORS.green
        },
        icon: '🏪'
      },
      // Add more indicators...
    ]
  }
};
```

### 2. Field Mapping

- **`key`** - Unique identifier for the indicator
- **`label`** - Display name for the indicator
- **`dataKey`** - Field name in the data source
- **`accessor`** - Function to extract the value from data row
- **`colorTokens`** - Chart colors (ranking and distribution)
- **`icon`** - Emoji icon for the accordion header

### 3. Data Requirements

Ensure your data source contains the quantitative fields referenced in `dataKey`. The `accessor` function should handle null/undefined values gracefully.

## Usage in Components

The `IndicatorsSummary` component automatically renders for any category with quantitative indicators:

```jsx
import IndicatorsSummary from '../analysis/IndicatorsSummary';

// In your component
<IndicatorsSummary 
  categoryKey={filters.category}  // e.g., 'Pendidikan', 'Kesehatan'
  data={data}
  filteredData={filteredData}
/>
```

## Features

### Responsive Design
- 2 columns on desktop (≥1024px)
- 1 column on tablet/mobile (<1024px)
- Charts adapt to container size

### Accessibility
- Keyboard navigation support
- ARIA attributes on accordions
- Semantic headings and labels
- High contrast colors (WCAG AA)

### Performance
- Lazy rendering of collapsed panels
- Memoized computations
- Optimized chart rendering

### Data Export
- Excel export functionality
- Configurable column formats
- Automatic file naming

## Customization

### Chart Colors
Update `CHART_COLORS` in the config file to change color schemes:

```javascript
export const CHART_COLORS = {
  teal: '#14b8a6',
  magenta: '#d946ef',
  // Add custom colors...
};
```

### Chart Behavior
Modify chart wrapper components in `src/analysis/charts/` to change:
- Maximum displayed items
- Tooltip formats
- Axis configurations
- Chart margins and styling

### Statistics Computation
The `useIndicatorComputations` hook handles:
- Ranking calculations (sorted descending)
- Distribution analysis (Ada/Tidak Ada)
- Summary statistics (min, max, total, average)

## Integration Notes

This system integrates with the existing filter system in AnalysisPage. The section only appears when:
1. Filter indicator is set to "Semua" (show all indicators)
2. The selected category has quantitative indicators configured
3. Data is available

## Troubleshooting

### Category Not Showing
- Verify category key matches exactly between filter system and config
- Check that indicators array is not empty
- Ensure `hasQuantitativeIndicators()` returns true

### Data Not Loading
- Verify `accessor` functions return numeric values
- Check data source contains the specified `dataKey` fields
- Ensure null/undefined values are handled (defaulted to 0)

### Chart Issues
- Verify color tokens are valid hex colors
- Check that chart data arrays are not empty
- Ensure responsive container has proper dimensions

## Development

When developing new features:

1. **Add to config first** - Define new categories/indicators in configuration
2. **Test with real data** - Verify accessor functions work with actual data structure  
3. **Check all screen sizes** - Test responsive behavior on different devices
4. **Validate accessibility** - Ensure keyboard navigation and screen readers work
5. **Performance test** - Check for memory leaks or excessive re-renders

## Dependencies

- React 18+
- Material-UI (MUI) v5+
- Recharts for visualization
- XLSX for Excel export
- Existing project chart styling system
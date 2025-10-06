# 📦 Component Library

> **Reusable React components untuk Dashboard PODES**

## 🧩 Component Architecture

Komponen-komponen dibagi berdasarkan fungsi dan tingkat reusability:

```
components/
├── 📁 charts/           # Chart visualization components
├── 📁 common/           # Generic reusable components  
├── 📁 theme/            # Styling dan color systems
├── 📁 layout/           # Layout components
└── 📄 domain-specific/  # Business logic components
```

---

## 📊 Chart Components

### DonutWithLegend
**Interactive donut chart dengan legend**

```jsx
import DonutWithLegend from '../components/charts/DonutWithLegend';

<DonutWithLegend
  title="Distribusi Data"
  data={[
    { label: 'Category 1', value: 45, color: '#22c55e' },
    { label: 'Category 2', value: 30, color: '#3b82f6' },
    { label: 'Category 3', value: 25, color: '#f59e0b' }
  ]}
  height={320}
  showPercentages={true}
/>
```

**Props:**
- `title` (string): Chart title
- `data` (array): Data dengan format `{label, value, color}`
- `height` (number): Chart height in pixels
- `showPercentages` (boolean): Show percentage labels

---

### BarGroupedStacked
**Stacked bar chart untuk distribusi per kecamatan**

```jsx
import BarGroupedStacked from '../components/charts/BarGroupedStacked';

<BarGroupedStacked
  title="Distribusi per Kecamatan"
  mode="qualitative"
  rows={villageData}
  valueKey="field_name"
  categories={['Category1', 'Category2']}
  displayLabels={{
    'Long Category Name': 'Short'
  }}
  height={320}
/>
```

**Props:**
- `title` (string): Chart title
- `mode` ('qualitative' | 'numeric-bins'): Data type
- `rows` (array): Village data array
- `valueKey` (string): Field name to analyze
- `categories` (array): Expected categories
- `displayLabels` (object): Label mapping untuk shorter text
- `height` (number): Chart height

---

## 🔧 Common Components

### StatCard
**KPI display card**

```jsx
import { StatCard } from '../components/common/ChartCard';

<StatCard
  title="Total Desa"
  value="24"
  icon="🏘️"
  color="primary"
/>
```

**Props:**
- `title` (string): Stat label
- `value` (string|number): Stat value
- `icon` (string): Emoji icon
- `color` ('primary'|'secondary'|'success'|'warning'): Color theme

---

### EmptyState
**Placeholder untuk data kosong**

```jsx
import { EmptyState } from '../components/common';

<EmptyState 
  title="Tidak ada data"
  subtitle="Coba pilih filter yang berbeda"
  icon="📊"
/>
```

**Props:**
- `title` (string): Main message
- `subtitle` (string, optional): Additional context
- `icon` (string, optional): Emoji icon

---

### LoadingSpinner
**Loading indicator**

```jsx
import { LoadingSpinner } from '../components/common';

<LoadingSpinner 
  size="medium"
  message="Memuat data..."
/>
```

**Props:**
- `size` ('small'|'medium'|'large'): Spinner size
- `message` (string, optional): Loading message

---

## 🎨 Theme Components

### Color System
**Konsisten color palette**

```jsx
import { getCategoryColor, getBinColor } from '../components/theme/chartColors';

// Get color for category
const color = getCategoryColor('Category Name', index);

// Get color for numeric bin
const binColor = getBinColor(binIndex);
```

**Available Color Sets:**
- `QUALITATIVE`: Array warna untuk data kategori
- `BINS`: Array warna untuk data numerik
- `SIGNAL_COLORS`: Warna khusus untuk kualitas sinyal
- `INTERNET_COLORS`: Warna untuk jenis internet
- `BINARY_COLORS`: Warna untuk data Ada/Tidak Ada

---

## 🏗️ Layout Components

### IndicatorGrid
**Grid layout untuk charts**

```jsx
import IndicatorGrid from '../components/layout/IndicatorGrid';

<IndicatorGrid>
  <Card>Chart 1</Card>
  <Card>Chart 2</Card>
</IndicatorGrid>
```

**Features:**
- Responsive grid (1 kolom mobile, 2 kolom desktop)
- Equal height cards
- Consistent spacing

---

### IndicatorSection  
**Section wrapper with title**

```jsx
import { IndicatorSection } from '../components/layout/IndicatorGrid';

<IndicatorSection title="📊 Visualisasi Data">
  <ChartComponent />
</IndicatorSection>
```

**Props:**
- `title` (string): Section title dengan emoji

---

## 🏢 Domain-Specific Components

### InfrastructureIndicatorContent
**Container untuk infrastructure indicators**

```jsx
import InfrastructureIndicatorContent from '../components/InfrastructureIndicatorContent';

<InfrastructureIndicatorContent
  indicatorKey="penerangan_jalan_utama"
  villageData={data}
  filters={currentFilters}
/>
```

**Features:**
- Registry-based configuration
- Automatic chart type selection
- Reusable untuk semua infrastructure indicators

---

### EnhancedInfrastructureIndicators
**Chart rendering untuk infrastructure data**

```jsx
import EnhancedInfrastructureIndicators from '../components/EnhancedInfrastructureIndicators';

<EnhancedInfrastructureIndicators
  indicatorKey="indicator_key"
  config={registryConfig}
  villageData={data}
  isAccordionOpen={true}
  accordionId="accordion_id"
/>
```

**Features:**
- Registry config integration
- Performance optimized rendering
- Statistics dan charts dalam satu component

---

## 🎯 Component Patterns

### 1. Container vs Presentation Pattern

**Container Components (Smart)**
```jsx
// Handles business logic
const InfrastructureContainer = ({ filters }) => {
  const config = getIndicatorConfig(filters.indicator);
  const processedData = processData(data, config);
  
  return (
    <PresentationComponent 
      config={config} 
      data={processedData} 
    />
  );
};
```

**Presentation Components (Dumb)**
```jsx
// Only handles UI rendering
const ChartPresentation = ({ title, data, height }) => {
  return (
    <Card>
      <CardHeader title={title} />
      <ChartRenderer data={data} height={height} />
    </Card>
  );
};
```

### 2. Custom Hooks Pattern

```jsx
// Reusable stateful logic
const useChartData = (rawData, config) => {
  return useMemo(() => {
    return transformDataForChart(rawData, config);
  }, [rawData, config]);
};

// Usage in component
const MyChart = ({ data, config }) => {
  const chartData = useChartData(data, config);
  return <Chart data={chartData} />;
};
```

### 3. Composition Pattern

```jsx
// Flexible component composition
<IndicatorSection title="Data Analysis">
  <IndicatorGrid>
    <StatCard title="Total" value="24" />
    <DonutChart data={data} />
    <BarChart data={data} />
  </IndicatorGrid>
</IndicatorSection>
```

---

## ⚡ Performance Best Practices

### 1. Memoization
```jsx
// Memo untuk expensive calculations
const processedData = useMemo(() => {
  return expensiveDataTransformation(rawData);
}, [rawData]);

// Memo untuk component re-renders
const MemoizedChart = React.memo(ChartComponent);
```

### 2. Conditional Rendering
```jsx
// Render charts only when needed
{isAccordionOpen && (
  <ExpensiveChartComponent data={data} />
)}
```

### 3. Lazy Loading
```jsx
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyChart data={data} />
</Suspense>
```

---

## 🧪 Testing Components

### Unit Testing Example
```jsx
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

test('renders stat card with correct value', () => {
  render(
    <StatCard 
      title="Total Villages" 
      value="24" 
      icon="🏘️" 
    />
  );
  
  expect(screen.getByText('Total Villages')).toBeInTheDocument();
  expect(screen.getByText('24')).toBeInTheDocument();
});
```

### Integration Testing
```jsx
test('chart updates when data changes', () => {
  const { rerender } = render(
    <DonutChart data={initialData} />
  );
  
  // Change data
  rerender(<DonutChart data={updatedData} />);
  
  // Assert chart updated
  expect(screen.getByText('New Category')).toBeInTheDocument();
});
```

---

## 📚 Usage Guidelines

### 1. **Consistent Styling**
```jsx
// ✅ Good: Use theme colors
<StatCard color="primary" />

// ❌ Bad: Hardcoded colors
<StatCard style={{ color: '#ff0000' }} />
```

### 2. **Prop Validation**
```jsx
// Use PropTypes for validation
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  icon: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning'])
};
```

### 3. **Error Boundaries**
```jsx
// Wrap risky components
<ErrorBoundary fallback={<ErrorState />}>
  <ComplexChartComponent />
</ErrorBoundary>
```

---

## 🔧 Creating New Components

### Component Template
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 */
const MyComponent = ({ title, children, ...props }) => {
  return (
    <Box {...props}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Box>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

MyComponent.defaultProps = {
  children: null
};

export default MyComponent;
```

### File Structure Convention
```
components/
├── MyComponent/
│   ├── index.js          # Main export
│   ├── MyComponent.jsx   # Component implementation
│   ├── MyComponent.test.jsx  # Unit tests
│   └── README.md         # Component documentation
```

---

**💡 Tips untuk Developer**

1. **Keep it Simple**: Komponen harus punya single responsibility
2. **Reusability**: Buat komponen yang bisa dipakai di banyak tempat
3. **Performance**: Gunakan memo dan lazy loading untuk komponen berat
4. **Documentation**: Tulis JSDoc comments untuk props dan function
5. **Testing**: Test komponen dengan berbagai props dan scenarios
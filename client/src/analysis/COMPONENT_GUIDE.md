# 🔍 Analysis Module

> **Business logic dan data analysis untuk Dashboard PODES**

## 🎯 Overview

Module analysis berisi logic untuk menganalisis data desa dan menghasilkan insights yang berguna. Module ini terpisah dari UI components untuk maintainability yang lebih baik.

---

## 📊 Core Functions

### Data Processing
```javascript
import { processVillageData, calculateStatistics } from '../analysis/dataProcessing';

// Process raw village data
const processedData = processVillageData(rawVillageData, filters);

// Calculate summary statistics
const stats = calculateStatistics(processedData, 'field_name');
```

### Statistical Analysis
```javascript
import { 
  getDistribution, 
  getPercentages, 
  getModeValue 
} from '../analysis/statistics';

// Get value distribution
const distribution = getDistribution(data, 'field_name');

// Calculate percentages
const percentages = getPercentages(distribution);

// Find most common value
const mode = getModeValue(data, 'field_name');
```

---

## 🧮 Analysis Components

### IndicatorsSummary
**Statistical summary untuk indicators**

```jsx
import IndicatorsSummary from '../analysis/IndicatorsSummary';

<IndicatorsSummary
  title="Ringkasan Statistik"
  data={villageData}
  field="infrastruktur_field"
  categories={['Ada', 'Tidak Ada']}
/>
```

**Features:**
- Total count calculation
- Distribution analysis  
- Most common value detection
- Percentage calculations

---

### IndicatorPanel
**Comprehensive analysis panel**

```jsx
import { IndicatorPanel } from '../analysis/IndicatorPanel';

<IndicatorPanel
  indicatorKey="penerangan_jalan"
  config={indicatorConfig}
  villageData={data}
  showCharts={true}
  showStatistics={true}
/>
```

**Features:**
- Registry-based configuration
- Chart dan statistik integration
- Flexible display options
- Performance optimized

---

### UniversalIndicatorPanel
**Universal panel yang support multiple categories**

```jsx
import { UniversalIndicatorPanel } from '../analysis/universal/UniversalIndicatorPanel';

<UniversalIndicatorPanel
  category="lingkungan"
  indicator="status_rambu_evakuasi"
  config={indicatorConfig}
  villageData={data}
/>
```

**Features:**
- Support Infrastructure & Environment categories
- Automatic component routing
- Registry-based configuration
- Unified rendering pattern

---

### useComparisonData Hook
**Custom hook untuk comparison mode**

```jsx
import { useComparisonData } from '../hooks/useComparisonData';

const ComparisonView = ({ category, indicators }) => {
  const { data, loading, error } = useComparisonData(category, indicators);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState />;

  return <ComparisonTable data={data} />;
};
```

**Features:**
- Fetches comparison data for multiple indicators
- Handles loading and error states
- Memoized data processing
- Support for qualitative and quantitative data

---

## 📈 Chart Integration

### Chart Data Transformation
```javascript
import { transformForDonut, transformForBar } from '../analysis/chartTransforms';

// Transform untuk donut chart
const donutData = transformForDonut(villageData, 'field_name', categories);

// Transform untuk bar chart
const barData = transformForBar(villageData, 'field_name', 'kecamatan');
```

### Environment Data Adapter
```javascript
import { environmentDataAdapter } from '../adapters/environmentDataAdapter';

// Process indicator data
const processedData = environmentDataAdapter.processIndicatorData(
  villageData,
  'status_rambu_evakuasi',
  ['Ada', 'Tidak Ada']
);

// Process stacked data (per kecamatan)
const stackedData = environmentDataAdapter.processStackedData(
  villageData,
  'status_rambu_evakuasi',
  ['Ada', 'Tidak Ada']
);
```

**Features:**
- Separation of concerns (data vs visualization)
- Reusable transformation logic
- Optimized performance
- Type-safe data handling

### Chart Utilities
```javascript
import { 
  getChartColors, 
  formatChartLabels, 
  calculateChartHeight 
} from '../analysis/chartUtils';

// Get appropriate colors
const colors = getChartColors(categories, 'qualitative');

// Format labels untuk display
const labels = formatChartLabels(categories, displayLabels);

// Calculate optimal height
const height = calculateChartHeight(dataLength, chartType);
```

---

## 🔧 Utility Functions

### Data Filtering
```javascript
import { applyFilters, filterByKecamatan } from '../analysis/filters';

// Apply complex filters
const filtered = applyFilters(data, {
  kecamatan: 'Batu',
  year: 2024,
  indicator: 'penerangan'
});

// Filter by specific kecamatan
const kecamatanData = filterByKecamatan(data, 'Batu');
```

### Data Validation
```javascript
import { validateData, checkDataIntegrity } from '../analysis/validation';

// Validate data structure
const isValid = validateData(data, requiredFields);

// Check data integrity
const integrity = checkDataIntegrity(data, constraints);
```

---

## 📋 Analysis Hooks

### useIndicatorAnalysis
**Custom hook untuk indicator analysis**

```jsx
import { useIndicatorAnalysis } from '../analysis/hooks/useIndicatorAnalysis';

const MyComponent = ({ indicatorKey, data }) => {
  const {
    statistics,
    chartData,
    isLoading,
    error
  } = useIndicatorAnalysis(indicatorKey, data);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <Statistics data={statistics} />
      <Chart data={chartData} />
    </div>
  );
};
```

### useDataFiltering
**Hook untuk data filtering logic**

```jsx
import { useDataFiltering } from '../analysis/hooks/useDataFiltering';

const FilteredView = ({ rawData, initialFilters }) => {
  const {
    filteredData,
    filters,
    updateFilter,
    clearFilters,
    filterCount
  } = useDataFiltering(rawData, initialFilters);

  return (
    <div>
      <FilterControls 
        filters={filters}
        onUpdate={updateFilter}
        onClear={clearFilters}
      />
      <DataView data={filteredData} />
      <div>Showing {filterCount} results</div>
    </div>
  );
};
```

---

## 🎯 Analysis Patterns

### 1. Data Pipeline Pattern
```javascript
// Clear data transformation pipeline
const analyzeIndicator = (rawData, config) => {
  return rawData
    .pipe(validateInput)
    .pipe(applyFilters(config.filters))
    .pipe(transformData(config.transformation))
    .pipe(calculateStatistics)
    .pipe(formatOutput);
};
```

### 2. Strategy Pattern untuk Analysis
```javascript
// Different analysis strategies
const analysisStrategies = {
  qualitative: new QualitativeAnalysis(),
  numeric: new NumericAnalysis(),
  binary: new BinaryAnalysis()
};

const analyzeData = (data, type) => {
  const strategy = analysisStrategies[type];
  return strategy.analyze(data);
};
```

### 3. Observer Pattern untuk Updates
```javascript
// Listen untuk data changes
class DataAnalyzer {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }

  analyzeData(data) {
    const results = this.performAnalysis(data);
    this.notify(results);
    return results;
  }
}
```

---

## 📊 Statistical Methods

### Descriptive Statistics
```javascript
import { DescriptiveStats } from '../analysis/statistics/descriptive';

const stats = new DescriptiveStats(data);

console.log({
  mean: stats.mean(),
  median: stats.median(),
  mode: stats.mode(),
  standardDeviation: stats.stdDev(),
  variance: stats.variance(),
  range: stats.range()
});
```

### Distribution Analysis
```javascript
import { Distribution } from '../analysis/statistics/distribution';

const dist = new Distribution(data, 'field_name');

console.log({
  frequency: dist.getFrequency(),
  relativeFrequency: dist.getRelativeFrequency(),
  cumulativeFrequency: dist.getCumulativeFrequency(),
  percentiles: dist.getPercentiles([25, 50, 75, 90])
});
```

### Comparative Analysis
```javascript
import { compareGroups } from '../analysis/statistics/comparative';

// Compare between kecamatan
const comparison = compareGroups(data, {
  groupBy: 'kecamatan',
  measure: 'penerangan_jalan',
  method: 'percentage'
});

console.log(comparison);
// Output: { 'Batu': 85%, 'Bumiaji': 92%, 'Junrejo': 78% }
```

---

## 🔍 Advanced Analysis

### Correlation Analysis
```javascript
import { calculateCorrelation } from '../analysis/advanced/correlation';

// Find correlation between indicators
const correlation = calculateCorrelation(data, [
  'penerangan_jalan',
  'sinyal_hp',
  'internet_wifi'
]);

console.log(correlation);
// Output: correlation matrix
```

### Clustering Analysis
```javascript
import { performClustering } from '../analysis/advanced/clustering';

// Group villages by similar characteristics
const clusters = performClustering(data, {
  features: ['penerangan', 'sinyal', 'internet'],
  method: 'kmeans',
  clusters: 3
});

console.log(clusters);
// Output: village clusters
```

### Trend Analysis
```javascript
import { analyzeTrends } from '../analysis/advanced/trends';

// Analyze trends over time (if temporal data available)
const trends = analyzeTrends(historicalData, {
  indicator: 'penerangan_jalan',
  period: 'yearly',
  method: 'linear'
});

console.log(trends);
// Output: trend statistics
```

---

## ⚡ Performance Optimization

### Memoized Calculations
```javascript
import { memoize } from 'lodash';

// Cache expensive calculations
const expensiveAnalysis = memoize((data, config) => {
  return performComplexAnalysis(data, config);
}, (data, config) => `${data.length}-${JSON.stringify(config)}`);
```

### Lazy Loading
```javascript
// Load analysis modules only when needed
const loadAdvancedAnalysis = async () => {
  const module = await import('../analysis/advanced');
  return module.default;
};
```

### Web Workers untuk Heavy Analysis
```javascript
// Offload heavy calculations to web worker
const analyzeInWorker = (data) => {
  return new Promise((resolve) => {
    const worker = new Worker('./analysisWorker.js');
    worker.postMessage(data);
    worker.onmessage = (event) => {
      resolve(event.data);
      worker.terminate();
    };
  });
};
```

---

## 🧪 Testing Analysis Functions

### Unit Testing
```javascript
import { calculatePercentages } from '../analysis/statistics';

describe('calculatePercentages', () => {
  test('calculates correct percentages', () => {
    const input = { 'Ada': 18, 'Tidak Ada': 6 };
    const result = calculatePercentages(input);
    
    expect(result).toEqual({
      'Ada': 75,
      'Tidak Ada': 25
    });
  });

  test('handles empty data', () => {
    const result = calculatePercentages({});
    expect(result).toEqual({});
  });
});
```

### Integration Testing
```javascript
import { analyzeIndicator } from '../analysis';

describe('analyzeIndicator integration', () => {
  test('full analysis pipeline', () => {
    const mockData = [
      { kecamatan: 'Batu', penerangan: 'Ada' },
      { kecamatan: 'Batu', penerangan: 'Tidak Ada' }
    ];

    const result = analyzeIndicator(mockData, 'penerangan');

    expect(result).toHaveProperty('statistics');
    expect(result).toHaveProperty('chartData');
    expect(result.statistics.total).toBe(2);
  });
});
```

---

## 📚 Best Practices

### 1. **Pure Functions**
```javascript
// ✅ Good: Pure function
const calculateTotal = (data) => {
  return data.reduce((sum, item) => sum + item.value, 0);
};

// ❌ Bad: Side effects
let globalTotal = 0;
const calculateTotal = (data) => {
  globalTotal = data.reduce((sum, item) => sum + item.value, 0);
  return globalTotal;
};
```

### 2. **Error Handling**
```javascript
// ✅ Good: Proper error handling
const analyzeData = (data) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('Data is empty or invalid');
    }
    
    return performAnalysis(data);
  } catch (error) {
    console.error('Analysis failed:', error);
    return { error: error.message, data: null };
  }
};
```

### 3. **Type Safety**
```javascript
// ✅ Good: Input validation
const calculateAverage = (numbers) => {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Input must be an array');
  }
  
  const validNumbers = numbers.filter(n => typeof n === 'number');
  return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
};
```

---

**💡 Development Tips**

1. **Modular Design**: Pisahkan business logic dari UI components
2. **Reusable Functions**: Buat functions yang bisa dipakai di banyak tempat
3. **Performance**: Cache hasil expensive calculations
4. **Testing**: Test semua edge cases dan error scenarios
5. **Documentation**: Dokumentasikan complex algorithms dan business rules
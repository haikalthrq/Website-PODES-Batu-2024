# 🌿 Environment Registry Pattern

> **Dokumentasi sistem registry terpusat untuk indikator Lingkungan & Kebencanaan**

## 🎯 Tujuan

Membuat sistem **single source of truth** untuk konfigurasi indikator lingkungan & kebencanaan agar:
- ✅ **Konsistensi**: Visualisasi sama untuk mode "Semua" dan single indicator
- ✅ **Maintainability**: Satu tempat untuk mengubah konfigurasi
- ✅ **Reusability**: Component yang sama digunakan berulang kali
- ✅ **Scalability**: Mudah menambah indikator baru
- ✅ **Comparison Support**: Mendukung mode perbandingan antar desa

**Note**: Pola ini mirip dengan [Infrastructure Registry](INFRASTRUCTURE_REGISTRY.md) namun disesuaikan untuk data kualitatif lingkungan & kebencanaan.

---

## 📁 File Structure

```
src/config/
├── 📄 environmentIndicatorConfig.js  # Main environment registry
└── 📄 categories.config.js           # Comparison mode configuration

src/components/environment/
└── 📄 EnvironmentIndicatorShell.jsx  # Universal visualization component

src/components/
├── 📄 EnvironmentIndicatorContent.jsx  # Container component
└── 📄 ComparisonView.jsx               # Comparison mode component

src/adapters/
└── 📄 environmentDataAdapter.js        # Data transformation adapter

src/hooks/
└── 📄 useComparisonData.js            # Comparison data hook
```

---

## 💻 Registry Configuration

### Basic Structure
```javascript
export const environmentIndicators = {
  indicator_key: {
    title: 'Display Title',
    valueKey: 'field_name_in_json',      // Field dalam dataset
    categories: ['Category1', 'Category2'], // Expected categories
    chartTypes: ['donut', 'bar', 'stacked'], // Chart types to render
    colors: {                              // Color mapping per category
      'Category1': '#22c55e',
      'Category2': '#f59e0b'
    }
  }
};
```

### Real Example
```javascript
export const environmentIndicators = {
  status_rambu_evakuasi: {
    title: 'Rambu/Papan Informasi Evakuasi Bencana',
    valueKey: 'status_rambu_evakuasi',
    categories: ['Ada', 'Tidak Ada'],
    chartTypes: ['donut', 'bar', 'stacked'],
    colors: {
      'Ada': '#22c55e',
      'Tidak Ada': '#ef4444'
    }
  },
  status_tps: {
    title: 'Tempat Pembuangan Sampah (TPS)',
    valueKey: 'status_tps',
    categories: ['Ada', 'Tidak Ada'],
    chartTypes: ['donut', 'bar', 'stacked'],
    colors: {
      'Ada': '#22c55e',
      'Tidak Ada': '#ef4444'
    }
  }
  // ... 8 more indicators
};
```

---

## 🔄 Data Flow

```
1. User selects indicator OR mode "Semua"
2. Config lookup from environmentIndicatorConfig.js
3. Data adapter transforms raw village data
4. EnvironmentIndicatorShell renders visualizations
5. Charts use config.colors for consistent styling
```

### Flow Diagram
```
👤 User Selection
        ↓
🔍 environmentIndicatorConfig.js
        ↓
📊 environmentDataAdapter.js (transform data)
        ↓
🎨 EnvironmentIndicatorShell.jsx
        ↓
        ├─→ StatCards (3 cards with totals)
        ├─→ DonutChart (distribution)
        ├─→ BarChart (horizontal ranking)
        ├─→ StackedChart (per kecamatan)
        └─→ DetailTable (sortable data table)
```

---

## 🎨 Component Integration

### Container Component
```jsx
// EnvironmentIndicatorContent.jsx
import { environmentIndicators } from '../config/environmentIndicatorConfig';

const EnvironmentIndicatorContent = ({ filters, villageData }) => {
  const selectedIndicator = filters.indicator;
  
  if (selectedIndicator === 'semua') {
    // Show all indicators in accordion
    return <AllIndicatorsView />;
  }
  
  // Single indicator view
  const config = environmentIndicators[selectedIndicator];
  
  return (
    <EnvironmentIndicatorShell
      config={config}
      villageData={villageData}
      filters={filters}
    />
  );
};
```

### Visualization Component
```jsx
// EnvironmentIndicatorShell.jsx
const EnvironmentIndicatorShell = ({ config, villageData, filters }) => {
  // Transform data using adapter
  const processedData = useMemo(() => 
    environmentDataAdapter.processIndicatorData(
      villageData, 
      config.valueKey, 
      config.categories
    ),
    [villageData, config]
  );
  
  return (
    <>
      <StatCards data={processedData} />
      <DonutChart data={processedData} colors={config.colors} />
      <BarChart data={processedData} colors={config.colors} />
      <StackedChart data={processedData} colors={config.colors} />
      <DetailTable data={processedData} sortable />
    </>
  );
};
```

---

## 🏢 Comparison Mode

### Comparison Configuration
```javascript
// categories.config.js
export const COMPARISON_CONFIG = {
  lingkungan: {
    title: "Lingkungan & Kebencanaan",
    indicators: [
      { 
        key: 'status_rambu_evakuasi', 
        label: 'Rambu Evakuasi', 
        accessor: 'status_rambu_evakuasi',
        type: 'qualitative'
      },
      { 
        key: 'status_tps', 
        label: 'TPS', 
        accessor: 'status_tps',
        type: 'qualitative'
      },
      // ... more indicators
    ],
    hasQualitativeData: true,
    comparisonMode: 'table-only'
  }
};
```

### Comparison Component Usage
```jsx
// ComparisonView.jsx
import { COMPARISON_CONFIG } from '../config/categories.config';
import { useComparisonData } from '../hooks/useComparisonData';

const ComparisonView = ({ category }) => {
  const config = COMPARISON_CONFIG[category];
  const { data, loading } = useComparisonData(category, config.indicators);
  
  return (
    <ComparisonTable
      villages={data}
      indicators={config.indicators}
      hasQualitativeData={config.hasQualitativeData}
    />
  );
};
```

---

## 📊 Data Adapter Pattern

### Purpose
Memisahkan logika transformasi data dari komponen visualisasi.

### Example
```javascript
// environmentDataAdapter.js
export const environmentDataAdapter = {
  processIndicatorData(villageData, valueKey, categories) {
    // Group by category
    const grouped = villageData.reduce((acc, village) => {
      const value = village[valueKey];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    
    // Transform to chart format
    return categories.map(cat => ({
      category: cat,
      count: grouped[cat] || 0,
      percentage: ((grouped[cat] || 0) / villageData.length * 100).toFixed(1)
    }));
  },
  
  processStackedData(villageData, valueKey, categories) {
    // Group by kecamatan
    const byKecamatan = {};
    villageData.forEach(village => {
      const kec = village.nama_kecamatan;
      if (!byKecamatan[kec]) byKecamatan[kec] = {};
      const value = village[valueKey];
      byKecamatan[kec][value] = (byKecamatan[kec][value] || 0) + 1;
    });
    
    return byKecamatan;
  }
};
```

---

## 🎨 Color System

### Binary Colors (Ada/Tidak Ada)
```javascript
export const ENVIRONMENT_COLORS = {
  'Ada': '#22c55e',        // Green - positive
  'Tidak Ada': '#ef4444'   // Red - negative
};
```

### Multi-category Colors
```javascript
export const ENVIRONMENT_COLORS_MULTI = {
  'Sangat Baik': '#22c55e',
  'Baik': '#84cc16',
  'Cukup': '#eab308',
  'Kurang': '#f97316',
  'Buruk': '#ef4444'
};
```

### Usage in Config
```javascript
status_rambu_evakuasi: {
  title: 'Rambu Evakuasi',
  valueKey: 'status_rambu_evakuasi',
  categories: ['Ada', 'Tidak Ada'],
  colors: {
    'Ada': ENVIRONMENT_COLORS['Ada'],
    'Tidak Ada': ENVIRONMENT_COLORS['Tidak Ada']
  }
}
```

---

## ✅ Best Practices

### 1. **Consistent Value Keys**
```javascript
// ✅ Good: Match exact field names from JSON
valueKey: 'status_rambu_evakuasi'

// ❌ Bad: Different from actual data
valueKey: 'rambu_evakuasi'
```

### 2. **Complete Category Mapping**
```javascript
// ✅ Good: All possible categories defined
categories: ['Ada', 'Tidak Ada']

// ❌ Bad: Missing categories
categories: ['Ada'] // What about 'Tidak Ada'?
```

### 3. **Color Consistency**
```javascript
// ✅ Good: Use predefined color constants
colors: {
  'Ada': ENVIRONMENT_COLORS['Ada']
}

// ❌ Bad: Hard-coded colors
colors: {
  'Ada': '#22c55e'  // Hard to maintain
}
```

### 4. **Data Validation**
```javascript
// Always validate data exists
const processedData = useMemo(() => {
  if (!villageData || !config) return [];
  return environmentDataAdapter.processIndicatorData(
    villageData, 
    config.valueKey, 
    config.categories
  );
}, [villageData, config]);
```

---

## 🚀 Adding New Indicators

### Step 1: Add to Registry
```javascript
// environmentIndicatorConfig.js
export const environmentIndicators = {
  // existing indicators...
  
  new_indicator: {
    title: 'New Environment Indicator',
    valueKey: 'field_in_json',
    categories: ['Category1', 'Category2'],
    chartTypes: ['donut', 'bar', 'stacked'],
    colors: {
      'Category1': '#22c55e',
      'Category2': '#ef4444'
    }
  }
};
```

### Step 2: Add to Comparison Config (if needed)
```javascript
// categories.config.js
export const COMPARISON_CONFIG = {
  lingkungan: {
    indicators: [
      // existing indicators...
      { 
        key: 'new_indicator', 
        label: 'New Indicator', 
        accessor: 'field_in_json',
        type: 'qualitative'
      }
    ]
  }
};
```

### Step 3: Test
- [ ] Check mode "Semua" shows new indicator
- [ ] Check single indicator selection works
- [ ] Verify all 3 chart types render
- [ ] Test comparison mode if enabled
- [ ] Verify table sorting works
- [ ] Check responsive behavior

---

## 🔧 Advanced Features

### Table Sorting
```jsx
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

const handleSort = (key) => {
  setSortConfig({
    key,
    direction: sortConfig.key === key && sortConfig.direction === 'asc' 
      ? 'desc' 
      : 'asc'
  });
};

const sortedRows = useMemo(() => {
  if (!sortConfig.key) return rows;
  
  return [...rows].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}, [rows, sortConfig]);
```

### Performance Optimization
```jsx
// Memoize expensive calculations
const chartData = useMemo(() => 
  environmentDataAdapter.processIndicatorData(villageData, config.valueKey, config.categories),
  [villageData, config]
);

// Memoize sorted data
const sortedData = useMemo(() => 
  sortData(chartData, sortConfig),
  [chartData, sortConfig]
);

// Use React.memo for child components
const MemoizedChart = React.memo(DonutChart);
```

---

## 🐛 Troubleshooting

### Issue: Charts not showing
```javascript
// Check 1: Is indicator in registry?
console.log(environmentIndicators[indicatorKey]); // should not be undefined

// Check 2: Does valueKey match JSON field?
console.log(villageData[0][config.valueKey]); // should have data

// Check 3: Are categories correct?
console.log(new Set(villageData.map(v => v[config.valueKey])));
// Should match config.categories
```

### Issue: Colors not working
```javascript
// Check: Are all categories in color mapping?
config.categories.forEach(cat => {
  console.log(cat, config.colors[cat]); // should return color for each
});
```

### Issue: Comparison mode not showing
```javascript
// Check 1: Is comparison config defined?
console.log(COMPARISON_CONFIG['lingkungan']); // should exist

// Check 2: Are indicators accessible?
console.log(villageData[0][indicator.accessor]); // should have data

// Check 3: Is hasQualitativeData true?
console.log(COMPARISON_CONFIG['lingkungan'].hasQualitativeData); // should be true
```

---

## 🧪 Testing Checklist

### Registry Tests
- [ ] All 10 indicators defined in environmentIndicatorConfig.js
- [ ] All valueKeys match actual JSON fields
- [ ] All categories match actual data values
- [ ] All colors are defined and distinct

### Visualization Tests
- [ ] StatCards show correct totals
- [ ] Donut chart displays all categories
- [ ] Bar chart shows ranking correctly
- [ ] Stacked chart groups by kecamatan
- [ ] Detail table displays all data

### Comparison Tests
- [ ] Comparison mode button visible
- [ ] Comparison table shows 5 villages
- [ ] All 10 indicators display correctly
- [ ] Data is accurate and up-to-date

### Performance Tests
- [ ] Charts render smoothly
- [ ] No lag when switching indicators
- [ ] Table sorting is instant
- [ ] Accordion animations are smooth (60 FPS)
- [ ] No memory leaks on repeated interactions

---

## 📚 Related Documentation

- **[Infrastructure Registry](INFRASTRUCTURE_REGISTRY.md)** - Similar pattern for Infrastructure category
- **[Architecture Guide](ARCHITECTURE.md)** - Overall application architecture
- **[Component Library](../client/src/components/README.md)** - Reusable components
- **[Analysis Guide](../client/src/analysis/COMPONENT_GUIDE.md)** - Analysis module

---

**💡 Pro Tips**

1. **Start with Data**: Always check actual JSON fields before adding to registry
2. **Color Accessibility**: Use distinct colors for better readability
3. **Performance First**: Always memoize expensive calculations
4. **Test Thoroughly**: Test all chart types and comparison mode
5. **Document Changes**: Update this doc when adding new indicators

---

**Last Updated**: October 2025  
**Maintainer**: Development Team

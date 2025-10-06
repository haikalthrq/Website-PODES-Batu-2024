# 🏛️ Application Architecture

> **Panduan arsitektur aplikasi Dashboard PODES untuk programmer junior**

## 🎯 Overview

Dashboard PODES menggunakan **component-based architecture** dengan pola **unidirectional data flow** dan **separation of concerns**.

## 🧩 Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 PRESENTATION LAYER                    │
├─────────────────────────────────────────────────────────────┤
│  Pages/           │  Components/      │  Analysis/          │
│  - AnalysisPage   │  - Charts         │  - Indicators       │
│  - HomePage       │  - UI Elements    │  - Sections         │
├─────────────────────────────────────────────────────────────┤
│                     🔧 BUSINESS LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Config/          │  Utils/           │  Services/          │
│  - Registries     │  - Transformers   │  - API Calls        │
│  - Categories     │  - Formatters     │  - Data Processing  │
├─────────────────────────────────────────────────────────────┤
│                      📊 DATA LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Backend API      │  JSON Data        │  State Management   │
│  - Express.js     │  - PODES 2024     │  - React State      │
│  - REST Endpoints │  - 24 Villages    │  - Local Storage    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Folder Structure Explained

### 🎨 `/src/components/`
**Reusable UI components**

```
components/
├── 📁 charts/              # Chart components (ApexCharts wrappers)
│   ├── DonutWithLegend.tsx
│   ├── BarGroupedStacked.tsx
│   └── ChartCard.jsx
├── 📁 common/              # Shared UI elements
│   ├── EmptyState.jsx
│   ├── LoadingSpinner.jsx
│   └── StatCard.jsx
├── 📁 theme/               # Styling & colors
│   ├── chartColors.ts
│   └── palette.js
└── 📄 InfrastructureIndicatorContent.jsx  # Domain-specific containers
```

### 🔧 `/src/config/`
**Configuration & registries**

```
config/
├── 📁 infra/               # Infrastructure-specific config
│   └── indicatorRegistry.js
├── 📁 selectors/           # Data selection logic
│   └── getIndicatorsForCategory.js
└── 📄 categories.config.js  # Category definitions
```

### 📊 `/src/analysis/`
**Analysis & visualization logic**

```
analysis/
├── 📁 sections/            # Analysis section components
│   └── SummaryAccordionSection.jsx
├── 📁 universal/           # Universal analysis components
│   └── UniversalIndicatorPanel.jsx
└── 📄 IndicatorsSummary.jsx
```

### 🛠️ `/src/utils/`
**Helper functions & utilities**

```
utils/
├── 📁 infra/               # Infrastructure-specific utilities
│   └── distribution.ts
└── 📄 formatters.js        # Data formatting helpers
```

## 🔄 Data Flow Patterns

### 1. **API → State → UI Flow**
```
📡 API Call → 🔄 Service Layer → 📊 Component State → 🎨 UI Render
```

```javascript
// Example: Fetching village data
const [data, setData] = useState([]);

useEffect(() => {
  podesService.getAllVillages()  // 📡 API call
    .then(response => {          // 🔄 Service processing
      setData(response.data);    // 📊 State update
    });                          // 🎨 UI re-renders automatically
}, []);
```

### 2. **Registry Pattern Flow**
```
👤 User Selection → 🔍 Registry Lookup → ⚙️ Config → 📊 Component → 🎨 Visualization
```

```javascript
// Example: Infrastructure indicator flow
const selectedIndicator = 'penerangan_jalan_utama';
const config = getIndicatorConfig(selectedIndicator);  // Registry lookup
// Config contains: dataKey, categories, charts, colors, etc.
```

### 3. **Filter Flow**
```
🎛️ Filter Change → 📊 Data Filter → 🔄 Memo Update → 🎨 Charts Re-render
```

```javascript
// Example: Filtering by kecamatan
const filteredData = useMemo(() => {
  return villageData.filter(village => 
    !filters.kecamatan || village.nama_kecamatan === filters.kecamatan
  );
}, [villageData, filters.kecamatan]);
```

## 🎭 Component Patterns

### 1. **Container vs Presentation Pattern**

**Container Components** (Smart components)
- Handle state management
- Fetch data from APIs
- Contain business logic
- Pass props to presentation components

```javascript
// Example: InfrastructureIndicatorContent.jsx
const InfrastructureIndicatorContent = ({ filters, villageData }) => {
  const config = getIndicatorConfig(filters.indicator);  // Business logic
  const processedData = processData(villageData, config); // Data processing
  
  return (
    <EnhancedInfrastructureIndicators        // Pass to presentation
      config={config}
      data={processedData}
    />
  );
};
```

**Presentation Components** (Dumb components)
- Only receive props
- Focus on UI rendering
- No side effects or API calls
- Highly reusable

```javascript
// Example: DonutWithLegend.tsx
const DonutWithLegend = ({ title, data, height }) => {
  return (
    <Card>
      <CardHeader title={title} />
      <ApexChart data={data} height={height} />
    </Card>
  );
};
```

### 2. **Custom Hooks Pattern**

Encapsulate stateful logic for reuse across components:

```javascript
// Example: useFilters hook
const useFilters = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);
  
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
  };
  
  return { filters, updateFilter, resetFilters };
};
```

### 3. **Registry Pattern**

Centralized configuration for scalability:

```javascript
// Problem: Hard-coded configurations scattered everywhere
// Solution: Single source of truth registry

export const INFRA_INDICATORS = {
  indicator_key: {
    // All configuration in one place
    title, dataKey, categories, charts, colors
  }
};

// Usage: Consistent access pattern
const config = getIndicatorConfig(key);
```

## ⚡ Performance Optimizations

### 1. **Memoization**
```javascript
// Expensive calculations cached until dependencies change
const expensiveCalculation = useMemo(() => {
  return processLargeDataset(data);
}, [data]);

// Component re-renders prevented
const MemoizedChart = React.memo(ChartComponent);
```

### 2. **Lazy Loading**
```javascript
// Components loaded only when needed
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));

// Usage with suspense
<Suspense fallback={<LoadingSpinner />}>
  <AnalysisPage />
</Suspense>
```

### 3. **Conditional Rendering**
```javascript
// Charts render only when accordion is open
{shouldRenderCharts && (
  <ExpensiveChartComponent data={data} />
)}
```

## 🚀 State Management Strategy

### 1. **Local State** (useState)
- Component-specific data
- UI state (loading, errors)
- Form inputs

### 2. **Computed State** (useMemo)
- Derived data
- Filtered/processed datasets
- Expensive calculations

### 3. **URL State** (React Router)
- Current page
- Filter selections
- Shareable state

## 🔧 Development Workflow

### 1. **Adding New Features**
```
1. Define requirements
2. Update registry/config (if needed)
3. Create/update components
4. Add to parent container
5. Test integration
6. Update documentation
```

### 2. **Debugging Strategy**
```
1. Check browser console for errors
2. Use React DevTools for state inspection
3. Add console.logs for data flow tracing
4. Verify API responses in Network tab
5. Check component props/state
```

## 📚 Learning Resources

### React Fundamentals
- [React Docs](https://react.dev/) - Official documentation
- [useState Hook](https://react.dev/reference/react/useState)
- [useEffect Hook](https://react.dev/reference/react/useEffect)

### Advanced Patterns
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Component Composition](https://react.dev/learn/passing-props-to-a-component)
- [Performance Optimization](https://react.dev/reference/react/memo)

### Tools & Libraries
- [Material-UI](https://mui.com/) - Component library
- [ApexCharts](https://apexcharts.com/docs/react-charts/) - Chart library
- [React Router](https://reactrouter.com/) - Routing

---

**💡 Pro Tips for Junior Developers**

1. **Start Small**: Understand one component before moving to complex features
2. **Read the Code**: Follow data flow from API to UI
3. **Use DevTools**: React DevTools are your best friend
4. **Console Everything**: When debugging, log props and state
5. **Break Things**: Don't be afraid to experiment in development
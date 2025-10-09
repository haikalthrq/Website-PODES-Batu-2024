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
├── 📁 environment/         # Environment category components
│   └── EnvironmentIndicatorShell.jsx
├── 📁 unified/             # Universal reusable components
│   └── UniversalIndicatorPanel.jsx
├── 📁 theme/               # Styling & colors
│   ├── chartColors.ts
│   └── palette.js
├── 📄 InfrastructureIndicatorContent.jsx    # Infrastructure container
├── 📄 EnvironmentIndicatorContent.jsx       # Environment container
└── 📄 ComparisonView.jsx                    # Comparison mode component
```

### 🔧 `/src/config/`
**Configuration & registries (single source of truth)**

```
config/
├── 📁 infra/               # Infrastructure-specific config
│   └── indicatorRegistry.js
├── 📁 indicators/          # Indicator configurations
│   └── [various indicator configs]
├── 📁 table/               # Table configurations
│   └── tableConfig.js
├── 📁 selectors/           # Data selection logic
│   └── getIndicatorsForCategory.js
├── 📄 categories.config.js           # Category & comparison definitions
└── 📄 environmentIndicatorConfig.js  # Environment indicator registry
```

**Note**: Previously had redundant `configs/` folder - now consolidated into single `config/` folder.

### 📊 `/src/analysis/`
**Analysis & visualization logic**

```
analysis/
├── 📁 sections/            # Analysis section components
│   └── SummaryAccordionSection.jsx
├── 📁 universal/           # Universal analysis components
│   └── UniversalIndicatorPanel.jsx
├── 📁 charts/              # Chart-specific components
├── 📁 tables/              # Table components with sorting
├── 📁 hooks/               # Custom hooks (useComparisonData, etc.)
└── 📄 IndicatorsSummary.jsx
```

### 🛠️ `/src/utils/`
**Helper functions & utilities**

```
utils/
├── 📁 infra/               # Infrastructure-specific utilities
│   └── distribution.ts
├── 📄 formatters.js        # Data formatting helpers
└── 📄 dataProcessing.js    # Generic data processing utilities
```

### 🔌 `/src/adapters/`
**Data transformation adapters**

```
adapters/
└── 📄 environmentDataAdapter.js  # Environment data transformation
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
// Example 1: Infrastructure indicator flow
const selectedIndicator = 'penerangan_jalan_utama';
const config = getIndicatorConfig(selectedIndicator);  // Registry lookup
// Config contains: dataKey, categories, charts, colors, etc.

// Example 2: Environment indicator flow
import { environmentIndicators } from '../config/environmentIndicatorConfig';
const config = environmentIndicators[selectedIndicator];
// Config contains: title, valueKey, categories, chartTypes, etc.
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

### 4. **GPU-Accelerated Animations**
```css
/* Optimized accordion animations */
.accordion-content {
  will-change: transform;
  transform: translateZ(0);
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 📊 Comparison Mode Architecture

### Comparison Flow
```
👤 User clicks "Perbandingan Antar Desa"
        ↓
🔍 categories.config.js COMPARISON_CONFIG lookup
        ↓
🎯 ComparisonView component renders
        ↓
🔄 useComparisonData hook fetches data
        ↓
📋 Comparison table with 5 villages × N indicators
```

### Comparison Configuration
```javascript
// categories.config.js
export const COMPARISON_CONFIG = {
  lingkungan: {
    title: "Lingkungan & Kebencanaan",
    indicators: [
      { key: 'status_rambu_evakuasi', label: 'Rambu Evakuasi', accessor: 'status_rambu_evakuasi' },
      { key: 'status_tps', label: 'TPS', accessor: 'status_tps' },
      // ... more indicators
    ],
    hasQualitativeData: true,
    comparisonMode: 'table-only'
  }
};
```

### Universal Component Pattern
```javascript
// UniversalIndicatorPanel.jsx - Works for all categories
const UniversalIndicatorPanel = ({ category, indicator, config }) => {
  // Adapts to Infrastructure or Environment
  if (category === 'infrastruktur') {
    return <InfrastructureIndicatorContent {...props} />;
  } else if (category === 'lingkungan') {
    return <EnvironmentIndicatorContent {...props} />;
  }
};
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

## �️ Geospatial Mapping Architecture

### Overview
Interactive map visualization menggunakan **React Leaflet** dengan **GeoJSON** untuk spatial data.

```
┌────────────────────────────────────────────────────────┐
│              GeospatialMap Component                   │
├────────────────────────────────────────────────────────┤
│  🗺️ MapContainer (React Leaflet)                       │
│    ├─ TileLayer (OpenStreetMap)                       │
│    ├─ GeoJSON Layer (Village boundaries)             │
│    └─ FitBounds (Auto-zoom to data)                  │
├────────────────────────────────────────────────────────┤
│  📊 Data Integration                                   │
│    ├─ GeoJSON: /public/kelurahan.geojson             │
│    ├─ PODES Data: API /api/villages                  │
│    └─ Name Matching: normalizeDesaName()             │
├────────────────────────────────────────────────────────┤
│  🎨 Visualization Features                             │
│    ├─ Dynamic coloring based on indicator values     │
│    ├─ Hover tooltips with village info               │
│    ├─ Indicator selector (30+ options)               │
│    └─ Category-grouped dropdown                      │
└────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. **GeospatialMap.jsx**
Main component handling map visualization:

```javascript
const GeospatialMap = () => {
  // State management
  const [geoData, setGeoData] = useState(null);        // GeoJSON boundaries
  const [podesData, setPodesData] = useState([]);      // PODES statistics
  const [selectedIndicator, setSelectedIndicator] = useState('jumlah_sd');
  
  // Load both data sources
  useEffect(() => {
    Promise.all([
      fetch('/kelurahan.geojson'),                     // Village boundaries
      fetch('http://localhost:5001/api/villages')      // PODES data
    ]).then(/* merge data */);
  }, []);
  
  return (
    <MapContainer 
      center={[-7.8671, 112.5239]}                     // Kota Batu center
      zoom={12}
      maxBounds={[[-8.5, 111.5], [-7.2, 113.5]]}      // East Java bounds
      minZoom={10}
      maxZoom={18}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={geoData} style={getFeatureStyle} onEachFeature={onEachFeature} />
      <FitBounds geojson={geoData} />
    </MapContainer>
  );
};
```

#### 2. **Smart Name Matching**
Handles village name variations (e.g., "Sumberbrantas" vs "SUMBER BRANTAS"):

```javascript
// Normalize function removes spaces and standardizes case
const normalizeDesaName = (name) => {
  return name?.toUpperCase().trim().replace(/\s+/g, '');
};

const findDesaData = (desaNameFromGeo) => {
  const normalized = normalizeDesaName(desaNameFromGeo);
  return podesData.find(d => normalizeDesaName(d.nama_desa) === normalized);
};
```

**Why this matters**: 
- GeoJSON: `"Sumberbrantas"` (no space)
- PODES data: `"SUMBER BRANTAS"` (with space)
- Normalization: Both become `"SUMBERBRANTAS"` ✅

#### 3. **Dynamic Styling**
Color coding based on indicator values:

```javascript
const getColor = (value, indicator) => {
  // Quantitative indicators (numeric values)
  if (quantitativeIndicators.includes(indicator)) {
    // Gradient: white → red for increasing values
    const ranges = { jumlah_sd: [0, 2, 4, 6], ... };
    const colors = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26'];
    // Return color based on value range
  }
  
  // Qualitative indicators (categories)
  const colorMap = {
    'Ada': '#10b981',                // Green for good
    'Tidak Ada': '#f87171',          // Red for bad
    'Sangat Kuat': '#10b981',        // Signal strength
    'Lemah': '#fbbf24',              // Yellow for moderate
  };
  return colorMap[value] || '#94a3b8';
};
```

#### 4. **Interactive Features**
Hover effects and tooltips:

```javascript
const onEachFeature = (feature, layer) => {
  layer.on('mouseover', (e) => {
    const desaData = findDesaData(feature.properties.nm_kelurahan);
    const value = desaData[selectedIndicator];
    
    // Show tooltip with village name and indicator value
    layer.bindTooltip(`
      <strong>${feature.properties.nm_kelurahan}</strong><br/>
      ${indicatorLabel}: <strong>${value}</strong>
    `).openTooltip();
    
    // Highlight on hover
    layer.setStyle({ weight: 3, fillOpacity: 0.9 });
  });
  
  layer.on('mouseout', () => {
    layer.closeTooltip();
    layer.setStyle(getFeatureStyle(feature));  // Reset style
  });
};
```

### Map Configuration

#### Bounds & Zoom
```javascript
{
  center: [-7.8671, 112.5239],                    // Kota Batu coordinates
  zoom: 12,                                       // Initial zoom level
  maxBounds: [[-8.5, 111.5], [-7.2, 113.5]],     // East Java region
  minZoom: 10,                                    // Prevent zooming out too far
  maxZoom: 18,                                    // Allow detailed village view
  maxBoundsViscosity: 1.0                         // Hard boundary (can't drag outside)
}
```

**Rationale**:
- Focus on Kota Batu while showing context (Jawa Timur)
- Prevent users from scrolling to irrelevant regions
- Balance between overview and detail

### Indicator Categories
30+ indicators grouped by category:
- 📚 **Pendidikan**: TK, SD, SMP, SMA (4 indicators)
- 🏥 **Kesehatan**: RS, Puskesmas, Rawat Inap (3 indicators)
- 🌐 **Infrastruktur**: BTS, Sinyal, Internet, Penerangan (5 indicators)
- ⚠️ **Kebencanaan**: Peringatan Dini, Alat Keselamatan, Rambu, Simulasi (4 indicators)
- ♻️ **Sampah**: TPS, TPS3R, Pemilahan, Partisipasi (6 indicators)
- 🌳 **Lingkungan**: Komunitas, Bakar Lahan, Pencemaran, Kayu Bakar (5 indicators)

### Data Sources
1. **GeoJSON**: `/client/public/kelurahan.geojson` (66,171 lines)
   - Village boundaries (polygons)
   - 24 desa/kelurahan in Kota Batu
   - Properties: `nm_kelurahan`, `kd_propinsi`, `kd_kecamatan`

2. **PODES API**: `http://localhost:5001/api/villages`
   - Statistical data per village
   - 40+ indicators per village
   - Updated from Survey PODES 2024

## �🔧 Development Workflow

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
6. For maps: Verify GeoJSON structure & name matching
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
- [React Leaflet](https://react-leaflet.js.org/) - Map components
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [React Router](https://reactrouter.com/) - Routing

---

**💡 Pro Tips for Junior Developers**

1. **Start Small**: Understand one component before moving to complex features
2. **Read the Code**: Follow data flow from API to UI
3. **Use DevTools**: React DevTools are your best friend
4. **Console Everything**: When debugging, log props and state
5. **Break Things**: Don't be afraid to experiment in development
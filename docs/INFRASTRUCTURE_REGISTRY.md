# 🏗️ Infrastructure Registry Pattern

> **Dokumentasi sistem registry terpusat untuk indikator Infrastruktur & Konektivitas**

## 🎯 Tujuan

Membuat sistem **single source of truth** untuk konfigurasi indikator infrastruktur agar:
- ✅ **Konsistensi**: Visualisasi sama untuk mode "Semua" dan single indicator
- ✅ **Maintainability**: Satu tempat untuk mengubah konfigurasi
- ✅ **Reusability**: Component yang sama digunakan berulang kali
- ✅ **Scalability**: Mudah menambah indikator baru

**Note**: Pola serupa juga diterapkan untuk kategori Lingkungan & Kebencanaan. Lihat [Environment Registry](ENVIRONMENT_REGISTRY.md) untuk dokumentasi lengkap.

## 📁 File Structure

```
src/config/infra/
├── 📄 indicatorRegistry.js     # Main registry configuration
└── 📄 README.md               # Documentation

src/config/
└── 📄 categories.config.js     # Comparison mode configuration

src/components/
├── 📄 InfrastructureIndicatorContent.jsx    # Container component
├── 📄 EnhancedInfrastructureIndicators.jsx  # Chart rendering component
└── 📄 ComparisonView.jsx                    # Comparison mode component
```

**Related Files for Environment Category**:
```
src/config/
└── 📄 environmentIndicatorConfig.js  # Environment registry

src/components/environment/
└── 📄 EnvironmentIndicatorShell.jsx  # Environment visualization

src/adapters/
└── 📄 environmentDataAdapter.js      # Data transformation
```

## 💻 Registry Configuration

### Basic Structure
```javascript
export const INFRA_INDICATORS = {
  indicator_key: {
    id: 'indicator_key',
    title: 'Display Title',
    dataKey: 'field_name_in_json',        // Field dalam dataset
    type: 'qualitative',                  // qualitative | numeric
    categories: ['Category1', 'Category2'], // Expected categories
    displayLabels: {                      // Optional: shorter labels for charts
      'Long Category Name': 'Short Name'
    },
    charts: [                             // Chart types to render
      { type: 'donut', title: 'Distribution Chart' },
      { type: 'stacked', title: 'Per Kecamatan' }
    ],
    icon: '📶',                          // Display icon
    legend: true
  }
};
```

### Real Example
```javascript
penerangan_jalan_utama: {
  id: 'penerangan_jalan_utama',
  title: 'Penerangan Jalan Utama',
  dataKey: 'status_penerangan_jalan_utama',
  type: 'qualitative',
  categories: ['Ada, sebagian besar', 'Ada, sebagian kecil'],
  displayLabels: {
    'Ada, sebagian besar': 'Sebagian Besar',
    'Ada, sebagian kecil': 'Sebagian Kecil'
  },
  charts: [
    { type: 'donut', title: 'Distribusi Penerangan Jalan Utama' },
    { type: 'stacked', title: 'Distribusi per Kecamatan' }
  ],
  icon: '💡',
  legend: true
}
```

## 🔄 Data Flow

```
1. User selects indicator
2. getIndicatorConfig(key) → Registry
3. InfrastructureIndicatorContent receives config
4. EnhancedInfrastructureIndicators renders charts
5. Charts use config.displayLabels for short text
```

## 🎨 Component Integration

### Container Component
```jsx
// InfrastructureIndicatorContent.jsx
const config = getIndicatorConfig(selectedIndicator);
return (
  <EnhancedInfrastructureIndicators
    indicatorKey={config.id}
    config={config}
    villageData={villageData}
  />
);
```

### Chart Component
```jsx
// EnhancedInfrastructureIndicators.jsx
const getDisplayLabel = (originalLabel) => {
  return config?.displayLabels?.[originalLabel] || originalLabel;
};

// Usage in charts
data.map(item => ({
  label: getDisplayLabel(item.category),
  value: item.count,
  color: getCategoryColor(item.category) // Use original for color consistency
}))
```

## 🎨 Color System

Colors are defined in `src/components/theme/chartColors.ts`:

```typescript
export const BINARY_COLORS = {
  "Ada, sebagian besar": "#15803d",    // Dark green
  "Ada, sebagian kecil": "#fbbf24",    // Amber/yellow
  "Tidak Ada": "#94a3b8"              // Gray
};
```

## ✅ Best Practices

### 1. **Consistent Data Keys**
```javascript
// ✅ Good: Match exact field names from JSON
dataKey: 'status_penerangan_jalan_utama'

// ❌ Bad: Different from actual data
dataKey: 'penerangan_utama'
```

### 2. **Short Display Labels**
```javascript
// ✅ Good: Short labels prevent truncation
displayLabels: {
  'Ada, sebagian besar': 'Sebagian Besar'
}

// ❌ Bad: Long labels get cut off in charts
// No displayLabels mapping
```

### 3. **Color Consistency**
```javascript
// ✅ Good: Use original category for color mapping
color: getCategoryColor(item.category)

// ❌ Bad: Use display label for color
color: getCategoryColor(getDisplayLabel(item.category))
```

## 🚀 Adding New Indicators

### Step 1: Add to Registry
```javascript
export const INFRA_INDICATORS = {
  // existing indicators...
  
  new_indicator: {
    id: 'new_indicator',
    title: 'New Indicator Title',
    dataKey: 'field_in_json',
    type: 'qualitative',
    categories: ['Cat1', 'Cat2'],
    charts: [
      { type: 'donut', title: 'Distribution' },
      { type: 'stacked', title: 'Per Kecamatan' }
    ],
    icon: '🆕',
    legend: true
  }
};
```

### Step 2: Update Colors (if needed)
```typescript
// In chartColors.ts
export const BINARY_COLORS = {
  // existing colors...
  "New Category": "#color-hex"
};
```

### Step 3: Test
- Check mode "Semua" shows new indicator
- Check single indicator selection works
- Verify colors and labels display correctly

## 🐛 Troubleshooting

### Issue: Charts not showing
```javascript
// Check: Is indicatorKey in registry?
console.log(INFRA_INDICATORS[indicatorKey]); // should not be undefined

// Check: Does dataKey match JSON field?
console.log(villageData[0][config.dataKey]); // should have data
```

### Issue: Colors not working
```javascript
// Check: Are categories in color mapping?
console.log(BINARY_COLORS[categoryName]); // should return color

// Check: Using original category, not display label
color: getCategoryColor(item.category) // ✅
color: getCategoryColor(getDisplayLabel(item.category)) // ❌
```

### Issue: Labels truncated
```javascript
// Solution: Add displayLabels mapping
displayLabels: {
  'Very Long Category Name That Gets Cut Off': 'Short Name'
}
```

## 🧪 Testing Checklist

- [ ] Registry exports all expected indicators
- [ ] Data keys match actual JSON fields  
- [ ] Categories match actual data values
- [ ] Display labels are shorter and readable
- [ ] Colors are distinct and accessible
- [ ] Both "Semua" and single modes work
- [ ] Charts render without errors
- [ ] Console has no warnings/errors

---

**💡 Tip**: When adding new indicators, always check the actual data first with:
```javascript
console.log('Available categories:', 
  new Set(villageData.map(v => v[fieldName]))
);
```
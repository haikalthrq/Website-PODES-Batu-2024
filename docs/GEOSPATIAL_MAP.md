# 🗺️ Geospatial Map Documentation

> **Panduan lengkap untuk fitur peta interaktif Dashboard PODES Kota Batu**

## 📋 Overview

Peta geospasial adalah fitur visualisasi interaktif yang menampilkan data PODES 2024 dalam bentuk **choropleth map** (peta dengan pewarnaan berdasarkan data statistik). Setiap desa/kelurahan di Kota Batu ditampilkan dengan warna berbeda sesuai nilai indikator yang dipilih.

## 🎯 Fitur Utama

### ✨ Visualisasi Data
- **30+ Indikator**: Pilih dari berbagai kategori (Pendidikan, Kesehatan, Infrastruktur, Lingkungan)
- **Dynamic Coloring**: Warna otomatis menyesuaikan berdasarkan nilai indikator
- **Interactive Tooltips**: Hover pada desa untuk melihat detail data
- **Responsive Design**: Bekerja optimal di desktop dan mobile

### 🎨 Kategori Indikator

#### 📚 Pendidikan (4 indikator)
- Jumlah TK
- Jumlah SD
- Jumlah SMP
- Jumlah SMA

#### 🏥 Kesehatan (3 indikators)
- Jumlah Rumah Sakit
- Jumlah Puskesmas
- Jumlah Puskesmas Rawat Inap

#### 🌐 Infrastruktur & Konektivitas (5 indikator)
- Jumlah BTS
- Kekuatan Sinyal (Sangat Kuat, Kuat, Lemah, Sangat Lemah)
- Jenis Sinyal Internet (5G/4G/LTE, 3G, 2G)
- Status Penerangan Jalan Tenaga Surya
- Status Penerangan Jalan Utama

#### ⚠️ Kebencanaan (8 indikator)
- Sistem Peringatan Dini
- Alat Keselamatan
- Rambu Evakuasi
- Partisipasi Simulasi Bencana
- Partisipasi Gladi Siaga Bencana
- Kejadian Tanah Longsor
- Kejadian Banjir
- Kejadian Gempa

#### ♻️ Pengelolaan Sampah (6 indikator)
- Status TPS (Tempat Penampungan Sampah)
- Status TPS3R (Reduce, Reuse, Recycle)
- Status Pemilahan Sampah
- Kebiasaan Pemilahan Sampah
- Partisipasi Warga Pengolahan Sampah
- Status Sampah Dibakar

#### 🌳 Lingkungan Lainnya (5 indikator)
- Komunitas Lingkungan
- Kebiasaan Bakar Lahan
- Permukiman Bantaran Sungai
- Pencemaran Air dari Pabrik
- Jumlah Keluarga Pengguna Kayu Bakar

## 🏗️ Arsitektur Teknis

### Data Flow

```
┌─────────────────┐
│  User Opens Map │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Load 2 Data Sources Simultaneously │
├─────────────────────────────────────┤
│  1. GeoJSON (kelurahan.geojson)    │  ← Village boundaries
│  2. PODES API (/api/villages)      │  ← Statistical data
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Smart Name Matching        │  ← normalizeDesaName()
│  "Sumberbrantas" = "SUMBER BRANTAS"
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Merge Data by Village Name │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  User Selects Indicator     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Calculate Colors           │  ← getColor()
│  - Quantitative: gradient   │
│  - Qualitative: category    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Render Map with Colors     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  User Hovers on Village     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Show Tooltip with Data     │
└─────────────────────────────┘
```

### Komponen Utama

#### 1. GeospatialMap.jsx
```javascript
// Location: client/src/components/GeospatialMap.jsx

const GeospatialMap = () => {
  // States
  const [geoData, setGeoData] = useState(null);              // GeoJSON boundaries
  const [podesData, setPodesData] = useState([]);            // PODES statistics
  const [selectedIndicator, setSelectedIndicator] = useState('jumlah_sd');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ... component logic
}
```

**Responsibilities:**
- Load dan merge data dari 2 sumber
- Manage state untuk indikator yang dipilih
- Handle loading dan error states
- Render MapContainer dengan konfigurasi

#### 2. FitBounds Component
```javascript
function FitBounds({ geojson }) {
  const map = useMap();
  
  useEffect(() => {
    if (geojson && geojson.features.length > 0) {
      const geoJsonLayer = L.geoJSON(geojson);
      const bounds = geoJsonLayer.getBounds();
      map.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 13
      });
    }
  }, [geojson, map]);
  
  return null;
}
```

**Responsibilities:**
- Auto-zoom map to show all villages
- Add padding for better visual
- Limit zoom level (maxZoom: 13)

## 🎨 Color Schemes

### Quantitative Indicators (Numeric Values)
Menggunakan gradient warna dari **putih → merah**:

```javascript
const colors = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'];
//              lightest    light      medium     dark       darkest

// Example untuk jumlah SD:
// 0 SD        → #fee5d9 (sangat terang)
// 1-2 SD      → #fcae91 (terang)
// 3-4 SD      → #fb6a4a (medium)
// 5-6 SD      → #de2d26 (gelap)
// 7+ SD       → #a50f15 (sangat gelap)
```

### Qualitative Indicators (Categorical Values)
Menggunakan color mapping berdasarkan kondisi:

```javascript
const colorMap = {
  // 🟢 Hijau = Kondisi Baik
  'Ada': '#10b981',
  'Sangat Kuat': '#10b981',
  '5G/4G/LTE': '#10b981',
  'Semua Keluarga': '#10b981',
  
  // 🟡 Kuning = Kondisi Sedang
  'Ada, sebagian': '#fbbf24',
  'Lemah': '#fbbf24',
  '3G': '#fbbf24',
  
  // 🔴 Merah = Kondisi Buruk
  'Tidak Ada': '#f87171',
  'Sangat Lemah': '#f87171',
  '2G': '#f87171',
  'Ya': '#f87171',  // Untuk indikator negatif (bencana, pencemaran)
  
  // ⚫ Abu-abu = Default/Tidak Terdefinisi
  'default': '#94a3b8'
};
```

## 🔧 Konfigurasi Peta

### Map Bounds
```javascript
{
  center: [-7.8671, 112.5239],                    // Koordinat Kota Batu
  zoom: 12,                                       // Zoom level awal
  maxBounds: [[-8.5, 111.5], [-7.2, 113.5]],     // Batasan wilayah Jawa Timur
  minZoom: 10,                                    // Zoom minimal
  maxZoom: 18,                                    // Zoom maksimal
  maxBoundsViscosity: 1.0                         // Hard boundary (tidak bisa drag keluar)
}
```

**Koordinat Penting:**
- **Kota Batu**: -7.8671°S, 112.5239°E
- **NW Corner**: -7.2°S, 111.5°E
- **SE Corner**: -8.5°S, 113.5°E

**Rasionale:**
- Focus pada Kota Batu sambil menampilkan konteks Jawa Timur
- Mencegah user scroll ke wilayah yang tidak relevan
- Balance antara overview dan detail

### Tile Layer
```javascript
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
/>
```

Menggunakan **OpenStreetMap** karena:
- ✅ Free dan open source
- ✅ Tidak perlu API key
- ✅ Update berkala
- ✅ Support zoom hingga level 18

## 🔍 Smart Name Matching

### Problem
Data dari 2 sumber berbeda memiliki format nama yang berbeda:

| Source | Example |
|--------|---------|
| GeoJSON (`nm_kelurahan`) | `"Sumberbrantas"` |
| PODES API (`nama_desa`) | `"SUMBER BRANTAS"` |

Tanpa normalisasi → **Data tidak match** → Desa tidak muncul warna ❌

### Solution: normalizeDesaName()

```javascript
const normalizeDesaName = (name) => {
  return name?.toUpperCase()     // "Sumberbrantas" → "SUMBERBRANTAS"
             .trim()             // Remove leading/trailing spaces
             .replace(/\s+/g, '') // Remove ALL spaces
};

// Results:
normalizeDesaName("Sumberbrantas")      // → "SUMBERBRANTAS"
normalizeDesaName("SUMBER BRANTAS")     // → "SUMBERBRANTAS"
normalizeDesaName("sumber  brantas")    // → "SUMBERBRANTAS"
// ✅ Semua match!
```

### Implementation

```javascript
const findDesaData = (desaNameFromGeo) => {
  const normalized = normalizeDesaName(desaNameFromGeo);
  return podesData.find(d => 
    normalizeDesaName(d.nama_desa) === normalized
  );
};

// Usage in styling:
const getFeatureStyle = (feature) => {
  const desaName = feature.properties.nm_kelurahan;
  const desaData = findDesaData(desaName);  // ✅ Smart matching
  const value = desaData ? desaData[selectedIndicator] : 0;
  
  return {
    fillColor: getColor(value, selectedIndicator),
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };
};
```

## 🎭 Interactive Features

### 1. Hover Effects

```javascript
layer.on('mouseover', (e) => {
  // 1. Get village data
  const desaData = findDesaData(feature.properties.nm_kelurahan);
  const value = desaData[selectedIndicator];
  
  // 2. Show tooltip
  layer.bindTooltip(`
    <div style="padding: 8px;">
      <strong>${feature.properties.nm_kelurahan}</strong><br/>
      ${indicatorLabel}: <strong>${value}</strong>
    </div>
  `).openTooltip();
  
  // 3. Highlight style
  layer.setStyle({
    weight: 3,              // Thicker border
    color: '#666',          // Darker border
    fillOpacity: 0.9        // More opaque
  });
});
```

### 2. Mouse Out Reset

```javascript
layer.on('mouseout', (e) => {
  layer.closeTooltip();                    // Hide tooltip
  layer.setStyle(getFeatureStyle(feature)); // Reset to original style
});
```

## 📊 Data Sources

### 1. GeoJSON File
**Location**: `/client/public/kelurahan.geojson`

**Size**: 66,171 lines (3.2 MB)

**Structure**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "kd_propinsi": "35",
        "kd_dati2": "79",
        "kd_kecamatan": "002",
        "kd_kelurahan": "009",
        "nm_kelurahan": "Sumberbrantas"
      },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [[[
          [112.58182454500002, -7.751165446999948, 0.0],
          [112.58194303800001, -7.751273036999952, 0.0],
          // ... many more coordinates
        ]]]
      }
    },
    // ... 23 more villages
  ]
}
```

**Total**: 24 desa/kelurahan in Kota Batu

### 2. PODES API
**Endpoint**: `http://localhost:5001/api/villages`

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "nama_desa": "ORO-ORO OMBO",
      "nama_kecamatan": "BATU",
      "jumlah_tk": 2,
      "jumlah_sd": 3,
      "jumlah_smp": 1,
      "jumlah_sma": 1,
      "jumlah_rs": 1,
      "jumlah_puskesmas": 0,
      "jumlah_bts": 6,
      "kekuatan_sinyal": "Sangat Kuat",
      "jenis_sinyal_internet": "5G/4G/LTE",
      // ... 30+ more indicators
    },
    // ... 23 more villages
  ],
  "count": 24
}
```

## 🐛 Common Issues & Solutions

### Issue 1: Desa Tidak Muncul Warna
**Symptom**: Desa berwarna abu-abu/putih meskipun ada data

**Possible Causes**:
1. ❌ Nama desa tidak match antara GeoJSON dan PODES
2. ❌ Data indicator `undefined` atau `null`
3. ❌ Indikator key salah di config

**Solutions**:
```javascript
// 1. Check name matching
console.log('GeoJSON:', feature.properties.nm_kelurahan);
console.log('PODES:', desaData?.nama_desa);
console.log('Normalized GeoJSON:', normalizeDesaName(feature.properties.nm_kelurahan));
console.log('Normalized PODES:', normalizeDesaName(desaData?.nama_desa));

// 2. Check data availability
console.log('Indicator value:', desaData?.[selectedIndicator]);

// 3. Verify indicator key
console.log('Available keys:', Object.keys(desaData));
```

### Issue 2: Map Tidak Load
**Symptom**: Blank screen atau loading forever

**Possible Causes**:
1. ❌ GeoJSON file tidak ditemukan (404)
2. ❌ API endpoint tidak running
3. ❌ CORS error dari backend

**Solutions**:
```javascript
// Check in browser console:
// 1. Network tab → Check requests
// 2. Console tab → Look for errors

// Add error handling:
const loadData = async () => {
  try {
    const geoResponse = await fetch('/kelurahan.geojson');
    if (!geoResponse.ok) {
      console.error('GeoJSON failed:', geoResponse.status);
      throw new Error('Failed to load GeoJSON');
    }
    
    const podesResponse = await fetch('http://localhost:5001/api/villages');
    if (!podesResponse.ok) {
      console.error('API failed:', podesResponse.status);
      throw new Error('Failed to load PODES data');
    }
    
    // ... rest of code
  } catch (err) {
    console.error('Load error:', err);
    setError(err.message);
  }
};
```

### Issue 3: Tooltip Tidak Muncul
**Symptom**: Hover tidak menampilkan informasi

**Possible Causes**:
1. ❌ `onEachFeature` tidak dipanggil
2. ❌ Event listener tidak terdaftar
3. ❌ Tooltip content kosong/undefined

**Solutions**:
```javascript
const onEachFeature = (feature, layer) => {
  console.log('Setting up feature:', feature.properties.nm_kelurahan);
  
  layer.on('mouseover', (e) => {
    console.log('Hover detected');
    const desaData = findDesaData(feature.properties.nm_kelurahan);
    console.log('Village data:', desaData);
    const value = desaData?.[selectedIndicator] ?? 'N/A';
    console.log('Indicator value:', value);
    
    // ... tooltip code
  });
};
```

## 🚀 Performance Optimization

### 1. Memoization
```javascript
// Cache color calculations
const colorCache = useMemo(() => {
  const cache = {};
  podesData.forEach(village => {
    cache[village.nama_desa] = getColor(
      village[selectedIndicator], 
      selectedIndicator
    );
  });
  return cache;
}, [podesData, selectedIndicator]);
```

### 2. Lazy Loading
```javascript
// Only load GeoJSON when map is visible
const [isMapVisible, setIsMapVisible] = useState(false);

useEffect(() => {
  if (isMapVisible) {
    loadData();
  }
}, [isMapVisible]);
```

### 3. Debounce Indicator Changes
```javascript
import { debounce } from 'lodash';

const handleIndicatorChange = debounce((newIndicator) => {
  setSelectedIndicator(newIndicator);
}, 300);  // Wait 300ms after user stops changing
```

## 📝 Future Enhancements

### Planned Features
- [ ] **Click to View Details**: Click desa → Show full statistics modal
- [ ] **Legend Component**: Auto-generated legend based on current indicator
- [ ] **Export Map**: Download map as PNG/PDF
- [ ] **Compare Mode**: Show 2 indicators side-by-side
- [ ] **Time Series**: Animate changes over years (PODES 2021 → 2024)
- [ ] **Custom Boundaries**: Allow users to draw custom regions
- [ ] **Heat Map Layer**: Add density visualization option

### Technical Improvements
- [ ] **Service Worker**: Cache GeoJSON for offline access
- [ ] **WebGL Rendering**: Better performance for large datasets
- [ ] **Cluster Mode**: Group nearby villages at low zoom
- [ ] **Search Bar**: Search village by name
- [ ] **Bookmark Views**: Save favorite map configurations

## 📚 References

### Documentation
- [React Leaflet Docs](https://react-leaflet.js.org/)
- [Leaflet API Reference](https://leafletjs.com/reference.html)
- [GeoJSON Specification](https://geojson.org/)
- [OpenStreetMap Tile Usage](https://wiki.openstreetmap.org/wiki/Tiles)

### Color Palette Resources
- [ColorBrewer](https://colorbrewer2.org/) - Cartography color schemes
- [Chroma.js](https://gka.github.io/chroma.js/) - Color scale generator

### Learning Resources
- [Mapping with React](https://www.react-leaflet.js.org/docs/start-introduction/)
- [Choropleth Maps Tutorial](https://leafletjs.com/examples/choropleth/)

---

**Last Updated**: October 9, 2025  
**Version**: 1.0.0  
**Maintainer**: BPS Kota Batu Development Team

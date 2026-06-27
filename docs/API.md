# 🚀 API Documentation

> **Backend API endpoints untuk Dashboard PODES Kota Batu 2024**

## 🌐 Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 📊 Available Endpoints

### 1. Health Check
```http
GET /health
```

**Description**: Check if server is running
**Authentication**: None required

**Response**:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

### 2. Get All Villages
```http
GET /villages
```

**Description**: Retrieve all village/kelurahan data
**Authentication**: None required

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "kode_desa": "3571010001",
      "nama_desa": "SONGGOKERTO",
      "nama_kecamatan": "BATU",
      "jumlah_penduduk": 12345,
      "jumlah_kk": 3456,
      "jumlah_tk": 2,
      "jumlah_sd": 3,
      "jumlah_smp": 1,
      "jumlah_sma": 1,
      "jumlah_puskesmas": 1,
      "jumlah_rs": 0,
      "kekuatan_sinyal": "Sangat Kuat",
      "jenis_sinyal_internet": "5G/4G/LTE",
      "status_penerangan_jalan_surya": "Ada",
      "status_penerangan_jalan_utama": "Ada, sebagian besar",
      "jumlah_bts": 3,
      // ... more fields
    }
  ],
  "metadata": {
    "total": 24,
    "kecamatan": ["BATU", "BUMIAJI", "JUNREJO"],
    "source": "BPS Kota Batu 2024"
  }
}
```

**Status Codes**:
- `200` - Success
- `500` - Server error

---

### 3. Get Village by ID
```http
GET /villages/:id
```

**Description**: Get specific village data by kode_desa
**Authentication**: None required

**Parameters**:
- `id` (string): Village code (kode_desa)

**Example**:
```http
GET /villages/3571010001
```

**Response**:
```json
{
  "success": true,
  "data": {
    "kode_desa": "3571010001",
    "nama_desa": "SONGGOKERTO",
    "nama_kecamatan": "BATU",
    // ... complete village data
  }
}
```

**Status Codes**:
- `200` - Success
- `404` - Village not found
- `500` - Server error

---

### 4. Compare Villages
```http
POST /villages/compare
```

**Description**: Compare data between multiple villages
**Authentication**: None required
**Content-Type**: application/json

**Request Body**:
```json
{
  "villages": ["3571010001", "3571010002", "3571020001"],
  "indicators": ["jumlah_penduduk", "jumlah_tk", "jumlah_sd"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "comparison": [
      {
        "kode_desa": "3571010001",
        "nama_desa": "SONGGOKERTO",
        "indicators": {
          "jumlah_penduduk": 12345,
          "jumlah_tk": 2,
          "jumlah_sd": 3
        }
      },
      // ... other villages
    ],
    "summary": {
      "highest": {
        "jumlah_penduduk": {"village": "SONGGOKERTO", "value": 12345}
      },
      "lowest": {
        "jumlah_penduduk": {"village": "TEMAS", "value": 8900}
      }
    }
  }
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid request body
- `500` - Server error

---

### 5. Get Statistics
```http
GET /statistics
```

**Description**: Get summary statistics for dashboard KPIs
**Authentication**: None required

**Response**:
```json
{
  "success": true,
  "data": {
    "totals": {
      "desa": 24,
      "kecamatan": 3,
      "penduduk": 234567,
      "kk": 67890
    },
    "education": {
      "total_tk": 48,
      "total_sd": 72,
      "total_smp": 24,
      "total_sma": 24
    },
    "health": {
      "total_puskesmas": 12,
      "total_rs": 3
    },
    "infrastructure": {
      "villages_with_strong_signal": 16,
      "villages_with_5g": 24,
      "villages_with_solar_lighting": 17
    }
  }
}
```

---

### 6. Filter Villages
```http
GET /villages/filter
```

**Description**: Filter villages by various criteria
**Authentication**: None required

**Query Parameters**:
- `kecamatan` (string, optional): Filter by kecamatan name
- `min_population` (number, optional): Minimum population
- `max_population` (number, optional): Maximum population
- `has_hospital` (boolean, optional): Villages with hospital
- `signal_quality` (string, optional): Signal quality level

**Example**:
```http
GET /villages/filter?kecamatan=BATU&min_population=5000&signal_quality=Sangat Kuat
```

**Response**: Same structure as GET /villages but filtered

---

## 🔧 Request/Response Format

### Standard Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "metadata": { /* optional metadata */ }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  }
}
```

## 🚨 Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VILLAGE_NOT_FOUND` | 404 | Village with specified ID not found |
| `INVALID_REQUEST` | 400 | Request body or parameters invalid |
| `SERVER_ERROR` | 500 | Internal server error |
| `DATA_NOT_AVAILABLE` | 503 | Data temporarily unavailable |

## 📊 Data Schema

### Village Object
```typescript
interface Village {
  // Basic Info
  kode_desa: string;           // Village code
  nama_desa: string;           // Village name  
  nama_kecamatan: string;      // District name
  
  // Demographics
  jumlah_penduduk: number;     // Population count
  jumlah_kk: number;           // Number of households
  
  // Education Facilities
  jumlah_tk: number;           // Kindergartens
  jumlah_sd: number;           // Elementary schools
  jumlah_smp: number;          // Junior high schools
  jumlah_sma: number;          // Senior high schools
  
  // Health Facilities  
  jumlah_puskesmas: number;    // Community health centers
  jumlah_rs: number;           // Hospitals
  
  // Infrastructure
  kekuatan_sinyal: string;           // "Sangat Kuat" | "Kuat" | "Sedang" | "Lemah"
  jenis_sinyal_internet: string;     // "5G/4G/LTE" | "3G" | "2G"
  status_penerangan_jalan_surya: string;  // "Ada" | "Tidak Ada"  
  status_penerangan_jalan_utama: string;  // "Ada, sebagian besar" | "Ada, sebagian kecil"
  jumlah_bts: number;                // Number of BTS towers
  
  // Environment (if available)
  // ... additional fields
}
```

## 🔌 Frontend Integration

### Using with Axios
```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Get all villages
const getAllVillages = async () => {
  try {
    const response = await axios.get(`${API_BASE}/villages`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Compare villages
const compareVillages = async (villageIds, indicators) => {
  try {
    const response = await axios.post(`${API_BASE}/villages/compare`, {
      villages: villageIds,
      indicators: indicators
    });
    return response.data;
  } catch (error) {
    console.error('Comparison Error:', error);
    throw error;
  }
};
```

### Using with Fetch
```javascript
// Get statistics
const getStatistics = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/statistics');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

## 🗺️ Static GeoJSON Data

### GeoJSON File
```http
GET /kelurahan.geojson
```

**Description**: Village/kelurahan boundary data for mapping
**Location**: `/client/public/kelurahan.geojson`
**Format**: GeoJSON FeatureCollection
**Size**: ~3.2 MB (66,171 lines)

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
          [112.58182, -7.75116, 0.0],
          [112.58194, -7.75127, 0.0]
          // ... more coordinates
        ]]]
      }
    }
    // ... 23 more villages
  ]
}
```

**Usage in Frontend**:
```javascript
// Fetch GeoJSON for mapping
const response = await fetch('/kelurahan.geojson');
const geoData = await response.json();

// Use with React Leaflet
<GeoJSON data={geoData} style={styleFunction} />
```

**Important Notes**:
- Contains boundary polygons for all 24 desa/kelurahan in Kota Batu
- Property `nm_kelurahan` must be matched with PODES data `nama_desa`
- Use `normalizeDesaName()` for name matching (handles spacing differences)
- Coordinate system: WGS84 (EPSG:4326)

## 🧪 Testing API

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Get all villages
curl http://localhost:5000/api/villages

# Get specific village
curl http://localhost:5000/api/villages/3571010001

# Compare villages
curl -X POST http://localhost:5000/api/villages/compare \
  -H "Content-Type: application/json" \
  -d '{
    "villages": ["3571010001", "3571010002"],
    "indicators": ["jumlah_penduduk", "jumlah_tk"]
  }'

# Get GeoJSON
curl http://localhost:3000/kelurahan.geojson
```

### Using Postman
1. Import endpoints into Postman collection
2. Set base URL as environment variable
3. Test each endpoint with sample data
4. Verify response schemas

## 📈 Performance Notes

- **Caching**: Data is cached in memory for better performance
- **Response Time**: Typical response time < 100ms for village data
- **Rate Limiting**: No rate limiting currently implemented
- **Pagination**: Not implemented (24 villages total, small dataset)

## 🔒 Security Considerations

- **CORS**: Enabled for development, configure for production
- **Input Validation**: Basic validation on POST endpoints
- **No Authentication**: Currently public API, add auth for production
- **Sanitization**: Data is sanitized before sending responses

---

**💡 Tips for Frontend Developers**

1. **Error Handling**: Always wrap API calls in try-catch
2. **Loading States**: Show loading indicators during API calls
3. **Caching**: Consider caching responses for better UX
4. **Type Safety**: Use TypeScript interfaces for better development experience
5. **Testing**: Mock API responses for component testing
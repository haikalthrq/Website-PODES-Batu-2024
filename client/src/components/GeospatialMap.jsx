import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  ListSubheader
} from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Komponen untuk auto fit bounds dengan pembatasan
function FitBounds({ geojson }) {
  const map = useMap();
  
  useEffect(() => {
    if (geojson && geojson.features && geojson.features.length > 0) {
      const geoJsonLayer = L.geoJSON(geojson);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        // Fit bounds dengan padding untuk tampilan lebih baik
        map.fitBounds(bounds, {
          padding: [20, 20], // Padding 20px dari edges
          maxZoom: 13 // Prevent zooming in too much on initial load
        });
      }
    }
  }, [geojson, map]);
  
  return null;
}

const GeospatialMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [podesData, setPodesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedIndicator, setSelectedIndicator] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kategori utama (dengan opsi "Semua")
  const categories = ['Semua', 'Pendidikan', 'Kesehatan', 'Infrastruktur & Konektivitas', 'Lingkungan & Kebencanaan'];

  // Mapping indikator per kategori (sama seperti di sidebar)
  const indicatorsByCategory = {
    'Semua': {
      'Semua': 'Semua Indikator'
    },
    'Pendidikan': {
      'jumlah_tk': 'Jumlah TK',
      'jumlah_sd': 'Jumlah SD',
      'jumlah_smp': 'Jumlah SMP',
      'jumlah_sma': 'Jumlah SMA'
    },
    'Kesehatan': {
      'jumlah_rs': 'Jumlah Rumah Sakit',
      'jumlah_puskesmas': 'Jumlah Puskesmas',
      'jumlah_puskesmas_inap': 'Jumlah Puskesmas Rawat Inap'
    },
    'Infrastruktur & Konektivitas': {
      'jumlah_bts': 'Jumlah BTS',
      'kekuatan_sinyal': 'Kekuatan Sinyal',
      'jenis_sinyal_internet': 'Jenis Sinyal Internet',
      'status_penerangan_jalan_surya': 'Penerangan Jalan Tenaga Surya',
      'status_penerangan_jalan_utama': 'Penerangan Jalan Utama'
    },
    'Lingkungan & Kebencanaan': {
      'status_peringatan_dini': 'Sistem Peringatan Dini',
      'status_alat_keselamatan': 'Alat Keselamatan',
      'status_rambu_evakuasi': 'Rambu Evakuasi',
      'partisipasi_simulasi_bencana': 'Partisipasi Simulasi Bencana',
      'partisipasi_gladi_siaga_bencana': 'Partisipasi Gladi Siaga Bencana',
      'kejadian_tanah_longsor': 'Kejadian Tanah Longsor',
      'kejadian_banjir': 'Kejadian Banjir',
      'kejadian_gempa': 'Kejadian Gempa',
      'status_tps': 'Tempat Penampungan Sampah (TPS)',
      'status_tps3r': 'TPS 3R (Reduce, Reuse, Recycle)',
      'status_dilakukan_pemilahan_sampah': 'Status Pemilahan Sampah',
      'kebiasaan_pemilahan_sampah': 'Kebiasaan Pemilahan Sampah',
      'warga_terlibat_olah_sampah': 'Partisipasi Warga Pengolahan Sampah',
      'status_buang_sampah_dibakar': 'Status Sampah Dibakar',
      'komunitas_lingkungan': 'Komunitas Lingkungan',
      'kebiasaan_bakar_lahan': 'Kebiasaan Bakar Lahan',
      'permukiman_bantaran_sungai': 'Permukiman Bantaran Sungai',
      'sumber_pencemaran_air_dari_pabrik': 'Pencemaran Air dari Pabrik',
      'jumlah_keluarga_pengguna_kayu_bakar': 'Jumlah Keluarga Pengguna Kayu Bakar'
    }
  };

  // Handler untuk perubahan kategori
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    // Set indikator pertama dari kategori baru
    const firstIndicator = Object.keys(indicatorsByCategory[newCategory])[0];
    setSelectedIndicator(firstIndicator);
  };

  // Load data saat komponen di-mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load GeoJSON
      const geoResponse = await fetch('/kelurahan.geojson');
      if (!geoResponse.ok) throw new Error('Failed to load GeoJSON');
      const geoJson = await geoResponse.json();
      
      // Load PODES data from correct endpoint
      const podesResponse = await fetch('http://localhost:5001/api/villages');
      if (!podesResponse.ok) throw new Error('Failed to load PODES data');
      const podesResult = await podesResponse.json();
      
      // Extract data array from response (API returns { success, data, count, ... })
      const podes = podesResult.data || [];
      
      console.log('✅ Data loaded:', {
        geoFeatures: geoJson.features?.length,
        podesVillages: podes.length
      });
      
      // Debug: Check village name matching
      console.log('📍 Sample GeoJSON names:', geoJson.features?.slice(0, 3).map(f => f.properties.nm_kelurahan));
      console.log('📍 Sample PODES names:', podes.slice(0, 3).map(d => d.nama_desa));
      
      setGeoData(geoJson);
      setPodesData(podes);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Fungsi untuk mendapatkan warna berdasarkan nilai
  const getColor = (value, indicator) => {
    // Jika "Semua" dipilih, gunakan warna netral/default
    if (indicator === 'Semua') return '#94a3b8'; // Gray neutral color
    
    if (!value || value === 0 || value === 'Tidak Terdefinisi' || value === 'N/A') return '#f7f7f7';
    
    // Indikator kuantitatif (angka)
    const quantitativeIndicators = [
      'jumlah_tk', 'jumlah_sd', 'jumlah_smp', 'jumlah_sma',
      'jumlah_rs', 'jumlah_puskesmas', 'jumlah_puskesmas_inap',
      'jumlah_bts', 'jumlah_keluarga_pengguna_kayu_bakar'
    ];
    
    if (quantitativeIndicators.includes(indicator)) {
      // Range berbeda per indikator
      const ranges = {
        jumlah_tk: [0, 1, 2],
        jumlah_sd: [0, 2, 4, 6],
        jumlah_smp: [0, 1, 2],
        jumlah_sma: [0, 1, 2],
        jumlah_rs: [0, 1, 2],
        jumlah_puskesmas: [0, 1, 2],
        jumlah_puskesmas_inap: [0, 1, 2],
        jumlah_bts: [0, 2, 4, 6],
        jumlah_keluarga_pengguna_kayu_bakar: [0, 1, 2],
      };

      const range = ranges[indicator] || [0, 1, 2, 3];
      const colors = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'];
      
      for (let i = range.length - 1; i >= 0; i--) {
        if (value >= range[i]) {
          return colors[i];
        }
      }
      return colors[0];
    }
    
    // Indikator kualitatif (kategori)
    // Warna hijau untuk kondisi baik, merah untuk buruk, kuning untuk sedang
    const colorMap = {
      // Sinyal & Internet
      'Sangat Kuat': '#10b981',
      'Kuat': '#34d399',
      'Lemah': '#fbbf24',
      'Sangat Lemah': '#f87171',
      '5G/4G/LTE': '#10b981',
      '3G': '#fbbf24',
      '2G': '#f87171',
      
      // Status Ada/Tidak Ada
      'Ada': '#10b981',
      'Ada, digunakan': '#059669',
      'Ada, tidak digunakan': '#fbbf24',
      'Ada, sebagian besar': '#34d399',
      'Ada, sebagian kecil': '#fde047',
      'Tidak Ada': '#f87171',
      'Tidak ada': '#f87171',
      
      // Kebiasaan & Partisipasi
      'Semua Keluarga': '#10b981',
      'Sebagian Besar Keluarga': '#34d399',
      'Sebagian Kecil Keluarga': '#fbbf24',
      'Sebagian Besar Warga': '#34d399',
      'Sebagian Kecil Warga': '#fde047',
      'Ada, sebagian warga terlibat': '#34d399',
      'Ada, semua warga terlibat': '#10b981',
      
      // Komunitas
      'Ada, aktif': '#10b981',
      'Ada, tidak aktif': '#fbbf24',
      
      // Ya/Tidak
      'Ya': '#f87171',
      'Tidak': '#10b981',
      
      // Default
      'default': '#94a3b8'
    };
    
    return colorMap[value] || colorMap['default'];
  };

  // Helper function untuk matching nama desa yang lebih fleksibel
  const normalizeDesaName = (name) => {
    return name?.toUpperCase().trim().replace(/\s+/g, '');
  };

  const findDesaData = (desaNameFromGeo) => {
    const normalized = normalizeDesaName(desaNameFromGeo);
    return podesData.find(d => normalizeDesaName(d.nama_desa) === normalized);
  };

  // Style untuk setiap feature
  const getFeatureStyle = (feature) => {
    const desaName = feature.properties.nm_kelurahan;
    const desaData = findDesaData(desaName);
    
    const value = desaData ? desaData[selectedIndicator] : 0;
    
    return {
      fillColor: getColor(value, selectedIndicator),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  // Event handlers untuk interaktivitas
  const onEachFeature = (feature, layer) => {
    const desaName = feature.properties.nm_kelurahan;
    
    // Update tooltip dynamically on mouseover
    layer.on('mouseover', (e) => {
      const desaData = findDesaData(desaName);
      
      // Jika "Semua" dipilih, tampilkan informasi desa saja
      let tooltipContent;
      if (selectedIndicator === 'Semua') {
        tooltipContent = `<div style="padding: 8px;">
          <strong>${feature.properties.nm_kelurahan}</strong><br/>
          <em style="color: #6b7280; font-size: 0.875rem;">Pilih indikator spesifik untuk melihat data</em>
        </div>`;
      } else {
        const value = desaData ? desaData[selectedIndicator] : 'N/A';
        const indicatorLabel = indicatorsByCategory[selectedCategory]?.[selectedIndicator] || selectedIndicator;
        
        tooltipContent = `<div style="padding: 8px;">
          <strong>${feature.properties.nm_kelurahan}</strong><br/>
          ${indicatorLabel}: <strong>${value}</strong>
        </div>`;
      }
      
      layer.bindTooltip(tooltipContent, { 
        permanent: false, 
        direction: 'top',
        className: 'custom-tooltip'
      }).openTooltip();
      
      // Highlight style
      layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9
      });
    });

    layer.on('mouseout', (e) => {
      layer.closeTooltip();
      layer.setStyle(getFeatureStyle(feature));
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={500}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading map data: {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          🗺️ Peta Geospasial Kota Batu
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Visualisasi data PODES 2024 per desa/kelurahan - 
          <strong style={{ color: '#1976d2', marginLeft: '4px' }}>
            {selectedCategory === 'Semua' && selectedIndicator === 'Semua' 
              ? 'Semua Kategori & Indikator' 
              : `${selectedCategory} - ${indicatorsByCategory[selectedCategory]?.[selectedIndicator] || 'Pilih Indikator'}`
            }
          </strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
          📍 Peta terfokus pada wilayah Kota Batu, Jawa Timur (24 desa/kelurahan)
        </Typography>
      </Box>

      {/* Filter 2 Tingkat: Kategori dan Indikator */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Filter Kategori Utama */}
        <FormControl size="small" sx={{ minWidth: 250, flex: 1 }}>
          <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600, color: '#374151' }}>
            Kategori Utama
          </Typography>
          <Select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            displayEmpty
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filter Indikator Spesifik */}
        <FormControl size="small" sx={{ minWidth: 250, flex: 1 }}>
          <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600, color: '#374151' }}>
            Indikator Spesifik
          </Typography>
          <Select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            displayEmpty
          >
            {Object.entries(indicatorsByCategory[selectedCategory] || {}).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Peta */}
      <Box sx={{ height: 600, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
        <MapContainer
          center={[-7.8671, 112.5239]} // Koordinat pusat Kota Batu
          zoom={12}
          minZoom={10} // Minimum zoom - prevent zooming out too far
          maxZoom={18} // Maximum zoom untuk detail
          maxBounds={[
            [-8.5, 111.5],  // Southwest corner (batas bawah Jawa Timur)
            [-7.2, 113.5]   // Northeast corner (batas atas Jawa Timur)
          ]}
          maxBoundsViscosity={1.0} // Prevents map from being dragged outside bounds
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {geoData && (
            <>
              <GeoJSON
                key={selectedIndicator} // Force re-render when indicator changes
                data={geoData}
                style={getFeatureStyle}
                onEachFeature={onEachFeature}
              />
              <FitBounds geojson={geoData} />
            </>
          )}
        </MapContainer>
      </Box>
    </Paper>
  );
};

export default GeospatialMap;

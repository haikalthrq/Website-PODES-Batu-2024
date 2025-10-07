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

// Komponen untuk auto fit bounds
function FitBounds({ geojson }) {
  const map = useMap();
  
  useEffect(() => {
    if (geojson && geojson.features && geojson.features.length > 0) {
      const geoJsonLayer = L.geoJSON(geojson);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    }
  }, [geojson, map]);
  
  return null;
}

const GeospatialMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [podesData, setPodesData] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState('jumlah_sd');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Daftar indikator yang tersedia (dikelompokkan berdasarkan kategori)
  const indicators = [
    // === PENDIDIKAN ===
    { value: 'jumlah_tk', label: '📚 Pendidikan: Jumlah TK', category: 'Pendidikan' },
    { value: 'jumlah_sd', label: '📚 Pendidikan: Jumlah SD', category: 'Pendidikan' },
    { value: 'jumlah_smp', label: '📚 Pendidikan: Jumlah SMP', category: 'Pendidikan' },
    { value: 'jumlah_sma', label: '📚 Pendidikan: Jumlah SMA', category: 'Pendidikan' },
    
    // === KESEHATAN ===
    { value: 'jumlah_rs', label: '🏥 Kesehatan: Jumlah Rumah Sakit', category: 'Kesehatan' },
    { value: 'jumlah_puskesmas', label: '🏥 Kesehatan: Jumlah Puskesmas', category: 'Kesehatan' },
    { value: 'jumlah_puskesmas_inap', label: '🏥 Kesehatan: Jumlah Puskesmas Rawat Inap', category: 'Kesehatan' },
    
    // === INFRASTRUKTUR & KONEKTIVITAS ===
    { value: 'jumlah_bts', label: '🌐 Infrastruktur: Jumlah BTS', category: 'Infrastruktur' },
    { value: 'kekuatan_sinyal', label: '🌐 Infrastruktur: Kekuatan Sinyal', category: 'Infrastruktur' },
    { value: 'jenis_sinyal_internet', label: '🌐 Infrastruktur: Jenis Sinyal Internet', category: 'Infrastruktur' },
    { value: 'status_penerangan_jalan_surya', label: '🌐 Infrastruktur: Penerangan Jalan Tenaga Surya', category: 'Infrastruktur' },
    { value: 'status_penerangan_jalan_utama', label: '🌐 Infrastruktur: Penerangan Jalan Utama', category: 'Infrastruktur' },
    
    // === LINGKUNGAN & KEBENCANAAN ===
    { value: 'status_peringatan_dini', label: '⚠️ Kebencanaan: Sistem Peringatan Dini', category: 'Lingkungan' },
    { value: 'status_alat_keselamatan', label: '⚠️ Kebencanaan: Alat Keselamatan', category: 'Lingkungan' },
    { value: 'status_rambu_evakuasi', label: '⚠️ Kebencanaan: Rambu Evakuasi', category: 'Lingkungan' },
    { value: 'partisipasi_simulasi_bencana', label: '⚠️ Kebencanaan: Partisipasi Simulasi Bencana', category: 'Lingkungan' },
    { value: 'partisipasi_gladi_siaga_bencana', label: '⚠️ Kebencanaan: Partisipasi Gladi Siaga Bencana', category: 'Lingkungan' },
    { value: 'kejadian_tanah_longsor', label: '⚠️ Kebencanaan: Kejadian Tanah Longsor', category: 'Lingkungan' },
    { value: 'kejadian_banjir', label: '⚠️ Kebencanaan: Kejadian Banjir', category: 'Lingkungan' },
    { value: 'kejadian_gempa', label: '⚠️ Kebencanaan: Kejadian Gempa', category: 'Lingkungan' },
    
    // === PENGELOLAAN SAMPAH ===
    { value: 'status_tps', label: '♻️ Sampah: Tempat Penampungan Sampah (TPS)', category: 'Lingkungan' },
    { value: 'status_tps3r', label: '♻️ Sampah: TPS 3R (Reduce, Reuse, Recycle)', category: 'Lingkungan' },
    { value: 'status_dilakukan_pemilahan_sampah', label: '♻️ Sampah: Status Pemilahan Sampah', category: 'Lingkungan' },
    { value: 'kebiasaan_pemilahan_sampah', label: '♻️ Sampah: Kebiasaan Pemilahan Sampah', category: 'Lingkungan' },
    { value: 'warga_terlibat_olah_sampah', label: '♻️ Sampah: Partisipasi Warga Pengolahan Sampah', category: 'Lingkungan' },
    { value: 'status_buang_sampah_dibakar', label: '♻️ Sampah: Status Sampah Dibakar', category: 'Lingkungan' },
    
    // === LINGKUNGAN LAINNYA ===
    { value: 'komunitas_lingkungan', label: '🌳 Lingkungan: Komunitas Lingkungan', category: 'Lingkungan' },
    { value: 'kebiasaan_bakar_lahan', label: '🌳 Lingkungan: Kebiasaan Bakar Lahan', category: 'Lingkungan' },
    { value: 'permukiman_bantaran_sungai', label: '🌳 Lingkungan: Permukiman Bantaran Sungai', category: 'Lingkungan' },
    { value: 'sumber_pencemaran_air_dari_pabrik', label: '🌳 Lingkungan: Pencemaran Air dari Pabrik', category: 'Lingkungan' },
    { value: 'jumlah_keluarga_pengguna_kayu_bakar', label: '🌳 Lingkungan: Jumlah Keluarga Pengguna Kayu Bakar', category: 'Lingkungan' },
  ];

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

  // Style untuk setiap feature
  const getFeatureStyle = (feature) => {
    const desaName = feature.properties.nm_kelurahan?.toUpperCase().trim();
    const desaData = podesData.find(
      d => d.nama_desa?.toUpperCase().trim() === desaName
    );
    
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
    const desaName = feature.properties.nm_kelurahan?.toUpperCase().trim();
    
    // Update tooltip dynamically on mouseover
    layer.on('mouseover', (e) => {
      const desaData = podesData.find(
        d => d.nama_desa?.toUpperCase().trim() === desaName
      );
      
      const value = desaData ? desaData[selectedIndicator] : 'N/A';
      const indicatorLabel = indicators.find(i => i.value === selectedIndicator)?.label || selectedIndicator;
      
      // Update tooltip content
      const tooltipContent = `<div style="padding: 8px;">
        <strong>${feature.properties.nm_kelurahan}</strong><br/>
        ${indicatorLabel}: <strong>${value}</strong>
      </div>`;
      
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
            {indicators.find(i => i.value === selectedIndicator)?.label.replace(/^(📚 Pendidikan|🏥 Kesehatan|🌐 Infrastruktur|⚠️ Kebencanaan|♻️ Sampah|🌳 Lingkungan): /, '') || 'Pilih Indikator'}
          </strong>
        </Typography>
      </Box>

      {/* Dropdown Indikator */}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth size="small" sx={{ maxWidth: 400 }}>
          <Select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            displayEmpty
          >
            {/* Group by category */}
            <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              📚 PENDIDIKAN
            </ListSubheader>
            {indicators.filter(ind => ind.category === 'Pendidikan').map((ind) => (
              <MenuItem key={ind.value} value={ind.value} sx={{ pl: 4 }}>
                {ind.label.replace('📚 Pendidikan: ', '')}
              </MenuItem>
            ))}
            
            <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🏥 KESEHATAN
            </ListSubheader>
            {indicators.filter(ind => ind.category === 'Kesehatan').map((ind) => (
              <MenuItem key={ind.value} value={ind.value} sx={{ pl: 4 }}>
                {ind.label.replace('🏥 Kesehatan: ', '')}
              </MenuItem>
            ))}
            
            <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🌐 INFRASTRUKTUR & KONEKTIVITAS
            </ListSubheader>
            {indicators.filter(ind => ind.category === 'Infrastruktur').map((ind) => (
              <MenuItem key={ind.value} value={ind.value} sx={{ pl: 4 }}>
                {ind.label.replace('🌐 Infrastruktur: ', '')}
              </MenuItem>
            ))}
            
            <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ⚠️ LINGKUNGAN & KEBENCANAAN
            </ListSubheader>
            {indicators.filter(ind => ind.category === 'Lingkungan').map((ind) => (
              <MenuItem key={ind.value} value={ind.value} sx={{ pl: 4 }}>
                {ind.label.replace(/^(⚠️ Kebencanaan|♻️ Sampah|🌳 Lingkungan): /, '')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Peta */}
      <Box sx={{ height: 600, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
        <MapContainer
          center={[-7.8671, 112.5239]}
          zoom={12}
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

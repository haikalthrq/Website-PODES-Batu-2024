/**
 * Test script to validate column configurations
 */
import { getColumnsForCategory, getAvailableCategories } from '../config/table/index.js';

// Test data sample (from actual JSON)
const sampleData = {
  "id_desa": 3579010001,
  "nama_kecamatan": "BATU",
  "nama_desa": "ORO-ORO OMBO",
  "jumlah_tk": 0,
  "jumlah_sd": 3,
  "jumlah_smp": 0,
  "jumlah_sma": 0,
  "jumlah_rs": 0,
  "jumlah_puskesmas_inap": 0,
  "jumlah_puskesmas": 0,
  "jumlah_bts": 6,
  "kekuatan_sinyal": "Sangat Kuat",
  "jenis_sinyal_internet": "5G/4G/LTE",
  "status_penerangan_jalan_utama": "Ada, sebagian besar",
  "status_tps": "Ada",
  "status_tps3r": "Ada, digunakan",
  "kejadian_banjir": "Tidak ada",
  "kejadian_tanah_longsor": "Ada",
  "kejadian_gempa": "Ada",
  "status_peringatan_dini": "Ada"
};

console.log('=== COLUMN CONFIGURATION TEST ===');

const categories = getAvailableCategories();
console.log('Available categories:', categories);

categories.forEach(category => {
  console.log(`\n--- ${category} ---`);
  const columns = getColumnsForCategory(category);
  console.log(`Columns (${columns.length}):`, columns.map(c => c.key));
  
  // Test data access
  console.log('Sample values:');
  columns.forEach(column => {
    const value = column.accessor ? column.accessor(sampleData) : sampleData[column.dataKey || column.key];
    console.log(`  ${column.key}: ${value}`);
  });
});

export default function runColumnTest() {
  console.log('Column configuration test completed. Check console output.');
}
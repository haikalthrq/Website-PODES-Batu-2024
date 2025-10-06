/**
 * Registry terpusat untuk semua indikator Infrastruktur & Konektivitas
 * Satu sumber kebenaran untuk visualisasi baik mode "Semua" maupun single indicator
 */

export const INFRA_INDICATORS = {
  kualitas_sinyal_seluler: {
    id: 'kualitas_sinyal_seluler',
    title: 'Kualitas Sinyal Seluler',
    dataKey: 'kekuatan_sinyal', // field sebenarnya di JSON
    type: 'qualitative',
    categories: ['Sangat Kuat', 'Kuat'], // Based on actual data - only these 2 categories exist
    charts: [
      { type: 'donut',   title: 'Distribusi Kualitas Sinyal Internet' },
      { type: 'bar',     title: 'Ranking Kategori', orientation: 'horizontal' },
      { type: 'stacked', title: 'Distribusi per Kecamatan', xAxis: 'kecamatan' },
    ],
    icon: '📶',
    legend: true,
  },

  jenis_akses_internet: {
    id: 'jenis_akses_internet',
    title: 'Jenis Akses Internet',
    dataKey: 'jenis_sinyal_internet',
    type: 'qualitative',
    categories: ['5G/4G/LTE'], // Based on actual data - only this category exists
    charts: [
      { type: 'donut', title: 'Distribusi Jenis Sinyal Internet' },
      { type: 'bar',   title: 'Ranking Kategori', orientation: 'horizontal' },
      { type: 'stacked', title: 'Distribusi per Kecamatan', xAxis: 'kecamatan' },
    ],
    icon: '🌐',
    legend: true,
  },

  penerangan_jalan_tenaga_surya: {
    id: 'penerangan_jalan_tenaga_surya',
    title: 'Penerangan Jalan Tenaga Surya',
    dataKey: 'status_penerangan_jalan_surya',
    type: 'qualitative',
    categories: ['Ada', 'Tidak Ada'], // Confirmed correct
    charts: [
      { type: 'donut', title: 'Distribusi Penerangan Jalan Tenaga Surya' },
      { type: 'bar',   title: 'Ranking Kategori', orientation: 'horizontal' },
      { type: 'stacked', title: 'Distribusi per Kecamatan', xAxis: 'kecamatan' },
    ],
    icon: '☀️',
    legend: true,
  },

  penerangan_jalan_utama: {
    id: 'penerangan_jalan_utama',
    title: 'Penerangan Jalan Utama',
    dataKey: 'status_penerangan_jalan_utama',
    type: 'qualitative',
    categories: ['Ada, sebagian besar', 'Ada, sebagian kecil'], // Based on actual data
    // Shorter display labels for charts to prevent truncation
    displayLabels: {
      'Ada, sebagian besar': 'Sebagian Besar',
      'Ada, sebagian kecil': 'Sebagian Kecil'
    },
    charts: [
      { type: 'donut', title: 'Distribusi Penerangan Jalan Utama' },
      { type: 'bar',   title: 'Ranking Kategori', orientation: 'horizontal' },
      { type: 'stacked', title: 'Distribusi per Kecamatan', xAxis: 'kecamatan' },
    ],
    icon: '💡',
    legend: true,
  },
};

export const INFRA_INDICATOR_KEYS = Object.keys(INFRA_INDICATORS);

// Helper function to get indicator config
export const getIndicatorConfig = (indicatorKey) => {
  return INFRA_INDICATORS[indicatorKey] || null;
};

// Helper function to get all indicator options for filter
export const getIndicatorOptions = () => {
  return INFRA_INDICATOR_KEYS.map(key => ({
    label: INFRA_INDICATORS[key].title,
    value: key
  }));
};

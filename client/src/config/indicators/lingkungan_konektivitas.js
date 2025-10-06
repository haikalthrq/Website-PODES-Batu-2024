// Konfigurasi indikator Lingkungan & Konektivitas
export const LINGKUNGAN_KONEKTIVITAS_INDICATORS = [
  { 
    key: "kualitas_sinyal_seluler", 
    label: "Kualitas Sinyal Seluler", 
    type: "qualitative",
    icon: "📶",
    dataKey: "kekuatan_sinyal"  // Field sebenarnya dari JSON
  },
  { 
    key: "jenis_akses_internet", 
    label: "Jenis Akses Internet", 
    type: "qualitative",
    icon: "🌐",
    dataKey: "jenis_sinyal_internet"  // Field sudah benar
  },
  { 
    key: "penerangan_jalan_tenaga_surya", 
    label: "Penerangan Jalan Tenaga Surya", 
    type: "qualitative",
    icon: "☀️",
    dataKey: "status_penerangan_jalan_surya"  // Field sebenarnya dari JSON
  },
  { 
    key: "penerangan_jalan_utama", 
    label: "Penerangan Jalan Utama", 
    type: "qualitative",
    icon: "💡",
    dataKey: "status_penerangan_jalan_utama"  // Field sebenarnya dari JSON
  }
];

export default LINGKUNGAN_KONEKTIVITAS_INDICATORS;
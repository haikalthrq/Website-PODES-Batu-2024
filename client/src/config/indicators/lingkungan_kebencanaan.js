// Konfigurasi indikator Lingkungan dan Kebencanaan - Updated to match actual data fields
export const LINGKUNGAN_KEBENCANAAN_INDICATORS = [
  { 
    key: "sistem_peringatan_dini", 
    label: "Sistem Peringatan Dini", 
    type: "qualitative",
    icon: "🚨",
    dataKey: "status_peringatan_dini"
  },
  { 
    key: "alat_keselamatan", 
    label: "Alat Keselamatan", 
    type: "qualitative",
    icon: "🦺",
    dataKey: "status_alat_keselamatan"
  },
  { 
    key: "rambu_keselamatan", 
    label: "Rambu Keselamatan", 
    type: "qualitative",
    icon: "🚧",
    dataKey: "status_rambu_evakuasi"
  },
  { 
    key: "tempat_pembuangan_sampah", 
    label: "Tempat Penampungan Sampah (TPS)", 
    type: "qualitative",
    icon: "🗑️",
    dataKey: "status_tps"
  },
  { 
    key: "tempat_pengelolaan_sampah_3r", 
    label: "Tempat Penampungan Sampah 3R (TPS3R)", 
    type: "qualitative",
    icon: "♻️",
    dataKey: "status_tps3r"
  },
  { 
    key: "pemilahan_sampah", 
    label: "Pemilahan Sampah", 
    type: "qualitative",
    icon: "🔄",
    dataKey: "status_dilakukan_pemilahan_sampah"
  },
  { 
    key: "kebiasaan_pemilahan_sampah", 
    label: "Kebiasaan Pemilahan Sampah", 
    type: "qualitative",
    icon: "👨‍👩‍👧‍👦",
    dataKey: "kebiasaan_pemilahan_sampah"
  },
  { 
    key: "partisipasi_warga_pengolahan_sampah", 
    label: "Partisipasi Warga Pengolahan Sampah", 
    type: "qualitative",
    icon: "🤝",
    dataKey: "warga_terlibat_olah_sampah"
  },
  { 
    key: "kebiasaan_bakar_lahan", 
    label: "Kebiasaan Bakar Lahan", 
    type: "qualitative",
    icon: "🔥",
    dataKey: "kebiasaan_bakar_lahan"
  },
  { 
    key: "pencemaran_air_pabrik", 
    label: "Pencemaran Air dari Pabrik", 
    type: "qualitative",
    icon: "🏭",
    dataKey: "sumber_pencemaran_air_dari_pabrik"
  }
];

export default LINGKUNGAN_KEBENCANAAN_INDICATORS;
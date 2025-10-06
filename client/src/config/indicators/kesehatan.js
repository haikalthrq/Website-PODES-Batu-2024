// Konfigurasi indikator Kesehatan
export const KESEHATAN_INDICATORS = [
  { 
    key: "rs", 
    label: "Jumlah Rumah Sakit", 
    type: "quantitative",
    icon: "🏥",
    dataKey: "jumlah_rs",
    accessor: (row) => row.jumlah_rs || 0
  },
  { 
    key: "puskesmas", 
    label: "Jumlah Puskesmas", 
    type: "quantitative",
    icon: "⚕️",
    dataKey: "jumlah_puskesmas",
    accessor: (row) => row.jumlah_puskesmas || 0
  }
];

export default KESEHATAN_INDICATORS;
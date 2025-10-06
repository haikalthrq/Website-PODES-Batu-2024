// Konfigurasi indikator Pendidikan
export const PENDIDIKAN_INDICATORS = [
  { 
    key: "tk", 
    label: "Jumlah TK", 
    type: "quantitative",
    icon: "🎓",
    dataKey: "jumlah_tk",
    accessor: (row) => row.jumlah_tk || 0
  },
  { 
    key: "sd", 
    label: "Jumlah SD", 
    type: "quantitative",
    icon: "📚",
    dataKey: "jumlah_sd",
    accessor: (row) => row.jumlah_sd || 0
  },
  { 
    key: "smp", 
    label: "Jumlah SMP", 
    type: "quantitative",
    icon: "🏫",
    dataKey: "jumlah_smp",
    accessor: (row) => row.jumlah_smp || 0
  },
  { 
    key: "sma", 
    label: "Jumlah SMA", 
    type: "quantitative",
    icon: "🎯",
    dataKey: "jumlah_sma",
    accessor: (row) => row.jumlah_sma || 0
  }
];

export default PENDIDIKAN_INDICATORS;
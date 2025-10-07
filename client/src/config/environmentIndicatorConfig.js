/**
 * Environment Indicator Configuration
 * Matches the structure expected by EnvironmentIndicatorShell and adapter
 */
export default {
  sistem_peringatan_dini: {
    icon: '🚨',
    title: 'Sistem Peringatan Dini',
    valueKey: 'status_peringatan_dini',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  alat_keselamatan: {
    icon: '🦺',
    title: 'Alat Keselamatan',
    valueKey: 'status_alat_keselamatan',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  rambu_keselamatan: {
    icon: '�',
    title: 'Rambu Keselamatan',
    valueKey: 'status_rambu_evakuasi',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  tempat_pembuangan_sampah: {
    icon: '🗑️',
    title: 'Tempat Penampungan Sampah (TPS)',
    valueKey: 'status_tps',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  tempat_pengelolaan_sampah_3r: {
    icon: '♻️',
    title: 'Tempat Penampungan Sampah 3R (TPS3R)',
    valueKey: 'status_tps3r',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  pemilahan_sampah: {
    icon: '🔄',
    title: 'Pemilahan Sampah',
    valueKey: 'status_dilakukan_pemilahan_sampah',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  kebiasaan_pemilahan_sampah: {
    icon: '👨‍👩‍👧‍�',
    title: 'Kebiasaan Pemilahan Sampah',
    valueKey: 'kebiasaan_pemilahan_sampah',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  partisipasi_warga_pengolahan_sampah: {
    icon: '🤝',
    title: 'Partisipasi Warga Pengolahan Sampah',
    valueKey: 'warga_terlibat_olah_sampah',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  kebiasaan_bakar_lahan: {
    icon: '🔥',
    title: 'Kebiasaan Bakar Lahan',
    valueKey: 'kebiasaan_bakar_lahan',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  },
  pencemaran_air_pabrik: {
    icon: '🏭',
    title: 'Pencemaran Air dari Pabrik',
    valueKey: 'sumber_pencemaran_air_dari_pabrik',
    groupKey: 'nama_kecamatan',
    chartsPlan: ['donut', 'bar', 'stackedBar']
  }
};
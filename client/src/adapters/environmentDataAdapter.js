import { getEnvColor } from '../theme/environmentPalette';

/**
 * Data adapter for Environment category
 * Transforms raw village rows into engine-compatible format
 * Reuses logic from infrastructure but with environment-specific mapping
 */

export function buildStats(rows, cfg) {
  const safeRows = Array.isArray(rows) ? rows : [];
  
  if (safeRows.length === 0 || !cfg || !cfg.valueKey) {
    return {
      dominantLabel: '-',
      percentDominant: 0,
      totalKategori: 0,
      totalDesa: 0,
      desaDenganData: 0
    };
  }

  // Count occurrences of each category
  const counts = {};
  let totalWithData = 0;

  safeRows.forEach(row => {
    const value = row[cfg.valueKey];
    if (value && value !== '' && value !== null && value !== undefined) {
      counts[value] = (counts[value] || 0) + 1;
      totalWithData++;
    }
  });

  // Find dominant category
  let dominantLabel = '-';
  let dominantCount = 0;
  let percentDominant = 0;

  if (Object.keys(counts).length > 0) {
    const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    dominantLabel = sortedEntries[0][0];
    dominantCount = sortedEntries[0][1];
    percentDominant = totalWithData > 0 ? (dominantCount / totalWithData) * 100 : 0;
  }

  return {
    dominantLabel,
    percentDominant,
    totalKategori: Object.keys(counts).length,
    totalDesa: safeRows.length,
    desaDenganData: totalWithData
  };
}

export function buildCharts(rows, cfg) {
  const safeRows = Array.isArray(rows) ? rows : [];
  
  if (safeRows.length === 0 || !cfg || !cfg.chartsPlan || !Array.isArray(cfg.chartsPlan)) {
    return [];
  }

  const charts = [];

  // Count occurrences for donut and bar charts
  const counts = {};
  safeRows.forEach(row => {
    const value = row[cfg.valueKey];
    if (value && value !== '' && value !== null && value !== undefined) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  // Donut chart data
  if (cfg.chartsPlan.includes('donut')) {
    const donutData = sortedEntries.map(([label, count], index) => ({
      name: label,
      value: count,
      itemStyle: { color: getEnvColor(index) }
    }));

    charts.push({
      type: 'donut',
      title: `Distribusi ${cfg.title}`,
      data: donutData,
      colors: sortedEntries.map((_, index) => getEnvColor(index))
    });
  }

  // Bar chart data
  if (cfg.chartsPlan.includes('bar')) {
    const labels = sortedEntries.map(([label]) => label);
    const values = sortedEntries.map(([, count], index) => ({
      value: count,
      itemStyle: { color: getEnvColor(index) }
    }));

    charts.push({
      type: 'bar',
      title: `Ranking ${cfg.title}`,
      data: {
        labels: labels,
        values: values
      },
      colors: sortedEntries.map((_, index) => getEnvColor(index))
    });
  }

  // Stacked bar chart - distribution per kecamatan
  if (cfg.chartsPlan.includes('stackedBar')) {
    const kecamatanGroups = {};
    
    safeRows.forEach(row => {
      const kecamatan = row[cfg.groupKey] || 'Tidak Diketahui';
      const value = row[cfg.valueKey];
      
      if (!kecamatanGroups[kecamatan]) {
        kecamatanGroups[kecamatan] = {};
      }
      
      if (value && value !== '' && value !== null && value !== undefined) {
        kecamatanGroups[kecamatan][value] = (kecamatanGroups[kecamatan][value] || 0) + 1;
      }
    });

    const kecamatanNames = Object.keys(kecamatanGroups).sort();
    const categories = [...new Set(Object.values(kecamatanGroups).flatMap(Object.keys))].sort();
    
    const series = categories.map((category, index) => ({
      name: category,
      data: kecamatanNames.map(kec => kecamatanGroups[kec][category] || 0),
      itemStyle: { color: getEnvColor(index) }
    }));

    charts.push({
      type: 'stackedBar',
      title: `Distribusi per Kecamatan`,
      data: {
        categories: kecamatanNames,
        series: series
      },
      colors: categories.map((_, index) => getEnvColor(index))
    });
  }

  return charts;
}

export function buildDetailTable(rows, cfg) {
  const safeRows = Array.isArray(rows) ? rows : [];
  
  if (!cfg || !cfg.valueKey || !cfg.title) {
    return {
      headers: [],
      rows: []
    };
  }
  
  const headers = [
    { key: 'nama_desa', label: 'Nama Desa' },
    { key: 'nama_kecamatan', label: 'Kecamatan' },
    { key: cfg.valueKey, label: cfg.title }
  ];

  const tableRows = safeRows.map(row => ({
    nama_desa: row.nama_desa || '-',
    nama_kecamatan: row.nama_kecamatan || '-',
    [cfg.valueKey]: row[cfg.valueKey] || '-'
  })).sort((a, b) => {
    // Sort by kecamatan first, then by desa
    const kecComp = (a.nama_kecamatan || '').localeCompare(b.nama_kecamatan || '');
    if (kecComp !== 0) return kecComp;
    return (a.nama_desa || '').localeCompare(b.nama_desa || '');
  });

  return {
    headers,
    rows: tableRows
  };
}
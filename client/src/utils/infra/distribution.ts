/**
 * Data transformation utilities for Infrastructure & Konektivitas charts
 * Handles both qualitative categories and numeric binning for consistent chart data
 */

type VillageRow = { 
  nama_kecamatan: string; 
  nama_desa: string; 
  [key: string]: any 
};

/**
 * Bin a numeric value into predefined ranges
 * @param value - The numeric value to bin
 * @param bins - Array of bin boundaries [0,1,2,3,4,5]
 * @returns String representation of the bin (e.g., "0", "1", "5+")
 */
export function binNumeric(value: number, bins: number[] = [0, 1, 2, 3, 4, 5]): string {
  if (value == null || isNaN(value)) return "0";
  
  // Check if value matches any bin exactly
  for (let i = 0; i < bins.length; i++) {
    if (value === bins[i]) return String(bins[i]);
  }
  
  // If value is greater than the last bin, return "5+" format
  const lastBin = bins[bins.length - 1];
  if (value >= lastBin) {
    return `${lastBin}+`;
  }
  
  // Find the appropriate bin range
  for (let i = 0; i < bins.length - 1; i++) {
    if (value < bins[i + 1]) {
      return String(bins[i]);
    }
  }
  
  return String(bins[0]);
}

/**
 * Create histogram data for numeric values
 * @param rows - Array of village data
 * @param key - Field key to analyze (e.g., 'jumlah_bts')
 * @param bins - Bin boundaries
 * @returns Array of {bucket, count} for histogram
 */
export function histogramCounts(
  rows: VillageRow[], 
  key: string, 
  bins: number[] = [0, 1, 2, 3, 4, 5]
) {
  const counts: Record<string, number> = {};
  
  rows.forEach(row => {
    const value = Number(row[key] ?? 0);
    const bucket = binNumeric(value, bins);
    counts[bucket] = (counts[bucket] ?? 0) + 1;
  });
  
  // Create ordered result with all possible buckets
  const bucketOrder = [...bins.map(String), `${bins[bins.length - 1]}+`];
  
  return bucketOrder.map(bucket => ({
    bucket,
    count: counts[bucket] ?? 0
  }));
}

/**
 * Count occurrences of qualitative categories
 * @param rows - Array of village data
 * @param key - Field key to analyze
 * @param categories - Expected categories (optional, will use all found if empty)
 * @returns Array of {category, count}
 */
export function qualitativeCategoryCounts(
  rows: VillageRow[], 
  key: string, 
  categories: string[] = []
) {
  const counts: Record<string, number> = {};
  
  rows.forEach(row => {
    const category = (row[key] ?? "").toString();
    if (category) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
  });
  
  // Use provided categories or discover from data
  const categoryOrder = categories.length > 0 
    ? categories 
    : Object.keys(counts).sort();
  
  return categoryOrder.map(category => ({
    category,
    count: counts[category] ?? 0
  }));
}

/**
 * Group qualitative data by kecamatan for stacked/grouped charts
 * @param rows - Array of village data
 * @param key - Field key to analyze
 * @param categories - Expected categories
 * @returns Array of {kecamatan, series: [{name, value}]}
 */
export function perKecamatanByCategory(
  rows: VillageRow[],
  key: string,
  categories: string[] = []
) {
  const kecamatanSet = new Set(rows.map(row => row.nama_kecamatan));
  
  return Array.from(kecamatanSet).map(kecamatan => {
    const subset = rows.filter(row => row.nama_kecamatan === kecamatan);
    const counts: Record<string, number> = {};
    
    subset.forEach(row => {
      const category = (row[key] ?? "").toString();
      if (category) {
        counts[category] = (counts[category] ?? 0) + 1;
      }
    });
    
    // Use provided categories or discover from this kecamatan's data
    const categoryOrder = categories.length > 0 
      ? categories 
      : Object.keys(counts).sort();
    
    const series = categoryOrder.map(name => ({
      name,
      value: counts[name] ?? 0
    }));
    
    return { kecamatan, series };
  });
}

/**
 * Group numeric data by kecamatan using bins for stacked/grouped charts
 * @param rows - Array of village data
 * @param key - Field key to analyze
 * @param bins - Bin boundaries
 * @returns {categories: string[], rows: Array<{kecamatan, series}>}
 */
export function perKecamatanByBins(
  rows: VillageRow[],
  key: string,
  bins: number[] = [0, 1, 2, 3, 4, 5]
) {
  const kecamatanSet = new Set(rows.map(row => row.nama_kecamatan));
  const binNames = [...bins.map(String), `${bins[bins.length - 1]}+`];
  
  const result = Array.from(kecamatanSet).map(kecamatan => {
    const subset = rows.filter(row => row.nama_kecamatan === kecamatan);
    const counts: Record<string, number> = {};
    
    subset.forEach(row => {
      const value = Number(row[key] ?? 0);
      const bin = binNumeric(value, bins);
      counts[bin] = (counts[bin] ?? 0) + 1;
    });
    
    const series = binNames.map(name => ({
      name,
      value: counts[name] ?? 0
    }));
    
    return { kecamatan, series };
  });
  
  return { 
    categories: binNames, 
    rows: result 
  };
}

/**
 * Get the dominant category from qualitative data
 * @param rows - Array of village data
 * @param key - Field key to analyze
 * @returns {category: string, count: number, percentage: number}
 */
export function getDominantCategory(rows: VillageRow[], key: string) {
  const counts = qualitativeCategoryCounts(rows, key);
  
  if (counts.length === 0) {
    return { category: "", count: 0, percentage: 0 };
  }
  
  // Sort by count descending to get dominant category
  const sorted = counts.sort((a, b) => b.count - a.count);
  const dominant = sorted[0];
  const total = counts.reduce((sum, item) => sum + item.count, 0);
  
  return {
    category: dominant.category,
    count: dominant.count,
    percentage: total > 0 ? (dominant.count / total) * 100 : 0
  };
}

/**
 * Get the dominant bin from numeric data
 * @param rows - Array of village data
 * @param key - Field key to analyze
 * @param bins - Bin boundaries
 * @returns {bin: string, count: number, percentage: number}
 */
export function getDominantBin(rows: VillageRow[], key: string, bins: number[] = [0, 1, 2, 3, 4, 5]) {
  const counts = histogramCounts(rows, key, bins);
  
  if (counts.length === 0) {
    return { bin: "", count: 0, percentage: 0 };
  }
  
  // Sort by count descending to get dominant bin
  const sorted = counts.sort((a, b) => b.count - a.count);
  const dominant = sorted[0];
  const total = counts.reduce((sum, item) => sum + item.count, 0);
  
  return {
    bin: dominant.bucket,
    count: dominant.count,
    percentage: total > 0 ? (dominant.count / total) * 100 : 0
  };
}
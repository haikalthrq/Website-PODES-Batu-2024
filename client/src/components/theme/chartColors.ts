/**
 * Shared color palette for all infrastructure charts
 * Consistent theming with greens/teals for positive, amber for medium, magenta for accent
 */

export const CAT_COLORS = {
  strong: "#22c55e", // green-500
  medium: "#86efac", // green-200  
  weak: "#fbbf24",   // amber-400
  none: "#94a3b8",   // slate-400
};

// Qualitative data colors (ordered from strong to weak)
export const QUALITATIVE = [
  "#22c55e", // green-500 - primary
  "#10b981", // emerald-500
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#f59e0b", // amber-500
  "#ef4444"  // red-500
];

// Numeric bins colors (0 to 5+, light to dark green)
export const BINS = [
  "#86efac", // green-200 - 0
  "#4ade80", // green-400 - 1
  "#22c55e", // green-500 - 2
  "#16a34a", // green-600 - 3
  "#15803d", // green-700 - 4
  "#166534"  // green-800 - 5+
];

// Chart axis and grid colors
export const AXIS = {
  grid: "#e5e7eb",   // gray-200
  label: "#374151",  // gray-700
  tick: "#6b7280"    // gray-500
};

// Signal strength specific mapping
export const SIGNAL_COLORS = {
  "Sangat Kuat": "#15803d",   // green-700 - dark green for better contrast
  "Kuat": "#22c55e",          // green-500 - bright green 
  "Sedang": "#fbbf24",        // amber-400
  "Lemah": "#f97316",         // orange-500
  "Sangat Lemah": "#ef4444"   // red-500
};

// Internet type colors
export const INTERNET_COLORS = {
  "5G/4G/LTE": "#22c55e",     // green-500
  "3G": "#10b981",            // emerald-500
  "2G": "#fbbf24",            // amber-400
  "Tidak Ada": "#94a3b8"      // slate-400
};

// Ada/Tidak Ada colors
export const BINARY_COLORS = {
  "Ada": "#22c55e",                    // green-500
  "Ada, sebagian besar": "#15803d",    // green-700 - darker green for better contrast
  "Ada, sebagian kecil": "#fbbf24",    // amber-400 - yellow/orange for clear distinction
  "Tidak Ada": "#94a3b8",              // slate-400
  "Tidak": "#94a3b8"                   // slate-400
};

/**
 * Get color for a category based on predefined mappings
 */
export function getCategoryColor(category: string, index: number = 0): string {
  // Try specific mappings first
  if (SIGNAL_COLORS[category as keyof typeof SIGNAL_COLORS]) {
    return SIGNAL_COLORS[category as keyof typeof SIGNAL_COLORS];
  }
  
  if (INTERNET_COLORS[category as keyof typeof INTERNET_COLORS]) {
    return INTERNET_COLORS[category as keyof typeof INTERNET_COLORS];
  }
  
  if (BINARY_COLORS[category as keyof typeof BINARY_COLORS]) {
    return BINARY_COLORS[category as keyof typeof BINARY_COLORS];
  }
  
  // Fallback to qualitative colors
  return QUALITATIVE[index % QUALITATIVE.length];
}

/**
 * Get color for numeric bin
 */
export function getBinColor(binIndex: number): string {
  return BINS[Math.min(binIndex, BINS.length - 1)];
}
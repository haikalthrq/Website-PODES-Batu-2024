/**
 * Chart theme and color system
 * Provides consistent colors, defaults, and utilities for all chart types
 */

// Primary color palettes
export const CHART_COLORS = {
  // Qualitative palette for categories
  qualitative: [
    '#10b981', // Emerald 500
    '#3b82f6', // Blue 500  
    '#8b5cf6', // Violet 500
    '#f59e0b', // Amber 500
    '#ef4444', // Red 500
    '#06b6d4', // Cyan 500
    '#84cc16', // Lime 500
    '#f97316', // Orange 500
    '#ec4899', // Pink 500
    '#6366f1', // Indigo 500
  ],

  // Sequential palette for numeric data (blues)
  quantitative: [
    '#dbeafe', // Blue 100
    '#93c5fd', // Blue 300
    '#60a5fa', // Blue 400
    '#3b82f6', // Blue 500
    '#2563eb', // Blue 600
    '#1d4ed8', // Blue 700
    '#1e40af', // Blue 800
  ],

  // Diverging palette for comparisons
  diverging: [
    '#dc2626', // Red 600
    '#ea580c', // Orange 600
    '#ca8a04', // Yellow 600
    '#65a30d', // Lime 600
    '#16a34a', // Green 600
    '#059669', // Emerald 600
  ],

  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    info: '#3b82f6',
    neutral: '#6b7280',
  }
};

// Color schemes for specific use cases
export const COLOR_SCHEMES = {
  infrastructure: [
    '#10b981', // Green - Good/Strong
    '#3b82f6', // Blue - Medium  
    '#f59e0b', // Amber - Warning
    '#ef4444', // Red - Poor/Weak
    '#6b7280', // Gray - No data
  ],
  
  signal_strength: [
    '#10b981', // Very Strong - Green
    '#22c55e', // Strong - Light Green
    '#3b82f6', // Medium - Blue
    '#f59e0b', // Weak - Amber
    '#ef4444', // Very Weak - Red
  ],
  
  availability: [
    '#10b981', // Available - Green
    '#ef4444', // Not Available - Red
    '#6b7280', // Unknown - Gray
  ],
  
  coverage: [
    '#10b981', // Full Coverage - Green
    '#f59e0b', // Partial Coverage - Amber
    '#ef4444', // No Coverage - Red
  ]
};

// Default chart configurations
export const CHART_DEFAULTS = {
  // Pie/Donut charts
  pie: {
    innerRadius: 65,
    outerRadius: 120,
    paddingAngle: 2,
    cornerRadius: 3,
    labelLine: false,
    animationBegin: 0,
    animationDuration: 800,
  },

  // Bar charts
  bar: {
    categoryGap: 24,
    barGap: 8,
    maxBarThickness: 36,
    radius: [4, 4, 0, 0], // Rounded top corners
    animationDuration: 800,
  },

  // Grid and margins
  grid: {
    top: 24,
    right: 16,
    bottom: 36,
    left: 48,
  },

  // Typography
  typography: {
    title: {
      fontSize: 14,
      fontWeight: 600,
      color: '#374151',
    },
    label: {
      fontSize: 12,
      color: '#6b7280',
    },
    value: {
      fontSize: 11,
      fontWeight: 500,
      color: '#111827',
    }
  },

  // Tooltip styles
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: 12,
  }
};

/**
 * Get colors for categorical data
 * @param {Array<string>} categories - Array of category names
 * @param {string} scheme - Color scheme to use
 * @returns {Object} Mapping of category to color
 */
export const getCategoryColors = (categories = [], scheme = 'qualitative') => {
  const colors = COLOR_SCHEMES[scheme] || CHART_COLORS[scheme] || CHART_COLORS.qualitative;
  const colorMap = {};
  
  categories.forEach((category, index) => {
    colorMap[category] = colors[index % colors.length];
  });
  
  return colorMap;
};

/**
 * Get color for a specific category/value
 * @param {string} category - Category name
 * @param {Array<string>} allCategories - All available categories
 * @param {string} scheme - Color scheme
 * @returns {string} Hex color
 */
export const getCategoryColor = (category, allCategories = [], scheme = 'qualitative') => {
  const colorMap = getCategoryColors(allCategories, scheme);
  return colorMap[category] || CHART_COLORS.semantic.neutral;
};

/**
 * Generate colors for infrastructure indicators
 * @param {string} indicatorType - Type of indicator
 * @param {Array} categories - Categories to color
 * @returns {Array} Array of colors
 */
export const getInfrastructureColors = (indicatorType, categories = []) => {
  switch (indicatorType) {
    case 'signal_strength':
    case 'kualitas_sinyal':
      return categories.map(cat => {
        if (cat.includes('Sangat Kuat')) return COLOR_SCHEMES.signal_strength[0];
        if (cat.includes('Kuat')) return COLOR_SCHEMES.signal_strength[1];
        if (cat.includes('Sedang')) return COLOR_SCHEMES.signal_strength[2];
        if (cat.includes('Lemah')) return COLOR_SCHEMES.signal_strength[3];
        if (cat.includes('Sangat Lemah')) return COLOR_SCHEMES.signal_strength[4];
        return CHART_COLORS.semantic.neutral;
      });

    case 'availability':
    case 'penerangan':
      return categories.map(cat => {
        if (cat.includes('Ada')) return COLOR_SCHEMES.availability[0];
        if (cat.includes('Tidak Ada')) return COLOR_SCHEMES.availability[1];
        return CHART_COLORS.semantic.neutral;
      });

    case 'coverage':
      return categories.map(cat => {
        if (cat.includes('sebagian besar')) return COLOR_SCHEMES.coverage[0];
        if (cat.includes('sebagian kecil')) return COLOR_SCHEMES.coverage[1];
        if (cat.includes('Tidak Ada')) return COLOR_SCHEMES.coverage[2];
        return CHART_COLORS.semantic.neutral;
      });

    case 'internet_type':
      return [
        '#10b981', // 5G/4G/LTE - Green (best)
        '#3b82f6', // 3G - Blue (good)
        '#f59e0b', // Broadband - Amber (medium)
        '#ef4444', // Satelit - Red (slow)
      ];

    default:
      return getCategoryColors(categories, 'qualitative');
  }
};

/**
 * Format chart labels with proper units
 * @param {number} value - Numeric value
 * @param {string} unit - Unit type ('desa', 'bts', 'percent', etc.)
 * @param {boolean} showUnit - Whether to show unit
 * @returns {string} Formatted label
 */
export const formatChartLabel = (value, unit = '', showUnit = true) => {
  if (typeof value !== 'number') return value;

  const formatted = value.toLocaleString();
  
  if (!showUnit || !unit) return formatted;

  switch (unit) {
    case 'percent':
      return `${formatted}%`;
    case 'desa':
      return `${formatted} desa`;
    case 'bts':
      return `${formatted} BTS`;
    default:
      return `${formatted} ${unit}`;
  }
};

/**
 * Generate responsive font sizes based on container width
 * @param {number} containerWidth - Width of chart container
 * @returns {Object} Font size configuration
 */
export const getResponsiveFontSizes = (containerWidth = 400) => {
  const scale = Math.max(0.7, Math.min(1.2, containerWidth / 400));
  
  return {
    title: Math.round(14 * scale),
    label: Math.round(12 * scale),
    value: Math.round(11 * scale),
    legend: Math.round(11 * scale),
    axis: Math.round(10 * scale),
  };
};

/**
 * Default chart props for consistent behavior
 */
export const DEFAULT_CHART_PROPS = {
  // Common props for all charts
  common: {
    margin: CHART_DEFAULTS.grid,
    animationDuration: 800,
    colors: CHART_COLORS.qualitative,
  },

  // Pie chart specific
  pie: {
    ...CHART_DEFAULTS.pie,
    colors: CHART_COLORS.qualitative,
  },

  // Bar chart specific  
  bar: {
    ...CHART_DEFAULTS.bar,
    colors: CHART_COLORS.qualitative,
  },
};
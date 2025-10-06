/**
 * Data transformation utilities for indicator visualizations
 * Handles both categorical and numeric data transformations
 */

/**
 * Transform categorical data for pie/donut charts
 * @param {Array} data - Raw village data
 * @param {string} dataKey - Key to extract from data
 * @param {Object} options - Transform options
 * @returns {Array} Chart-ready data
 */
export const transformForPieChart = (data, dataKey, options = {}) => {
  const { 
    filterEmpty = true, 
    sortByValue = true, 
    maxCategories = null,
    categoryMapping = {} 
  } = options;

  if (!data || !Array.isArray(data) || !dataKey) {
    return [];
  }

  // Count occurrences of each category
  const categoryCount = {};
  data.forEach(item => {
    const value = item[dataKey];
    if (filterEmpty && (value === null || value === undefined || value === '')) {
      return;
    }
    
    // Apply category mapping if provided
    const mappedValue = categoryMapping[value] || value;
    categoryCount[mappedValue] = (categoryCount[mappedValue] || 0) + 1;
  });

  // Convert to chart format
  let chartData = Object.entries(categoryCount).map(([name, value]) => ({
    name: String(name),
    value,
    percentage: 0 // Will be calculated after sorting
  }));

  // Sort by value if requested
  if (sortByValue) {
    chartData.sort((a, b) => b.value - a.value);
  }

  // Limit categories if specified
  if (maxCategories && chartData.length > maxCategories) {
    const topCategories = chartData.slice(0, maxCategories - 1);
    const othersCount = chartData.slice(maxCategories - 1).reduce((sum, item) => sum + item.value, 0);
    
    if (othersCount > 0) {
      topCategories.push({
        name: 'Lainnya',
        value: othersCount,
        percentage: 0
      });
    }
    chartData = topCategories;
  }

  // Calculate percentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  chartData.forEach(item => {
    item.percentage = total > 0 ? (item.value / total) * 100 : 0;
  });

  return chartData;
};

/**
 * Transform data for horizontal/vertical bar charts
 * @param {Array} data - Raw village data
 * @param {string} dataKey - Key to extract from data
 * @param {Object} options - Transform options
 * @returns {Array} Chart-ready data
 */
export const transformForBarChart = (data, dataKey, options = {}) => {
  const {
    orientation = 'vertical',
    sortBy = 'value', // 'value' | 'name' | 'none'
    sortOrder = 'desc', // 'asc' | 'desc'
    maxBars = null,
    categoryMapping = {}
  } = options;

  const pieData = transformForPieChart(data, dataKey, { 
    categoryMapping,
    filterEmpty: true,
    sortByValue: false 
  });

  let barData = pieData.map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage
  }));

  // Apply sorting
  if (sortBy === 'value') {
    barData.sort((a, b) => sortOrder === 'asc' ? a.value - b.value : b.value - a.value);
  } else if (sortBy === 'name') {
    barData.sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }

  // Limit bars if specified
  if (maxBars && barData.length > maxBars) {
    barData = barData.slice(0, maxBars);
  }

  return barData;
};

/**
 * Transform data for distribution charts (grouped by kecamatan)
 * @param {Array} data - Raw village data
 * @param {string} dataKey - Key for the indicator value
 * @param {string} groupKey - Key for grouping (usually 'kecamatan')
 * @param {Object} options - Transform options
 * @returns {Array} Chart-ready data
 */
export const transformForDistributionChart = (data, dataKey, groupKey = 'kecamatan', options = {}) => {
  const { 
    categoryMapping = {},
    includePercentages = false,
    stackedCategories = null // Array of categories to stack
  } = options;

  if (!data || !Array.isArray(data) || !dataKey || !groupKey) {
    return [];
  }

  // Group data by kecamatan and category
  const grouped = {};
  data.forEach(item => {
    const group = item[groupKey];
    const category = categoryMapping[item[dataKey]] || item[dataKey];
    
    if (!group || category === null || category === undefined || category === '') {
      return;
    }

    if (!grouped[group]) {
      grouped[group] = {};
    }
    
    grouped[group][category] = (grouped[group][category] || 0) + 1;
  });

  // Convert to chart format
  let chartData = Object.entries(grouped).map(([groupName, categories]) => {
    const item = { name: groupName };
    
    // Add each category as a property
    Object.entries(categories).forEach(([category, count]) => {
      item[category] = count;
    });

    // Calculate total for this group
    item.total = Object.values(categories).reduce((sum, count) => sum + count, 0);

    return item;
  });

  // Sort by group name
  chartData.sort((a, b) => a.name.localeCompare(b.name));

  // If stacked categories specified, ensure all groups have all categories
  if (stackedCategories && Array.isArray(stackedCategories)) {
    chartData = chartData.map(item => {
      stackedCategories.forEach(category => {
        if (!(category in item)) {
          item[category] = 0;
        }
      });
      return item;
    });
  }

  return chartData;
};

/**
 * Transform numeric data for histograms and numeric analysis
 * @param {Array} data - Raw village data
 * @param {string} dataKey - Key to extract numeric values
 * @param {Object} options - Transform options
 * @returns {Object} Analysis results with histogram data and stats
 */
export const transformForNumericChart = (data, dataKey, options = {}) => {
  const { 
    bins = 10,
    groupBy = null, // Group by kecamatan or other field
    includeZeros = true
  } = options;

  if (!data || !Array.isArray(data) || !dataKey) {
    return { histogramData: [], stats: {} };
  }

  // Extract numeric values
  const values = data
    .map(item => {
      const value = Number(item[dataKey]);
      return isNaN(value) ? null : value;
    })
    .filter(value => value !== null && (includeZeros || value !== 0));

  if (values.length === 0) {
    return { histogramData: [], stats: {} };
  }

  // Calculate statistics
  const sortedValues = [...values].sort((a, b) => a - b);
  const stats = {
    total: values.length,
    sum: values.reduce((sum, val) => sum + val, 0),
    min: sortedValues[0],
    max: sortedValues[sortedValues.length - 1],
    average: values.reduce((sum, val) => sum + val, 0) / values.length,
    median: sortedValues.length % 2 === 0 
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)]
  };

  // Create histogram data
  let histogramData = [];
  
  if (groupBy) {
    // Group by specified field (e.g., kecamatan)
    const grouped = {};
    data.forEach(item => {
      const group = item[groupBy];
      const value = Number(item[dataKey]);
      
      if (group && !isNaN(value) && (includeZeros || value !== 0)) {
        if (!grouped[group]) {
          grouped[group] = [];
        }
        grouped[group].push(value);
      }
    });

    histogramData = Object.entries(grouped).map(([groupName, groupValues]) => ({
      name: groupName,
      value: groupValues.length,
      total: groupValues.reduce((sum, val) => sum + val, 0),
      average: groupValues.reduce((sum, val) => sum + val, 0) / groupValues.length,
      min: Math.min(...groupValues),
      max: Math.max(...groupValues)
    }));

    histogramData.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Create bins for histogram
    const binSize = (stats.max - stats.min) / bins;
    const binData = new Array(bins).fill(0);
    const binLabels = [];

    for (let i = 0; i < bins; i++) {
      const binStart = stats.min + i * binSize;
      const binEnd = i === bins - 1 ? stats.max : binStart + binSize;
      binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
    }

    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - stats.min) / binSize), bins - 1);
      binData[binIndex]++;
    });

    histogramData = binLabels.map((label, index) => ({
      name: label,
      value: binData[index]
    }));
  }

  return { histogramData, stats };
};

/**
 * Calculate key statistics for categorical data
 * @param {Array} data - Raw village data
 * @param {string} dataKey - Key to analyze
 * @param {Object} options - Calculation options
 * @returns {Object} Key statistics
 */
export const calculateCategoricalStats = (data, dataKey, options = {}) => {
  const { categoryMapping = {} } = options;

  if (!data || !Array.isArray(data) || !dataKey) {
    return {};
  }

  const pieData = transformForPieChart(data, dataKey, { categoryMapping });
  
  if (pieData.length === 0) {
    return {};
  }

  const dominantCategory = pieData[0];
  const totalCategories = pieData.length;
  const totalDesa = data.length;
  const totalWithData = pieData.reduce((sum, item) => sum + item.value, 0);

  return {
    dominantCategory: {
      label: 'Kategori Dominan',
      value: dominantCategory.name
    },
    percentage: {
      label: 'Persentase Dominan',
      value: dominantCategory.percentage
    },
    totalCategories: {
      label: 'Total Kategori',
      value: totalCategories
    },
    totalDesa: {
      label: 'Total Desa',
      value: totalDesa
    },
    totalData: {
      label: 'Desa dengan Data',
      value: totalWithData
    }
  };
};

/**
 * Calculate key statistics for numeric data
 * @param {Array} data - Raw village data
 * @param {string} dataKey - Key to analyze
 * @param {Object} options - Calculation options
 * @returns {Object} Key statistics
 */
export const calculateNumericStats = (data, dataKey, options = {}) => {
  const { includeZeros = true } = options;

  const { stats } = transformForNumericChart(data, dataKey, { includeZeros });

  if (!stats || Object.keys(stats).length === 0) {
    return {};
  }

  return {
    totalDesa: {
      label: 'Total Desa',
      value: data.length
    },
    totalData: {
      label: 'Desa dengan Data',
      value: stats.total
    },
    average: {
      label: 'Rata-rata',
      value: stats.average
    },
    minimum: {
      label: 'Minimum',
      value: stats.min
    },
    maximum: {
      label: 'Maximum',
      value: stats.max
    },
    median: {
      label: 'Median',
      value: stats.median
    }
  };
};





/**
 * Utility to determine if data is categorical or numeric  
 * @param {Array} data - Raw village data
 * @param {string} dataKey - Key to analyze
 * @returns {string} 'categorical' | 'numeric' | 'mixed' | 'unknown'
 */
export const detectDataType = (data, dataKey) => {
  if (!data || !Array.isArray(data) || !dataKey || data.length === 0) {
    return 'unknown';
  }

  const values = data
    .map(item => item[dataKey])
    .filter(value => value !== null && value !== undefined && value !== '');

  if (values.length === 0) {
    return 'unknown';
  }

  const numericCount = values.filter(value => !isNaN(Number(value))).length;
  const numericRatio = numericCount / values.length;

  if (numericRatio > 0.8) {
    return 'numeric';
  } else if (numericRatio < 0.2) {
    return 'categorical';
  } else {
    return 'mixed';
  }
};
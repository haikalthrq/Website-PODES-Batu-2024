// Centralized selector for getting indicators by category
// No circular dependencies - only imports from config
import { getCategoryConfig } from "../categories.config";
import { INFRA_INDICATORS } from "../infra/indicatorRegistry";

/**
 * Get indicators for a given category with proper labels
 * @param {string} categoryKey - The category key (e.g., 'Pendidikan', 'Kesehatan')
 * @returns {object} Object mapping indicator keys to labels
 */
export function getIndicatorsForCategory(categoryKey) {
  if (!categoryKey) return {};

  // Special handling for Infrastructure category using new registry
  if (categoryKey === 'Infrastruktur & Konektivitas') {
    const result = {};
    Object.values(INFRA_INDICATORS).forEach(indicator => {
      result[indicator.id] = indicator.title;
    });
    return result;
  }

  // Try to get from category config first
  const categoryConfig = getCategoryConfig(categoryKey);
  if (categoryConfig && categoryConfig.indicators) {
    const result = {};
    categoryConfig.indicators.forEach(indicator => {
      result[indicator.key] = indicator.label;
    });
    return result;
  }

  // Fallback to static mapping for backward compatibility (Pendidikan, Kesehatan only)
  const staticMapping = {
    'Pendidikan': ['jumlah_tk', 'jumlah_sd', 'jumlah_smp', 'jumlah_sma'],
    'Kesehatan': ['jumlah_puskesmas', 'jumlah_rs']
  };

  // Label mapping for fallback
  const labels = {
    'jumlah_tk': 'Jumlah TK',
    'jumlah_sd': 'Jumlah SD', 
    'jumlah_smp': 'Jumlah SMP',
    'jumlah_sma': 'Jumlah SMA',
    'jumlah_puskesmas': 'Jumlah Puskesmas',
    'jumlah_rs': 'Jumlah Rumah Sakit'
  };

  // Get indicators from static mapping
  const indicatorArray = staticMapping[categoryKey] || [];
  
  // Convert to object mapping with labels
  const result = {};
  indicatorArray.forEach(key => {
    result[key] = labels[key] || key;
  });

  return result;
}

/**
 * Get category indicators as array (for compatibility)
 * @param {string} categoryKey - The category key
 * @returns {string[]} Array of indicator keys
 */
export function getCategoryIndicatorKeys(categoryKey) {
  const indicators = getIndicatorsForCategory(categoryKey);
  return Object.keys(indicators);
}

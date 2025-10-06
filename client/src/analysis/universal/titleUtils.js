// Title formatting utilities for consistent capitalization across the app

/**
 * Converts string to Title Case with special handling for educational abbreviations
 * @param {string} str - String to convert
 * @returns {string} - Title cased string
 */
export function toTitleCase(str) {
  if (!str) return str;
  
  // Special mappings for educational and health abbreviations
  const specialMappings = {
    'tk': 'TK',
    'sd': 'SD', 
    'smp': 'SMP',
    'sma': 'SMA',
    'rs': 'RS',
    'bts': 'BTS'
  };
  
  return str.toLowerCase()
    .split(' ')
    .map(word => {
      // Check if word is a special abbreviation
      if (specialMappings[word.toLowerCase()]) {
        return specialMappings[word.toLowerCase()];
      }
      // Regular title case
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Formats indicator and category for page titles
 * @param {string} indicatorLabel - Indicator label (e.g., "jumlah tk")
 * @param {string} categoryLabel - Category label (e.g., "pendidikan")
 * @returns {string} - Formatted title (e.g., "Jumlah TK - Pendidikan")
 */
export function formatAnalysisTitle(indicatorLabel, categoryLabel) {
  const formattedIndicator = indicatorLabel ? toTitleCase(indicatorLabel.replace(/_/g, ' ')) : '';
  const formattedCategory = categoryLabel ? toTitleCase(categoryLabel) : '';
  
  if (formattedIndicator && formattedCategory) {
    return `${formattedIndicator} - ${formattedCategory}`;
  } else if (formattedCategory) {
    return `Analisis ${formattedCategory}`;
  }
  
  return "Dashboard PODES 2024";
}
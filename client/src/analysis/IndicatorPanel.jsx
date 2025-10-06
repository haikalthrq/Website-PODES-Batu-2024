// Updated IndicatorPanel that uses UniversalIndicatorPanel for 100% consistency
import React from 'react';
import UniversalIndicatorPanel from './universal/UniversalIndicatorPanel';
import CATEGORIES_CONFIG from '../config/categories.config';

const IndicatorPanel = ({ 
  data, 
  indicator,
  isExpanded = false 
}) => {
  if (!isExpanded || !data || data.length === 0) {
    return null; // Don't render content for collapsed panels or empty data
  }

  // Determine category key from the indicator configuration
  // This ensures we use the same universal component everywhere
  let categoryKey = '';
  Object.keys(CATEGORIES_CONFIG).forEach(key => {
    const config = CATEGORIES_CONFIG[key];
    if (config && config.indicators.some(ind => ind.key === indicator.key)) {
      categoryKey = key;
    }
  });

  return (
    <UniversalIndicatorPanel
      categoryKey={categoryKey}
      indicatorKey={indicator.key}
      dataset={data}
      isOpen={isExpanded}
      loading={false}
    />
  );
};

export default IndicatorPanel;
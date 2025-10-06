import React from 'react';
import EnhancedEnvironmentIndicators from './EnhancedEnvironmentIndicators';
import { LINGKUNGAN_KEBENCANAAN_INDICATORS } from '../config/indicators/lingkungan_kebencanaan';

/**
 * Environment Indicator Content Component
 * Maps indicator keys to the enhanced visualization component
 * Follows the same pattern as InfrastructureIndicatorContent
 */
const EnvironmentIndicatorContent = ({ 
  indicatorKey, 
  data, 
  config = {}, 
  isOpen = false 
}) => {
  // Debug logging
  console.log('EnvironmentIndicatorContent:', {
    indicatorKey,
    config,
    data,
    dataLength: data?.length || 0
  });

  // Find the indicator configuration
  const indicatorConfig = LINGKUNGAN_KEBENCANAAN_INDICATORS.find(
    indicator => indicator.key === indicatorKey || indicator.dataKey === indicatorKey
  );

  if (!indicatorConfig) {
    console.warn(`No configuration found for indicator: ${indicatorKey}`);
    return null;
  }

  // Get the actual data key to use
  const actualDataKey = indicatorConfig.dataKey;
  const displayName = indicatorConfig.label;

  // Use the data directly (it should already be the village array)
  const rawVillageData = data || [];

  return (
    <EnhancedEnvironmentIndicators
      indicatorKey={actualDataKey}
      displayName={displayName}
      rawVillageData={rawVillageData}
      isOpen={isOpen}
    />
  );
};

export default EnvironmentIndicatorContent;
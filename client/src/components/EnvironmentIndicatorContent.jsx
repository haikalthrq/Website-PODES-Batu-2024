import React from 'react';
import EnvironmentIndicatorShell from './environment/EnvironmentIndicatorShell';
import ENV_CONFIG from '../config/environmentIndicatorConfig';

/**
 * Environment Indicator Content Component
 * Maps indicator keys to the EnvironmentIndicatorShell with ApexCharts
 * Updated to use the new unified approach
 */
const EnvironmentIndicatorContent = ({ 
  indicatorKey, 
  villageData,  // Changed from 'data' to 'villageData' for consistency
  config = {}, 
  isOpen = false 
}) => {
  // Get config from environmentIndicatorConfig
  const indicatorConfig = ENV_CONFIG[indicatorKey] || config;

  if (!indicatorConfig) {
    console.warn(`No configuration found for indicator: ${indicatorKey}`);
    return null;
  }

  // Use the data directly (it should already be the village array)
  const rawVillageData = villageData || [];

  return (
    <EnvironmentIndicatorShell
      indicatorKey={indicatorKey}
      villageData={rawVillageData}
      config={indicatorConfig}
      isOpen={isOpen}
    />
  );
};

export default EnvironmentIndicatorContent;
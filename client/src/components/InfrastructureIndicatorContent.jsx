import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import EnhancedInfrastructureIndicators from './EnhancedInfrastructureIndicators';
import { INFRA_INDICATORS, getIndicatorConfig } from '../config/infra/indicatorRegistry';
import { INDICATOR_ALL } from '../constants';
import { EmptyState } from './common';

/**
 * Infrastructure Indicator Content Component
 * Handles both "Semua" (all indicators) and single indicator selection
 * Note: Accordion wrapper is handled by parent component (SummaryAccordionSection)
 */
const InfrastructureIndicatorContent = ({ 
  indicatorKey,      // specific indicator key when called from accordion
  filters,           // { category, indicator, kecamatan, desa } when called from single mode
  villageData,       // data mentah (setelah filter kecamatan/desa)
  visualizationData  // agregat per indikator (opsional)
}) => {
  // Determine which indicator to show
  // If indicatorKey is provided, use it (accordion mode)
  // If filters.indicator is provided and not "Semua", use it (single mode)
  const selectedIndicator = indicatorKey || (filters?.indicator !== INDICATOR_ALL ? filters?.indicator : null);

  // Memoize visualization data for performance
  const vizByIndicator = useMemo(() => {
    if (visualizationData) return visualizationData;
    
    const out = {};
    for (const key of Object.keys(INFRA_INDICATORS)) {
      // Basic data preparation - can be enhanced later
      out[key] = {
        data: villageData,
        processed: true
      };
    }
    return out;
  }, [villageData, visualizationData]);

  console.log('InfrastructureIndicatorContent:', {
    indicatorKey,
    selectedIndicator,
    filtersIndicator: filters?.indicator,
    availableIndicators: Object.keys(INFRA_INDICATORS),
    dataLength: villageData?.length,
    config: getIndicatorConfig(selectedIndicator),
    villageDataSample: villageData?.slice(0, 2)
  });

  // If no specific indicator, return empty
  if (!selectedIndicator) {
    return (
      <EmptyState 
        title="Tidak ada indikator yang dipilih" 
        icon="❓"
      />
    );
  }

  // Get config for the selected indicator
  const config = getIndicatorConfig(selectedIndicator);
  if (!config) {
    return (
      <EmptyState 
        title="Indikator tidak dikenali" 
        subtitle={selectedIndicator}
        icon="❓"
      />
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <EnhancedInfrastructureIndicators
        indicatorKey={config.id}
        config={config}
        villageData={villageData}
        visualizationData={vizByIndicator?.[config.id]}
        isAccordionOpen={true}  // Always true since content is already expanded
        accordionId={config.id}
      />
    </Box>
  );
};

export default InfrastructureIndicatorContent;
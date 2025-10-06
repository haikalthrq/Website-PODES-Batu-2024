import React from 'react';
import { Box } from '@mui/material';
import { IndicatorAccordion, IndicatorContent } from '../indicators';
import { 
  getIndicatorConfig, 
  generateIndicatorVisualization,
  isIndicatorAvailable 
} from '../../configs/indicators';
import { EmptyState } from './common';

/**
 * Infrastructure Indicators Visualization Component
 * Renders enhanced visualizations for "Infrastruktur & Konektivitas" category
 */
const InfrastructureIndicators = ({ data, filteredData }) => {
  const dataToUse = filteredData && filteredData.length > 0 ? filteredData : data;
  
  if (!dataToUse || dataToUse.length === 0) {
    return (
      <EmptyState 
        text="Tidak ada data tersedia untuk analisis indikator infrastruktur"
        icon="📊"
      />
    );
  }

  // Infrastructure indicators to render
  const indicatorKeys = [
    'kualitas_sinyal_internet',
    'jenis_akses_internet',
    'penerangan_jalan_tenaga_surya',
    'penerangan_jalan_utama'
  ];

  const renderIndicator = (indicatorKey) => {
    if (!isIndicatorAvailable(indicatorKey)) {
      return (
        <EmptyState 
          text={`Konfigurasi untuk indikator "${indicatorKey}" belum tersedia`}
          icon="⚙️"
        />
      );
    }

    const config = getIndicatorConfig(indicatorKey);
    const visualizationData = generateIndicatorVisualization(indicatorKey, dataToUse);

    return (
      <IndicatorAccordion
        key={indicatorKey}
        title={config.title}
        subtitle={config.subtitle}
        icon={config.icon}
        indicatorKey={indicatorKey}
        defaultExpanded={false}
      >
        <IndicatorContent
          indicatorData={visualizationData}
          config={visualizationData}
          villageData={dataToUse}
          loading={false}
          error={null}
        />
      </IndicatorAccordion>
    );
  };

  return (
    <Box>
      {indicatorKeys.map(indicatorKey => renderIndicator(indicatorKey))}
    </Box>
  );
};

export default InfrastructureIndicators;
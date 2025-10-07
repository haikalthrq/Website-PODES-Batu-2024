// Universal Summary Accordion Section - Data-driven accordion untuk semua kategori
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { getCategoryConfig, hasQuantitativeIndicators } from '../../config/categories.config';
import { Accordion, AccordionItem } from '../../components/accordion';
import { SectionHeader, EmptyState } from '../../components/common';
import IndicatorPanel from '../IndicatorPanel';
import InfrastructureIndicatorContent from '../../components/InfrastructureIndicatorContent';
import EnvironmentIndicatorContent from '../../components/EnvironmentIndicatorContent';

/**
 * Universal Summary Accordion Section
 * Renders indicator accordions for any category using data-driven configuration
 * 
 * @param {Object} props
 * @param {string} props.categoryKey - Category key from CATEGORIES_CONFIG (e.g., 'pendidikan', 'lingkungan_konektivitas')
 * @param {Array} props.data - Village data array
 * @param {Array} props.filteredData - Filtered village data (optional)
 * @param {boolean} props.allowToggleAll - Show "Buka/Tutup Semua" controls
 * @param {string} props.accordionType - 'single' or 'multiple' accordion mode
 * @param {Object} props.filters - Current filter state for single indicator handling
 */
const SummaryAccordionSection = ({ 
  categoryKey,
  data,
  filteredData,
  filters,
  allowToggleAll = false,
  accordionType = 'single'
}) => {
  const theme = useTheme();
  
  // Get category configuration
  const categoryConfig = getCategoryConfig(categoryKey);
  
  if (!categoryConfig) {
    return (
      <Box sx={{ mb: 4 }}>
        <SectionHeader />
        <EmptyState 
          text={`Konfigurasi kategori "${categoryKey}" tidak ditemukan.`}
          icon="❌"
        />
      </Box>
    );
  }

  // Use filtered data if available, otherwise use all data
  const dataToUse = filteredData && filteredData.length > 0 ? filteredData : data;

  if (!dataToUse || dataToUse.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <SectionHeader 
          subtitle={getSubtitleByType(categoryConfig.indicators)}
        />
        <EmptyState 
          text="Tidak ada data tersedia untuk analisis indikator"
          icon="📊"
        />
      </Box>
    );
  }

  // Determine subtitle based on indicator types
  const getSubtitleText = () => {
    const hasQuantitative = categoryConfig.indicators.some(ind => ind.type === 'quantitative');
    const hasQualitative = categoryConfig.indicators.some(ind => ind.type === 'qualitative');
    
    if (hasQuantitative && hasQualitative) {
      return "Indikator Kuantitatif & Kualitatif";
    } else if (hasQualitative) {
      return "Indikator Kualitatif";
    } else {
      return "Indikator Kuantitatif";
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Section Header */}
      <SectionHeader 
        title="Ringkasan Seluruh Indikator"
        subtitle={getSubtitleText()}
        icon="📊"
        subtitleIcon={getSubtitleText().includes('Kualitatif') ? '📝' : '📈'}
      />

      {/* Universal Accordion */}
      <Accordion
        type={accordionType}
        defaultOpenKeys={[]} // Start with all closed
        persistKey={`summary-${categoryKey}`}
        allowToggleAll={allowToggleAll}
      >
        {categoryConfig.indicators.map((indicator) => (
          <AccordionItem
            key={indicator.key}
            id={indicator.key}
            icon={indicator.icon}
            title={indicator.label}
            subtitle="Klik untuk membuka"
          >
            {/* Content is only rendered when accordion is open (lazy loading handled by AccordionItem) */}
            {categoryKey === 'pendidikan' || categoryKey === 'kesehatan' ? (
              <IndicatorPanel
                data={dataToUse}
                indicator={indicator}
                isExpanded={true} // Always true when rendered because content is lazy-loaded by AccordionItem
              />
            ) : categoryKey === 'Infrastruktur & Konektivitas' ? (
              /* For Infrastructure category, use enhanced visualizations */
              <InfrastructureIndicatorContent 
                indicatorKey={indicator.key}
                villageData={dataToUse}
              />
            ) : categoryKey === 'Lingkungan & Kebencanaan' ? (
              /* For Environment category, use enhanced visualizations */
              <EnvironmentIndicatorContent 
                indicatorKey={indicator.key}
                villageData={dataToUse}
              />
            ) : (
              /* For other new categories, show placeholder */
              <EmptyState 
                text={`Visualisasi untuk "${indicator.label}" akan menyusul.`}
                icon="🚧"
              />
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

// Helper function to determine subtitle by indicator types
function getSubtitleByType(indicators) {
  const hasQuantitative = indicators.some(ind => ind.type === 'quantitative');
  const hasQualitative = indicators.some(ind => ind.type === 'qualitative');
  
  if (hasQuantitative && hasQualitative) {
    return "Indikator Kuantitatif & Kualitatif";
  } else if (hasQualitative) {
    return "Indikator Kualitatif";
  } else {
    return "Indikator Kuantitatif";
  }
}

export default SummaryAccordionSection;
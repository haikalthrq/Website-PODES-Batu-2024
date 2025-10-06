// Generic, config-driven "Ringkasan Seluruh Indikator" used by all categories (follows DESAIN ACUAN)
// Now with enhanced UX/A11y accordion implementation
import React from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import { getCategoryConfig, hasQuantitativeIndicators } from '../config/categories.config';
import { Accordion, AccordionItem } from '../components/accordion';
import IndicatorPanel from './IndicatorPanel';

const IndicatorsSummary = ({ categoryKey, data, filteredData }) => {
  const theme = useTheme();
  
  // Get category configuration
  const categoryConfig = getCategoryConfig(categoryKey);
  
  if (!categoryConfig || !hasQuantitativeIndicators(categoryKey)) {
    return null; // Don't render if no quantitative indicators for this category
  }

  // Use filtered data if available, otherwise use all data
  const dataToUse = filteredData && filteredData.length > 0 ? filteredData : data;

  if (!dataToUse || dataToUse.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        backgroundColor: theme.palette.grey[50],
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="body1" color="text.secondary">
          Tidak ada data tersedia untuk analisis indikator
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Section Header */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: theme.palette.text.primary
        }}
      >
        📊 Ringkasan Seluruh Indikator
      </Typography>
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          mb: 3,
          color: theme.palette.text.secondary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        📝 Indikator Kuantitatif
      </Typography>

      {/* Enhanced Accordion Group with UX/A11y improvements */}
      <Accordion
        type="single"
        defaultOpenKeys={[]} // Start with all closed
        persistKey={`analysis-${categoryKey.toLowerCase()}`}
        allowToggleAll={false} // Keep clean for single type
      >
        {categoryConfig.indicators.map((indicator) => (
          <AccordionItem
            key={indicator.key}
            id={indicator.key}
            icon={indicator.icon}
            title={indicator.label}
            subtitle={null} // Will use default "Klik untuk membuka/menutup"
          >
            <IndicatorPanel
              data={dataToUse}
              indicator={indicator}
              isExpanded={true} // Always true when rendered (lazy loaded)
            />
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default IndicatorsSummary;
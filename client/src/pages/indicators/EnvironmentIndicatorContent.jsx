import React, { useMemo } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import ENV_CONFIG from '../../config/environmentIndicatorConfig';
import EnvironmentIndicatorShell from '../../components/environment/EnvironmentIndicatorShell';
import { INDICATOR_ALL } from '../../constants';

/**
 * Universal, reusable visualization component for Environment category
 * Handles both "Semua" (all indicators) and single indicator modes
 * Reuses the exact same visualization stack (EnvironmentIndicatorShell) for consistency
 * 
 * Pattern mirrors Infrastructure & Konektivitas implementation
 */
export default function EnvironmentIndicatorContent({
  filters = {},
  villageData = []
}) {
  const selectedIndicator = filters?.indicator || INDICATOR_ALL;

  // Map selected filter to config key
  const indicatorConfigs = useMemo(() => {
    if (selectedIndicator === INDICATOR_ALL) {
      // Return all indicators for accordion mode
      return Object.entries(ENV_CONFIG).map(([key, config]) => ({
        key,
        config
      }));
    } else {
      // Return single indicator
      const config = ENV_CONFIG[selectedIndicator];
      if (!config) return [];
      
      return [{
        key: selectedIndicator,
        config
      }];
    }
  }, [selectedIndicator]);

  if (indicatorConfigs.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body1">
          Indikator "{selectedIndicator}" tidak ditemukan
        </Typography>
      </Box>
    );
  }

  if (!Array.isArray(villageData) || villageData.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body1">
          Tidak ada data desa tersedia untuk filter saat ini
        </Typography>
      </Box>
    );
  }

  // Mode: Single indicator (direct render without extra accordion wrapper)
  // Matches Infrastructure pattern - reuse the exact same visualization components
  if (selectedIndicator !== INDICATOR_ALL) {
    const { key, config } = indicatorConfigs[0];
    
    return (
      <Box sx={{ mb: 2 }}>
        {/* Reuse the exact same EnvironmentIndicatorShell that powers "Semua" accordions */}
        <EnvironmentIndicatorShell
          indicatorKey={key}
          villageData={villageData}
          config={config}
          isOpen={true}
        />
      </Box>
    );
  }

  // Mode: All indicators (accordion mode - matches "Semua" behavior)
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        🌍 Ringkasan Seluruh Indikator Lingkungan & Kebencanaan
      </Typography>
      
      {indicatorConfigs.map(({ key, config }) => (
        <Accordion 
          key={key} 
          sx={{ 
            mb: 2, 
            boxShadow: 1,
            // Performance optimization
            transform: 'translateZ(0)',
            willChange: 'auto'
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{ 
              '&:hover': { backgroundColor: 'action.hover' },
              minHeight: 64
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography 
                component="span" 
                sx={{ fontSize: '1.5rem', lineHeight: 1 }}
              >
                {config.icon}
              </Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                  {config.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Klik untuk melihat visualisasi lengkap
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3, bgcolor: 'background.default' }}>
            {/* Reuse exact same visualization component for consistency */}
            <EnvironmentIndicatorShell
              indicatorKey={key}
              villageData={villageData}
              config={config}
              isOpen={false}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

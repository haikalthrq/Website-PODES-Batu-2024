import React, { useMemo } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import ENV_CONFIG from '../../config/environmentIndicatorConfig';
import KEY_MAP from '../../config/indicatorKeyMap';
import EnvironmentIndicatorShell from '../../components/environment/EnvironmentIndicatorShell';
import { INDICATOR_ALL } from '../../constants';

/**
 * Lightweight page wrapper for Environment indicators
 * Replaces heavy EnvironmentIndicatorContent with thin glue logic
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
        config,
        dataKey: KEY_MAP[key] || key
      }));
    } else {
      // Return single indicator
      const config = ENV_CONFIG[selectedIndicator];
      if (!config) return [];
      
      return [{
        key: selectedIndicator,
        config,
        dataKey: KEY_MAP[selectedIndicator] || selectedIndicator
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

  // Mode: Single indicator (expanded by default)
  if (selectedIndicator !== INDICATOR_ALL) {
    const { key, config } = indicatorConfigs[0];
    
    return (
      <Box sx={{ mb: 4 }}>
        <Accordion defaultExpanded sx={{ boxShadow: 2 }}>
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: 'primary.50',
              '&:hover': { backgroundColor: 'primary.100' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {config.icon} {config.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Klik untuk menutup
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <EnvironmentIndicatorShell
              indicatorKey={key}
              villageData={villageData}
              config={config}
              isOpen={true}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }

  // Mode: All indicators (closed by default)
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        🌍 Ringkasan Seluruh Indikator Lingkungan & Kebencanaan
      </Typography>
      
      {indicatorConfigs.map(({ key, config }) => (
        <Accordion key={key} sx={{ mb: 2, boxShadow: 1 }}>
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{ 
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {config.icon} {config.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Klik untuk membuka
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
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

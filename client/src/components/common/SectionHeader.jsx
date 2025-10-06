// Section Header component untuk judul "Ringkasan Seluruh Indikator"
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const SectionHeader = ({ 
  title = "Ringkasan Seluruh Indikator",
  subtitle = "Indikator Kuantitatif",
  icon = "📊",
  subtitleIcon = "📝"
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Main Title */}
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
        {icon} {title}
      </Typography>
      
      {/* Subtitle */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          mb: 0,
          color: theme.palette.text.secondary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {subtitleIcon} {subtitle}
      </Typography>
    </Box>
  );
};

export default SectionHeader;
// EmptyState component untuk fallback sementara
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const EmptyState = ({ 
  text = "Visualisasi indikator akan menyusul.",
  icon = "🚧",
  variant = "body1"
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      p: 4, 
      textAlign: 'center',
      backgroundColor: theme.palette.grey[50],
      borderRadius: 2,
      border: `1px dashed ${theme.palette.divider}`,
      minHeight: 120,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1
    }}>
      <Typography variant="h4" sx={{ opacity: 0.6 }}>
        {icon}
      </Typography>
      <Typography variant={variant} color="text.secondary" sx={{ fontStyle: 'italic' }}>
        {text}
      </Typography>
    </Box>
  );
};

export default EmptyState;
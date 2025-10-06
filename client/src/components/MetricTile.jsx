import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme
} from '@mui/material';

const MetricTile = ({ 
  icon, 
  label, 
  value, 
  color = 'primary.main',
  loading = false 
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card 
        elevation={0}
        sx={{ 
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          bgcolor: 'background.paper',
          height: '100%'
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            bgcolor: 'grey.200', 
            borderRadius: '50%', 
            mx: 'auto', 
            mb: 1 
          }} />
          <Box sx={{ 
            width: '60%', 
            height: 32, 
            bgcolor: 'grey.200', 
            borderRadius: 1,
            mx: 'auto',
            mb: 1
          }} />
          <Box sx={{ 
            width: '40%', 
            height: 16, 
            bgcolor: 'grey.200', 
            borderRadius: 1,
            mx: 'auto'
          }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        bgcolor: 'background.paper',
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}>
          <Box sx={{ 
            fontSize: 20, 
            color: color,
            display: 'flex',
            alignItems: 'center'
          }}>
            {icon}
          </Box>
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1
            }}
          >
            {value}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricTile;
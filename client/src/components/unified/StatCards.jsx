import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart, 
  People, 
  Storage 
} from '@mui/icons-material';

/**
 * Reusable stat cards component for both Infrastructure and Environment categories
 * Formats percentages with max 2 decimals and appends "%" symbol
 */
export default function StatCards({ stats = {} }) {
  const formatPercentage = (value) => {
    if (value === null || value === undefined || !isFinite(value)) return '-';
    const formatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });
    return `${formatter.format(value)}%`;
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || !isFinite(value)) return '-';
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const cardData = [
    {
      key: 'dominantCategory',
      title: 'Kategori Dominan',
      value: stats.dominantLabel || '-',
      icon: <TrendingUp />,
      color: '#22c55e'
    },
    {
      key: 'percentDominant',
      title: 'Persentase Dominan',
      value: formatPercentage(stats.percentDominant),
      icon: <PieChartIcon />,
      color: '#3b82f6'
    },
    {
      key: 'totalKategori',
      title: 'Total Kategori',
      value: formatNumber(stats.totalKategori),
      icon: <BarChart />,
      color: '#8b5cf6'
    },
    {
      key: 'totalDesa',
      title: 'Total Desa',
      value: formatNumber(stats.totalDesa),
      icon: <People />,
      color: '#f59e0b'
    },
    {
      key: 'desaDenganData',
      title: 'Desa dengan Data',
      value: formatNumber(stats.desaDenganData),
      icon: <Storage />,
      color: '#06b6d4'
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        📊 Statistik Kunci
      </Typography>
      <Grid container spacing={2}>
        {cardData.map((card) => (
          <Grid item xs={12} sm={6} md={2.4} key={card.key}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${card.color}`,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      color: card.color,
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: '0.75rem', fontWeight: 500 }}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: '1.1rem',
                    lineHeight: 1.2
                  }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
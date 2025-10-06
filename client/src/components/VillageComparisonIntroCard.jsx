import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  BarChart as BarChartIcon
} from '@mui/icons-material';

/**
 * VillageComparisonIntroCard - Hero/intro card for comparison feature
 * Minimal design with just icon and title
 */
const VillageComparisonIntroCard = () => {

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #E7EAF1',
        borderRadius: 3,
        mb: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        {/* Inner dashed border area like Figure A - more compact */}
        <Box
          sx={{
            border: '2px dashed #BFD3FF',
            borderRadius: 2,
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          {/* Center Icon - smaller */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              mb: 2,
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
            }}
          >
            <BarChartIcon sx={{ fontSize: 28 }} />
          </Box>


        </Box>
      </CardContent>
    </Card>
  );
};

export default VillageComparisonIntroCard;

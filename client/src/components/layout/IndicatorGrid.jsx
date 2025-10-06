import React from 'react';
import { Box, useTheme } from '@mui/material';

/**
 * Responsive grid system for indicator content
 * Automatically adjusts columns based on available space
 */
const IndicatorGrid = ({
  children,
  minColumnWidth = 340,
  gap = 20,
  className = '',
  fullWidth = false
}) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        display: 'grid',
        gridTemplateColumns: fullWidth 
          ? '1fr' 
          : `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`,
        gap: `${gap}px`,
        width: '100%',
        
        // Responsive adjustments
        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: '1fr', // Single column on mobile
          gap: '16px',
        },
        [theme.breakpoints.between('sm', 'md')]: {
          gridTemplateColumns: fullWidth 
            ? '1fr' 
            : `repeat(auto-fit, minmax(${Math.max(280, minColumnWidth * 0.8)}px, 1fr))`,
          gap: '18px',
        },
        [theme.breakpoints.up('lg')]: {
          gap: `${gap}px`,
        },

        // Smooth transitions
        transition: theme.transitions.create(['gap'], {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.easeInOut,
        }),

        // Ensure grid items don't overflow
        '& > *': {
          minWidth: 0, // Allow grid items to shrink below content size
          width: '100%',
        },
      }}
    >
      {children}
    </Box>
  );
};

/**
 * Special layout for stats section
 */
export const StatsGrid = ({ children, className = '' }) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        width: '100%',
        mb: 3,

        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '8px',
        },
        [theme.breakpoints.up('md')]: {
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
        },

        '& > *': {
          minWidth: 0,
        },
      }}
    >
      {children}
    </Box>
  );
};

/**
 * Section wrapper with consistent spacing
 */
export const IndicatorSection = ({ 
  title, 
  children, 
  className = '',
  spacing = 3 
}) => {
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        mb: spacing,
        '&:last-child': {
          mb: 0,
        },
      }}
    >
      {title && (
        <Box
          sx={{
            mb: 2,
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {typeof title === 'string' ? (
            <Box
              component="h3"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: theme.palette.text.primary,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {title}
            </Box>
          ) : (
            title
          )}
        </Box>
      )}
      {children}
    </Box>
  );
};

export default IndicatorGrid;
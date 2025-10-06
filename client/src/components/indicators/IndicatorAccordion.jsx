import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent,
  Collapse,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const IndicatorAccordion = ({ 
  title,
  subtitle,
  icon,
  children,
  defaultExpanded = false,
  disabled = false,
  indicatorKey
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const theme = useTheme();

  const handleToggle = () => {
    if (!disabled) {
      setExpanded(!expanded);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        borderRadius: 3,
        boxShadow: expanded ? 4 : 2,
        transition: 'all 0.3s ease-in-out',
        border: expanded ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: disabled ? 2 : 6,
          transform: disabled ? 'none' : 'translateY(-2px)',
          cursor: disabled ? 'default' : 'pointer'
        },
        opacity: disabled ? 0.6 : 1
      }}
    >
      {/* Accordion Header */}
      <Box
        onClick={handleToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
          cursor: disabled ? 'default' : 'pointer',
          backgroundColor: expanded ? theme.palette.primary.light + '10' : 'transparent',
          borderRadius: expanded ? '12px 12px 0 0' : '12px',
          transition: 'background-color 0.3s ease'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {/* Icon */}
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: expanded 
                  ? theme.palette.primary.main 
                  : theme.palette.primary.light + '20',
                color: expanded ? 'white' : theme.palette.primary.main,
                transition: 'all 0.3s ease'
              }}
            >
              {icon}
            </Box>
          )}

          {/* Title and Subtitle */}
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: expanded ? theme.palette.primary.main : 'text.primary',
                transition: 'color 0.3s ease'
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Expand/Collapse Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          disabled={disabled}
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color: expanded ? theme.palette.primary.main : 'text.secondary'
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>

      {/* Accordion Content */}
      <Collapse in={expanded} timeout={400}>
        <CardContent 
          sx={{ 
            pt: 0,
            pb: 3,
            backgroundColor: theme.palette.grey[50],
            borderRadius: '0 0 12px 12px'
          }}
        >
          {children}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default IndicatorAccordion;
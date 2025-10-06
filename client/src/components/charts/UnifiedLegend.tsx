import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

export interface LegendItem {
  label: string;
  color: string;
}

export interface UnifiedLegendProps {
  items: LegendItem[];
  orientation?: 'horizontal' | 'vertical';
  showCount?: boolean;
  maxItems?: number;
}

/**
 * Unified legend component used across all charts
 * Displays colored pills/chips with labels in a consistent format
 */
export const UnifiedLegend: React.FC<UnifiedLegendProps> = ({
  items,
  orientation = 'horizontal',
  showCount = false,
  maxItems
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  const hasMore = maxItems && items.length > maxItems;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
        gap: 1,
        justifyContent: orientation === 'horizontal' ? 'center' : 'flex-start',
        alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
        mt: 1
      }}
    >
      {displayItems.map((item, index) => (
        <Box
          key={`${item.label}-${index}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          {/* Color indicator */}
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: item.color,
              border: '1px solid rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
          
          {/* Label */}
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: orientation === 'horizontal' ? '100px' : 'none'
            }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
      
      {hasMore && (
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            color: 'text.disabled',
            fontStyle: 'italic'
          }}
        >
          +{items.length - maxItems!} lainnya
        </Typography>
      )}
    </Box>
  );
};

/**
 * Alternative legend using MUI Chips for a more modern look
 */
export const ChipLegend: React.FC<UnifiedLegendProps> = ({
  items,
  orientation = 'horizontal',
  maxItems
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: 0.5,
        justifyContent: 'center',
        mt: 1
      }}
    >
      {displayItems.map((item, index) => (
        <Chip
          key={`${item.label}-${index}`}
          label={item.label}
          size="small"
          sx={{
            backgroundColor: item.color,
            color: '#fff',
            fontSize: '0.7rem',
            height: 20,
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      ))}
    </Box>
  );
};

export default UnifiedLegend;
import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import ChartContainer from '../charts/ChartContainer';

/**
 * Reusable card wrapper for charts with consistent styling
 */
const ChartCard = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  elevation = 1,
  minHeight = 320,
  maxHeight,
  showTitle = true,
  titleIcon,
  onResize,
  maintainAspectRatio = false,
  aspectRatio
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={elevation}
      className={className}
      sx={{
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create(['box-shadow', 'border-color'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          boxShadow: theme.shadows[3],
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      {/* Card Header */}
      {showTitle && (title || subtitle) && (
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.grey[50],
            minHeight: 'auto',
          }}
        >
          {title && (
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: subtitle ? 0.5 : 0,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                lineHeight: 1.3,
              }}
            >
              {titleIcon && (
                <Box
                  component="span"
                  sx={{
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {titleIcon}
                </Box>
              )}
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.8rem',
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Card Content */}
      <CardContent
        sx={{
          flex: 1,
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': {
            pb: 0,
          },
        }}
      >
        <ChartContainer
          minHeight={minHeight}
          maxHeight={maxHeight}
          onResize={onResize}
          maintainAspectRatio={maintainAspectRatio}
          aspectRatio={aspectRatio}
        >
          <Box
            sx={{
              p: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
        </ChartContainer>
      </CardContent>

      {/* Card Footer */}
      {footer && (
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.grey[50],
            minHeight: 'auto',
          }}
        >
          {typeof footer === 'string' ? (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
              }}
            >
              {footer}
            </Typography>
          ) : (
            footer
          )}
        </Box>
      )}
    </Card>
  );
};

/**
 * Compact card variant for stats/metrics
 */
export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  className = ''
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={1}
      className={className}
      sx={{
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        transition: theme.transitions.create(['transform', 'box-shadow'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent
        sx={{
          p: 2,
          textAlign: 'center',
          '&:last-child': {
            pb: 2,
          },
        }}
      >
        {icon && (
          <Box
            sx={{
              mb: 1,
              color: theme.palette[color]?.main || theme.palette.primary.main,
              fontSize: '1.2rem',
            }}
          >
            {icon}
          </Box>
        )}
        
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 700,
            color: theme.palette[color]?.main || theme.palette.primary.main,
            fontSize: '1.5rem',
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: '0.8rem',
            mb: subtitle ? 0.5 : 0,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.7rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
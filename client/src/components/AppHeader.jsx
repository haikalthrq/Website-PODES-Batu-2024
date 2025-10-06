import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  Analytics,
  Menu
} from '@mui/icons-material';

/**
 * Reusable application header component
 * Provides consistent navigation header across all pages
 * 
 * @param {string} logoHref - URL for logo/brand navigation (default: "/")
 * @param {string} ctaLabel - Text label for primary CTA button (default: "Mulai Analisis")
 * @param {string} ctaHref - URL for primary CTA button (default: "/analysis")
 * @param {function} onCtaClick - Click handler for CTA button (overrides href navigation)
 * @param {boolean} sticky - Whether header should be sticky positioned (default: true)
 * @param {boolean} showCta - Whether to show the CTA button (default: true)
 */
const AppHeader = ({ 
  logoHref = "/", 
  ctaLabel = "Mulai Analisis", 
  ctaHref = "/analysis",
  onCtaClick,
  sticky = true, 
  showCta = true 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Purple theme colors - consistent with existing design
  const purpleTheme = {
    primary: '#7c3aed',
    secondary: '#a855f7',
    white: '#ffffff',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #4c1d95 100%)'
  };

  const handleCtaClick = (e) => {
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick();
    }
  };

  return (
    <Box sx={{ 
      bgcolor: purpleTheme.white,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      position: sticky ? 'sticky' : 'relative',
      top: 0,
      zIndex: 1000
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          py: 2
        }}>
          {/* Logo Section */}
          <Box 
            component={logoHref ? 'a' : 'div'}
            href={logoHref || undefined}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              textDecoration: 'none',
              color: 'inherit',
              cursor: logoHref ? 'pointer' : 'default'
            }}
          >
            <Avatar sx={{ 
              bgcolor: purpleTheme.primary,
              width: 40,
              height: 40
            }}>
              <Analytics />
            </Avatar>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              color: '#1f2937'
            }}>
              PODES Batu
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {showCta && (
              <Button 
                component={onCtaClick ? 'button' : 'a'}
                href={onCtaClick ? undefined : ctaHref}
                onClick={handleCtaClick}
                variant="contained"
                aria-label={ctaLabel}
                sx={{
                  background: purpleTheme.gradient,
                  color: purpleTheme.white,
                  fontWeight: 600,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)'
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: purpleTheme.primary,
                    outlineOffset: '2px'
                  }
                }}
              >
                {ctaLabel}
              </Button>
            )}
            {isMobile && (
              <IconButton 
                aria-label="Open mobile menu"
                sx={{ 
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: purpleTheme.primary,
                    outlineOffset: '2px'
                  }
                }}
              >
                <Menu />
              </IconButton>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AppHeader;
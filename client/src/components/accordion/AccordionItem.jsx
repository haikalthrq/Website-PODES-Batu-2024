// AccordionItem - Individual accordion item with enhanced UX/A11y
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Collapse, useTheme } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useAccordion } from './Accordion';

/**
 * AccordionItem Component with enhanced UX/A11y
 * 
 * Features:
 * - Proper button semantics with ARIA attributes
 * - 48px minimum touch target
 * - Hover, active, and focus states
 * - Smooth chevron rotation animation
 * - Lazy rendering with proper chart resize events
 * - Screen reader optimized
 */
const AccordionItem = ({
  id,
  icon = null,
  title,
  subtitle = null,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const theme = useTheme();
  const {
    openKeys,
    toggleItem,
    registerItem,
    unregisterItem,
    handleKeyDown,
    focusedIndex
  } = useAccordion();

  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isOpen = openKeys.includes(id);
  const buttonId = `accordion-${id}-button`;
  const panelId = `accordion-${id}-panel`;

  // Register this item with parent accordion
  useEffect(() => {
    registerItem(id, buttonRef.current);
    return () => unregisterItem(id);
  }, [id, registerItem, unregisterItem]);

  // Track if item has been opened for lazy rendering
  useEffect(() => {
    if (isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isOpen, hasBeenOpened]);

  // Handle animation states
  const handleEntered = () => {
    setIsAnimating(false);
    // Trigger resize event for charts inside
    if (typeof window !== 'undefined') {
      console.log('Accordion opened, dispatching resize event for:', id);
      window.dispatchEvent(new Event('resize'));
    }
  };

  const handleEntering = () => {
    setIsAnimating(true);
  };

  const handleExiting = () => {
    setIsAnimating(true);
  };

  const handleExited = () => {
    setIsAnimating(false);
  };

  // Click handler
  const handleClick = () => {
    if (!disabled) {
      toggleItem(id);
    }
  };

  // Keyboard handler
  const handleKeyDownLocal = (event) => {
    handleKeyDown(event, id);
  };

  // Generate subtitle text
  const getSubtitle = () => {
    if (subtitle) return subtitle;
    return isOpen ? 'Klik untuk menutup' : 'Klik untuk membuka';
  };

  return (
    <Box
      className={`accordion-item ${className}`}
      sx={{
        borderRadius: 3,
        border: `1px solid ${isOpen ? theme.palette.primary.light : theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: isOpen ? theme.shadows[2] : theme.shadows[1],
        // Only transition border color, not all properties
        transition: 'border-color 150ms ease-out',
        position: 'relative',
        overflow: 'hidden',
        // Hardware acceleration for smoother animations
        transform: 'translateZ(0)',
        willChange: 'border-color',
        
        // Open state accent
        ...(isOpen && {
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: theme.palette.primary.main,
            borderRadius: '3px 0 0 3px',
            opacity: 0.8,
            zIndex: 1
          }
        }),

        // Respect reduced motion preference
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '& *': {
            transition: 'none !important',
            animation: 'none !important'
          }
        }
      }}
      {...props}
    >
      {/* Header Button */}
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-describedby={subtitle ? `${buttonId}-subtitle` : undefined}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDownLocal}
        style={{
          width: '100%',
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none'
        }}
        className="accordion-header-button"
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: 3,
            alignItems: 'center',
            minHeight: '52px',
            px: 4,
            py: 2,
            position: 'relative',
            zIndex: 2,
            
            // Hover state
            '&:hover': {
              backgroundColor: disabled ? 'transparent' : theme.palette.action.hover,
            },
            
            // Active state
            '&:active': {
              backgroundColor: disabled ? 'transparent' : theme.palette.action.selected,
            },
            
            // Focus state
            'button:focus-visible &': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '-2px',
              borderRadius: 2
            },

            // Disabled state
            ...(disabled && {
              opacity: 0.5,
              cursor: 'not-allowed'
            }),

            transition: 'background-color 120ms ease-out',
            // Hardware acceleration
            transform: 'translateZ(0)',
            
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none'
            }
          }}
        >
          {/* Left Icon */}
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                fontSize: '1.25rem'
              }}
            >
              {icon}
            </Box>
          )}

          {/* Title Group */}
          <Box sx={{ textAlign: 'left', minWidth: 0 }}>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: '1rem',
                lineHeight: 1.4,
                display: 'block'
              }}
            >
              {title}
            </Typography>
            <Typography
              id={`${buttonId}-subtitle`}
              variant="caption"
              component="span"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                lineHeight: 1.2,
                display: 'block',
                mt: 0.25,
                opacity: 0.8
              }}
            >
              {getSubtitle()}
            </Typography>
          </Box>

          {/* Chevron */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.text.secondary,
              // Only transition transform for smoother animation
              transition: 'transform 180ms ease-out',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              // Hardware acceleration
              willChange: 'transform',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                transform: 'none'
              }
            }}
            aria-hidden="true"
          >
            <ExpandMore
              sx={{
                fontSize: '1.5rem',
                color: isOpen ? theme.palette.primary.main : theme.palette.text.secondary
              }}
            />
          </Box>

          {/* Screen reader only text */}
          <Box
            component="span"
            sx={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0
            }}
          >
            {isOpen ? 'Tutup' : 'Buka'} bagian {title}
          </Box>
        </Box>
      </button>

      {/* Panel Content */}
      <Collapse
        in={isOpen}
        timeout={{
          enter: 200,
          exit: 150
        }}
        easing={{
          enter: 'cubic-bezier(0.4, 0, 0.6, 1)',
          exit: 'cubic-bezier(0.4, 0, 1, 1)'
        }}
        onEntered={handleEntered}
        onEntering={handleEntering}
        onExiting={handleExiting}
        onExited={handleExited}
        unmountOnExit={false} // Keep mounted for better performance
      >
        <Box
          ref={panelRef}
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          sx={{
            px: 5,
            pb: 5,
            pt: 2,
            backgroundColor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
            // Remove opacity transition - causes janky animation
            // Hardware acceleration
            transform: 'translateZ(0)',
            willChange: isAnimating ? 'height' : 'auto',
            
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none'
            }
          }}
        >
          {/* Lazy render content only after first open, pass accordion state to children */}
          {hasBeenOpened && (
            React.isValidElement(children) ? (
              React.cloneElement(children, { 
                isAccordionOpen: isOpen,
                accordionId: id 
              })
            ) : children
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default AccordionItem;
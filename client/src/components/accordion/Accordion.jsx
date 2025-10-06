// Enhanced Accordion with proper UX/A11y - Root container component
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import './accordion.css';

const AccordionContext = createContext();

/**
 * Enhanced Accordion Component with UX/A11y best practices
 * 
 * Features:
 * - Strong clickable affordance with proper button styling
 * - Keyboard navigation (arrow keys, space, enter)
 * - ARIA compliance for screen readers
 * - State persistence (localStorage/URL)
 * - Smooth animations respecting prefers-reduced-motion
 * - Touch-friendly (48px min hit area)
 * - Progressive disclosure controls
 */
const Accordion = ({
  children,
  type = 'single', // 'single' | 'multiple'
  defaultOpenKeys = [],
  persistKey = null,
  allowToggleAll = false,
  className = '',
  ...props
}) => {
  // State management with persistence
  const [openKeys, setOpenKeys] = useState(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`accordion-${persistKey}`);
        return saved ? JSON.parse(saved) : defaultOpenKeys;
      } catch (e) {
        console.warn('Failed to load accordion state from localStorage', e);
      }
    }
    return defaultOpenKeys;
  });

  // Focus management for roving tabindex
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef(new Map());
  const itemKeys = useRef([]);

  // Persist state changes
  useEffect(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`accordion-${persistKey}`, JSON.stringify(openKeys));
      } catch (e) {
        console.warn('Failed to save accordion state to localStorage', e);
      }
    }
  }, [openKeys, persistKey]);

  // Register item keys for keyboard navigation
  const registerItem = useCallback((key, ref) => {
    itemRefs.current.set(key, ref);
    if (!itemKeys.current.includes(key)) {
      itemKeys.current.push(key);
    }
  }, []);

  const unregisterItem = useCallback((key) => {
    itemRefs.current.delete(key);
    itemKeys.current = itemKeys.current.filter(k => k !== key);
  }, []);

  // Toggle item state
  const toggleItem = useCallback((key) => {
    setOpenKeys(prev => {
      if (type === 'single') {
        return prev.includes(key) ? [] : [key];
      } else {
        return prev.includes(key) 
          ? prev.filter(k => k !== key)
          : [...prev, key];
      }
    });
  }, [type]);

  // Progressive disclosure controls
  const openAll = useCallback(() => {
    if (type === 'multiple') {
      setOpenKeys(itemKeys.current);
    }
  }, [type]);

  const closeAll = useCallback(() => {
    setOpenKeys([]);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((event, currentKey) => {
    const currentIndex = itemKeys.current.indexOf(currentKey);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = (currentIndex + 1) % itemKeys.current.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : itemKeys.current.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = itemKeys.current.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleItem(currentKey);
        return;
      case 'Escape':
        if (openKeys.includes(currentKey)) {
          toggleItem(currentKey);
        }
        return;
      default:
        return;
    }

    const newKey = itemKeys.current[newIndex];
    const newRef = itemRefs.current.get(newKey);
    if (newRef) {
      newRef.focus();
      setFocusedIndex(newIndex);
    }
  }, [openKeys, toggleItem]);

  const contextValue = {
    openKeys,
    toggleItem,
    registerItem,
    unregisterItem,
    handleKeyDown,
    focusedIndex,
    setFocusedIndex
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <Box
        className={`enhanced-accordion ${className}`}
        sx={{
          '& .accordion-item:not(:last-child)': {
            marginBottom: 2
          }
        }}
        {...props}
      >
        {/* Progressive disclosure controls */}
        {allowToggleAll && type === 'multiple' && itemKeys.current.length > 1 && (
          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            gap: 2,
            justifyContent: 'flex-end'
          }}>
            <Button
              variant="outlined"
              size="small"
              onClick={openAll}
              disabled={openKeys.length === itemKeys.current.length}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem'
              }}
            >
              Buka Semua
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={closeAll}
              disabled={openKeys.length === 0}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem'
              }}
            >
              Tutup Semua
            </Button>
          </Box>
        )}

        {children}
      </Box>
    </AccordionContext.Provider>
  );
};

// Hook to access accordion context
export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion component');
  }
  return context;
};

export default Accordion;
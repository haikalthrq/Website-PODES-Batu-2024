import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  TextField,
  Alert,
  Stack,
  InputAdornment,
  Checkbox,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import {
  Search,
  LocationOn,
  Analytics,
  Warning,
  Close
} from '@mui/icons-material';
import { getComparisonConfig } from '../config/categories.config';

/**
 * VillageIndicatorSelectors - Multi-select components for villages and indicators
 * Supports search, validation, and limit enforcement (max 5 villages, max 5 indicators)
 */
const VillageIndicatorSelectors = ({
  villages = [],
  selectedVillages = [],
  selectedIndicators = [],
  currentCategory = 'pendidikan',
  onVillagesChange,
  onIndicatorsChange,
  maxVillages = 5,
  maxIndicators = 5
}) => {
  const [villageSearchTerm, setVillageSearchTerm] = useState('');
  const [indicatorSearchTerm, setIndicatorSearchTerm] = useState('');

  // Get available indicators for current category
  const categoryConfig = getComparisonConfig(currentCategory);
  const availableIndicators = categoryConfig?.indicators || [];

  // Base comparator for consistent sorting (Kecamatan ASC → Desa ASC)
  const baseCmp = useCallback((a, b) => {
    return a.nama_kecamatan.localeCompare(b.nama_kecamatan, 'id') ||
           a.nama_desa.localeCompare(b.nama_desa, 'id');
  }, []);

  // Sort villages with selected-first logic
  const sortedVillages = useMemo(() => {
    const selectedIds = new Set(selectedVillages.map(v => v.id_desa));
    const copy = [...villages];
    
    copy.sort((a, b) => {
      const aSel = selectedIds.has(a.id_desa);
      const bSel = selectedIds.has(b.id_desa);
      
      // Selected-first priority
      if (aSel !== bSel) return aSel ? -1 : 1;
      
      // Then sort by kecamatan → desa
      return baseCmp(a, b);
    });
    
    return copy;
  }, [villages, selectedVillages, baseCmp]);

  // Filter villages based on search term with selected-first maintained
  const filteredVillages = useMemo(() => {
    let filtered = villages;
    
    if (villageSearchTerm) {
      const searchLower = villageSearchTerm.toLowerCase();
      filtered = villages.filter((village) => {
        const searchText = `${village.nama_desa} ${village.nama_kecamatan}`.toLowerCase();
        return searchText.includes(searchLower);
      });
    }
    
    // Apply selected-first sorting to filtered results
    const selectedIds = new Set(selectedVillages.map(v => v.id_desa));
    filtered.sort((a, b) => {
      const aSel = selectedIds.has(a.id_desa);
      const bSel = selectedIds.has(b.id_desa);
      
      if (aSel !== bSel) return aSel ? -1 : 1;
      return baseCmp(a, b);
    });
    
    return filtered;
  }, [villages, villageSearchTerm, selectedVillages, baseCmp]);

  // Filter indicators based on search term
  const filteredIndicators = useMemo(() => {
    if (!indicatorSearchTerm) return availableIndicators;
    return availableIndicators.filter((indicator) =>
      indicator.label.toLowerCase().includes(indicatorSearchTerm.toLowerCase())
    );
  }, [availableIndicators, indicatorSearchTerm]);

  // Toggle village selection (for dropdown item clicks)
  const toggleVillage = useCallback((village) => {
    const exists = selectedVillages.find(v => v.id_desa === village.id_desa);
    
    if (exists) {
      // Remove from selection
      onVillagesChange(selectedVillages.filter(v => v.id_desa !== village.id_desa));
    } else {
      // Add to selection if under limit
      if (selectedVillages.length >= maxVillages) return;
      onVillagesChange([...selectedVillages, village]);
    }
  }, [selectedVillages, onVillagesChange, maxVillages]);

  // Remove single village (for pill/chip delete button)
  const removeVillage = useCallback((villageId) => {
    onVillagesChange(selectedVillages.filter(v => v.id_desa !== villageId));
  }, [selectedVillages, onVillagesChange]);

  // Toggle indicator selection (for dropdown item clicks)
  const toggleIndicator = useCallback((indicatorKey) => {
    const exists = selectedIndicators.includes(indicatorKey);
    
    if (exists) {
      // Remove from selection
      onIndicatorsChange(selectedIndicators.filter(key => key !== indicatorKey));
    } else {
      // Add to selection if under limit
      if (selectedIndicators.length >= maxIndicators) return;
      onIndicatorsChange([...selectedIndicators, indicatorKey]);
    }
  }, [selectedIndicators, onIndicatorsChange, maxIndicators]);

  // Remove single indicator (for pill/chip delete button)
  const removeIndicator = useCallback((indicatorKey) => {
    onIndicatorsChange(selectedIndicators.filter(key => key !== indicatorKey));
  }, [selectedIndicators, onIndicatorsChange]);

  const handleIndicatorDelete = (indicatorToDelete) => {
    onIndicatorsChange(selectedIndicators.filter((indicator) => indicator !== indicatorToDelete));
  };

  const getVillageLabel = (village) => `${village.nama_desa} (${village.nama_kecamatan})`;
  const getIndicatorLabel = (indicatorKey) => {
    const indicator = availableIndicators.find(ind => ind.key === indicatorKey);
    return indicator ? indicator.label : indicatorKey;
  };

  return (
    <Box sx={{ mb: 4 }}>

      <Stack spacing={2.5}>
        {/* Village Selection */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <LocationOn sx={{ fontSize: 20, color: '#6366f1' }} />
            Pilih Desa/Kelurahan
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="village-select-label">
              Pilih desa untuk dibandingkan (maksimal {maxVillages})
            </InputLabel>
            <Select
              labelId="village-select-label"
              multiple
              value={selectedVillages}
              onChange={() => {}} // Controlled through individual item clicks
              input={<OutlinedInput label={`Pilih desa untuk dibandingkan (maksimal ${maxVillages})`} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((village) => (
                    <Chip
                      key={village.id_desa}
                      label={getVillageLabel(village)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      deleteIcon={
                        <Close
                          sx={{ fontSize: 16 }}
                          aria-label={`Hapus ${village.nama_desa} (${village.nama_kecamatan})`}
                        />
                      }
                      onDelete={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeVillage(village.id_desa);
                      }}
                      onMouseDown={(e) => {
                        // Prevent triggering dropdown when clicking on chip area
                        if (e.target.closest('.MuiChip-deleteIcon')) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                  },
                },
              }}
            >
              <MenuItem disabled>
                <TextField
                  placeholder="Cari dan pilih desa..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={villageSearchTerm}
                  onChange={(e) => setVillageSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </MenuItem>
              
              {/* Render selected villages first */}
              {(() => {
                const selectedVillagesList = filteredVillages.filter(village => 
                  selectedVillages.some(v => v.id_desa === village.id_desa)
                );
                const unselectedVillagesList = filteredVillages.filter(village => 
                  !selectedVillages.some(v => v.id_desa === village.id_desa)
                );
                
                // Build array of menu items instead of using Fragments
                const menuItems = [];
                
                // Selected villages section
                if (selectedVillagesList.length > 0) {
                  menuItems.push(
                    <MenuItem key="selected-header" disabled>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5
                        }}
                      >
                        Dipilih
                      </Typography>
                    </MenuItem>
                  );
                  
                  selectedVillagesList.forEach((village) => {
                    menuItems.push(
                      <MenuItem
                        key={village.id_desa}
                        onClick={() => toggleVillage(village)}
                        role="option"
                        aria-selected={true}
                      >
                        <Checkbox checked={true} />
                        <ListItemText primary={getVillageLabel(village)} />
                        <LocationOn sx={{ color: '#6366f1', ml: 1 }} />
                      </MenuItem>
                    );
                  });
                  
                  if (unselectedVillagesList.length > 0) {
                    menuItems.push(<Divider key="divider" />);
                  }
                }
                
                // Unselected villages section
                unselectedVillagesList.forEach((village) => {
                  const isDisabled = selectedVillages.length >= maxVillages;
                  
                  menuItems.push(
                    <MenuItem
                      key={village.id_desa}
                      onClick={() => !isDisabled && toggleVillage(village)}
                      disabled={isDisabled}
                      role="option"
                      aria-selected={false}
                      sx={{
                        opacity: isDisabled ? 0.5 : 1,
                        '&:hover': {
                          backgroundColor: isDisabled ? 'transparent' : 'rgba(99, 102, 241, 0.04)'
                        }
                      }}
                    >
                      <Checkbox checked={false} disabled={isDisabled} />
                      <ListItemText 
                        primary={getVillageLabel(village)}
                        secondary={isDisabled ? 'Maksimal pilihan tercapai' : null}
                      />
                      <LocationOn sx={{ 
                        color: isDisabled ? '#9ca3af' : '#6b7280', 
                        ml: 1 
                      }} />
                    </MenuItem>
                  );
                });
                
                return menuItems;
              })()}
            </Select>
          </FormControl>

          {/* Village selection helper text */}
          <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block' }}>
            💡 Pilih minimal 1 desa untuk melihat perbandingan data.
          </Typography>
          
          {/* Maximum limit notification with aria-live */}
          {selectedVillages.length >= maxVillages && (
            <Typography 
              variant="caption" 
              sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}
              aria-live="polite"
            >
              Maksimal {maxVillages} desa dipilih
            </Typography>
          )}
        </Box>

        {/* Indicator Selection */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Analytics sx={{ fontSize: 20, color: '#6366f1' }} />
            Pilih Indikator
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="indicator-select-label">
              Pilih indikator untuk dibandingkan (minimal 2, maksimal {maxIndicators})
            </InputLabel>
            <Select
              labelId="indicator-select-label"
              multiple
              value={selectedIndicators}
              onChange={() => {}} // Controlled through individual item clicks
              input={<OutlinedInput label={`Pilih indikator untuk dibandingkan (minimal 2, maksimal ${maxIndicators})`} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((indicatorKey) => (
                    <Chip
                      key={indicatorKey}
                      label={getIndicatorLabel(indicatorKey)}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      deleteIcon={
                        <Close
                          sx={{ fontSize: 16 }}
                          aria-label={`Hapus ${getIndicatorLabel(indicatorKey)}`}
                        />
                      }
                      onDelete={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeIndicator(indicatorKey);
                      }}
                      onMouseDown={(e) => {
                        // Prevent triggering dropdown when clicking on chip area
                        if (e.target.closest('.MuiChip-deleteIcon')) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              <MenuItem disabled>
                <TextField
                  placeholder="Pilih indikator..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={indicatorSearchTerm}
                  onChange={(e) => setIndicatorSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </MenuItem>
              {filteredIndicators.map((indicator) => {
                const isSelected = selectedIndicators.includes(indicator.key);
                const isDisabled = !isSelected && selectedIndicators.length >= maxIndicators;
                
                return (
                  <MenuItem
                    key={indicator.key}
                    onClick={() => !isDisabled && toggleIndicator(indicator.key)}
                    disabled={isDisabled}
                    role="option"
                    aria-selected={isSelected}
                    sx={{
                      opacity: isDisabled ? 0.5 : 1,
                      '&:hover': {
                        backgroundColor: isDisabled ? 'transparent' : 'rgba(99, 102, 241, 0.04)'
                      }
                    }}
                  >
                    <Checkbox checked={isSelected} disabled={isDisabled} />
                    <ListItemText 
                      primary={indicator.label}
                      secondary={isDisabled ? 'Maksimal pilihan tercapai' : null}
                    />
                    <Analytics sx={{ 
                      color: isDisabled ? '#9ca3af' : (isSelected ? '#6366f1' : '#6b7280'), 
                      ml: 1 
                    }} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* Indicator selection helper text */}
          <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block' }}>
            💡 Pilih minimal 2 indikator untuk melakukan perbandingan.
          </Typography>
          
          {/* Maximum limit notification with aria-live */}
          {selectedIndicators.length >= maxIndicators && (
            <Typography 
              variant="caption" 
              sx={{ color: '#ef4444', mt: 0.5, display: 'block' }}
              aria-live="polite"
            >
              Maksimal {maxIndicators} indikator dipilih
            </Typography>
          )}
        </Box>

        {/* Validation Alerts */}
        {selectedVillages.length === 0 && (
          <Alert severity="info" icon={false}>
            <Typography variant="body2">
              Pilih minimal 1 desa untuk melihat perbandingan data.
            </Typography>
          </Alert>
        )}

        {selectedVillages.length > 0 && selectedIndicators.length < 2 && (
          <Alert severity="warning" icon={<Warning />}>
            <Typography variant="body2">
              Pilih minimal 2 indikator untuk melakukan perbandingan.
            </Typography>
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default VillageIndicatorSelectors;
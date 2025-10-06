import React from 'react';
import { Box, Drawer, Toolbar, Typography, Divider, FormControl, InputLabel, Select, MenuItem, Button, Stack } from '@mui/material';

const drawerWidth = 300;

const FilterSidebar = ({
  open,
  onClose,
  mobile,
  filters,
  onChange,
  onReset,
  categories,
  getIndicatorsForCategory,
  kecamatanList,
  desaList
}) => {
  // Debug logging
  console.log('[FilterSidebar] Received filters:', filters);
  console.log('[FilterSidebar] filters.indicator value:', filters.indicator);
  
  // Remove "Semua" option from categories - use specific categories only
  const categoryOptions = categories || [];
  const content = (
    <Box sx={{ width: mobile ? '100%' : drawerWidth, p: 3 }} role="presentation">
      <Stack spacing={3}>
        {/* Category Filter */}
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            📊 Filter Kategori Utama
          </Typography>
          <FormControl fullWidth>
            <Select
              value={filters.category}
              onChange={(e) => onChange('category', e.target.value)}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#2563eb',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563eb',
                  }
                }
              }}
              displayEmpty
            >
              {categoryOptions.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Indicator Filter */}
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            📈 Filter Indikator Spesifik
          </Typography>
          <FormControl fullWidth>
            <Select
              value={filters.indicator}
              onChange={(e) => onChange('indicator', e.target.value)}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#2563eb',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563eb',
                  }
                }
              }}
              displayEmpty
            >
              <MenuItem value="Semua">
                <em>📊 Semua Indikator {filters.category}</em>
              </MenuItem>
              {Object.entries(getIndicatorsForCategory(filters.category) || {}).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Kecamatan Filter */}
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            🏛️ Filter Kecamatan
          </Typography>
          <FormControl fullWidth>
            <Select
              value={filters.kecamatan}
              onChange={(e) => onChange('kecamatan', e.target.value)}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#2563eb',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563eb',
                  }
                }
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em>🌐 Semua Kecamatan</em>
              </MenuItem>
              {kecamatanList.map((kec) => (
                <MenuItem key={kec} value={kec}>{kec}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Desa Filter */}
        <Box>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 600, 
            mb: 1.5, 
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            🏘️ Filter Desa/Kelurahan
          </Typography>
          <FormControl fullWidth>
            <Select
              value={filters.desa}
              onChange={(e) => onChange('desa', e.target.value)}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#2563eb',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2563eb',
                  }
                }
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em>🏠 Semua Desa/Kelurahan</em>
              </MenuItem>
              {desaList.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Reset Button */}
        <Box sx={{ pt: 2, borderTop: '1px solid #e5e7eb' }}>
          <Button
            onClick={onReset}
            variant="outlined"
            size="medium"
            fullWidth
            startIcon={<span>🔄</span>}
            sx={{
              borderRadius: 2,
              borderColor: '#d1d5db',
              color: '#6b7280',
              '&:hover': {
                borderColor: '#2563eb',
                bgcolor: '#f3f4f6',
                color: '#2563eb',
              }
            }}
          >
            Reset Semua Filter
          </Button>
        </Box>
      </Stack>
    </Box>
  );

  if (mobile) {
    return (
      <Drawer 
        anchor="bottom" 
        open={open} 
        onClose={onClose} 
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: '75vh',
            bgcolor: '#f8fafc',
            borderTop: '1px solid #e5e7eb'
          }
        }}
      >
        <Box sx={{ 
          width: '100%', 
          height: '100%',
          p: 3,
          pb: 6 // Extra padding for mobile gestures
        }}>
          {/* Mobile Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3,
            pb: 2,
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: '#1f2937',
              fontSize: '1.1rem'
            }}>
              🎯 Filter & Analisis
            </Typography>
            <Button 
              onClick={onClose}
              size="small"
              sx={{ 
                minWidth: 'auto',
                bgcolor: '#e5e7eb',
                color: '#6b7280',
                '&:hover': { bgcolor: '#d1d5db' }
              }}
            >
              ✕
            </Button>
          </Box>
          
          {/* Mobile Content */}
          <Box sx={{ overflow: 'auto', height: 'calc(100% - 80px)' }}>
            {content.props.children}
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        borderRight: '1px solid #e5e7eb',
        bgcolor: '#f8fafc',
        display: { xs: 'none', md: 'block' },
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1100,
        overflow: 'auto'
      }}
    >
      <Toolbar sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: '#1f2937',
          fontSize: '1.1rem'
        }}>
          🎯 Filter & Analisis
        </Typography>
      </Toolbar>
      {content}
    </Box>
  );
};

export default FilterSidebar;
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Fade,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Stack,
  Button,
  Alert,
  Drawer,
  Paper
} from '@mui/material';
import {
  FilterList,
  Refresh,
  Analytics,
  Assessment,
  Close,
  ExpandMore,
  TrendingUp
} from '@mui/icons-material';

// Import components
import AppHeader from '../components/AppHeader';
import FilterSidebar from '../components/FilterSidebar';
import KPICards from '../components/KPICards';
import IndicatorsSummary from '../analysis/IndicatorsSummary';
import { SummaryAccordionSection } from '../analysis/sections';
import ComparisonView from '../components/ComparisonView';
import FullDataTable from '../components/table/FullDataTable';
import UniversalIndicatorPanel from '../analysis/universal/UniversalIndicatorPanel';
import { formatAnalysisTitle } from '../analysis/universal/titleUtils';
import { DashboardSkeleton } from '../components/LoadingSkeletons';
import { getCategoryConfig } from '../config/categories.config';
import { getIndicatorsForCategory } from '../config/selectors';
import { podesService } from '../services/api';
import GeospatialMap from '../components/GeospatialMap';

const AnalysisPage = ({ setCurrentPage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metadata, setMetadata] = useState(null);
  
  // Initialize viewMode from sessionStorage or URL parameter
  const [viewMode, setViewMode] = useState(() => {
    // First check sessionStorage (set from landing page "Peta Geospasial" button)
    const savedViewMode = sessionStorage.getItem('viewMode');
    if (savedViewMode === 'peta') {
      sessionStorage.removeItem('viewMode'); // Clear after reading
      return 'peta';
    }
    
    // Clear any stale sessionStorage
    sessionStorage.removeItem('viewMode');
    
    // Then check URL parameter
    const params = new URLSearchParams(window.location.search);
    const urlViewMode = params.get('viewMode');
    
    if (urlViewMode === 'peta') {
      // Clear the URL parameter after reading to prevent it from persisting
      params.delete('viewMode');
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
      return 'peta';
    }
    
    // Clean up any stale viewMode parameter in URL
    if (urlViewMode) {
      params.delete('viewMode');
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
    
    // Default to 'analisis' mode
    return 'analisis';
  });
  
  // Constants for indicator selection
  const INDICATOR_ALL = 'Semua';
  
  // Helper function to convert old indicator format to new format
  const convertIndicatorFormat = (indicator, category) => {
    if (!indicator || indicator === INDICATOR_ALL) return indicator;
    
    // Mapping from old dataKey format to new indicator key format
    const conversionMap = {
      'jumlah_tk': 'tk',
      'jumlah_sd': 'sd', 
      'jumlah_smp': 'smp',
      'jumlah_sma': 'sma',
      'jumlah_puskesmas': 'puskesmas',
      'jumlah_rs': 'rs'
    };
    
    return conversionMap[indicator] || indicator;
  };

  // Filter state - Default indicator to "Semua" as per requirement
  const [filters, setFilters] = useState(() => {
    // Check for URL parameters on initial load
    const params = new URLSearchParams(window.location.search);
    const urlIndicator = params.get('indicator');
    const urlCategory = params.get('category') || 'Pendidikan';
    
    // Convert old format indicator to new format if needed
    const convertedIndicator = urlIndicator ? convertIndicatorFormat(urlIndicator, urlCategory) : INDICATOR_ALL;
    
    const initialFilters = {
      category: urlCategory,
      indicator: convertedIndicator, // Use converted format
      kecamatan: '',
      desa: ''
    };
    
    // Debug logging for initial state
    console.log('[AnalysisPage] Initial filters:', initialFilters);
    console.log('[AnalysisPage] INDICATOR_ALL constant:', INDICATOR_ALL);
    
    return initialFilters;
  });

  // Category indicators mapping using centralized selector
  const categoryIndicators = useMemo(() => {
    // Use centralized selector to get indicators for each category
    const categories = ['Pendidikan', 'Kesehatan', 'Infrastruktur & Konektivitas', 'Lingkungan & Kebencanaan'];
    const mapping = {};
    
    categories.forEach(category => {
      const indicators = getIndicatorsForCategory(category);
      mapping[category] = Object.keys(indicators);
    });
    
    return mapping;
  }, [metadata]);



  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Ensure indicator is set to "Semua" if somehow empty
  useEffect(() => {
    if (!filters.indicator || filters.indicator === '') {
      console.log('[AnalysisPage] Setting default indicator to:', INDICATOR_ALL);
      setFilters(prev => ({ ...prev, indicator: INDICATOR_ALL }));
    }
  }, [filters.indicator, INDICATOR_ALL]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch both data and metadata
      const [allVillages, meta] = await Promise.all([
        podesService.getAllVillages(),
        podesService.getMetadata().catch(() => null)
      ]);
      
      // Debug logging removed to prevent performance issues
      
      setData(Array.isArray(allVillages) ? allVillages : []);
      setMetadata(meta);
    } catch (err) {
      setError('Gagal memuat data. Pastikan server backend berjalan di port 5001.');
      console.error('AnalysisPage error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'category') {
        // Reset to "Semua" when category changes as per requirement
        next.indicator = INDICATOR_ALL;
      }
      if (key === 'kecamatan') {
        next.desa = '';
      }
      return next;
    });
    
    // Update URL parameters to persist state
    if (key === 'indicator') {
      const url = new URL(window.location);
      if (value === INDICATOR_ALL) {
        url.searchParams.delete('indicator'); // Remove param for default value
      } else {
        url.searchParams.set('indicator', value);
      }
      window.history.replaceState({}, '', url);
    }
  };

  const getDynamicTitle = () => {
    if (filters.indicator && filters.indicator !== INDICATOR_ALL && filters.category) {
      // Only show specific indicator name if it's not "Semua"
      return formatAnalysisTitle(filters.indicator, filters.category);
    } else if (filters.category) {
      // For "Semua" indicator or no specific indicator, show category only
      return formatAnalysisTitle('', filters.category);
    }
    return "Dashboard PODES 2024";
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const categories = useMemo(() => Object.keys(categoryIndicators), [categoryIndicators]);
  
  const kecamatanList = useMemo(() => {
    return [...new Set(data.map(d => d.nama_kecamatan).filter(Boolean))];
  }, [data]);
  
  const desaList = useMemo(() => {
    return filters.kecamatan
      ? data.filter(d => d.nama_kecamatan === filters.kecamatan).map(d => d.nama_desa).filter(Boolean)  
      : [...new Set(data.map(d => d.nama_desa).filter(Boolean))];
  }, [data, filters.kecamatan]);



  // Filter data based on current filters
  const filteredData = useMemo(() => {
    const filtered = data.filter(row => {
      if (filters.kecamatan && filters.kecamatan !== 'Semua Kecamatan' && row.nama_kecamatan !== filters.kecamatan) return false;
      if (filters.desa && filters.desa !== 'Semua Desa/Kelurahan' && row.nama_desa !== filters.desa) return false;
      return true;
    });
    
    // Debug logging controlled by URL parameter
    const debugEnabled = new URLSearchParams(window.location.search).has('debugTable');
    if (debugEnabled && filtered.length > 0 && !window.debugLogged) {
      console.log(`[AnalysisPage] Filtered data for ${filters.category}:`, filtered.length, 'villages');
      console.log(`[AnalysisPage] Sample data:`, filtered[0]);
      window.debugLogged = true;
    }
    
    return filtered;
  }, [data, filters.kecamatan, filters.desa, filters.category]);

  // Analysis data for KPICards and other components
  const selectedIndicatorKey = filters.indicator && filters.indicator !== 'Semua' ? filters.indicator : null;
  
  const analysisData = useMemo(() => {
    if (filters.indicator === 'Semua') {
      let indicators = {};
      try {
        indicators = getIndicatorsForCategory(filters.category) || {};
      } catch (e) {
        console.error("getIndicatorsForCategory failed in analysisData", e);
        indicators = {};
      }
      const indicatorKeys = Object.keys(indicators);
      const totalKecamatan = [...new Set(filteredData.map(d => d.nama_kecamatan))].length;
      
      return {
        type: 'summary',
        kpis: {
          total_villages: filteredData.length,
          total_kecamatan: totalKecamatan,
          category: filters.category,
          indicators_count: indicatorKeys.length
        },
        indicatorKeys: indicatorKeys,
        indicators: indicators
      };
    }

    if (!selectedIndicatorKey) return null;
    const values = filteredData.map(r => r[selectedIndicatorKey]).filter(v => v !== undefined && v !== null);
    const numericValues = values.map(v => (typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, '.')))).filter(v => !Number.isNaN(v));
    const isNumeric = numericValues.length === values.length && values.length > 0;

    if (isNumeric) {
      const sum = numericValues.reduce((a,b) => a + b, 0);
      const rankingData = filteredData.map(r => ({
        nama_kecamatan: r.nama_kecamatan,
        nama_desa: r.nama_desa,
        value: typeof r[selectedIndicatorKey] === 'number' ? r[selectedIndicatorKey] : parseFloat(String(r[selectedIndicatorKey]).replace(/,/g,'.'))
      })).filter(d => !Number.isNaN(d.value)).sort((a,b) => b.value - a.value);
      return {
        type: 'quantitative',
        kpis: { total: sum, max: Math.max(...numericValues), min: Math.min(...numericValues) },
        rankingData
      };
    }

    const counts = values.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
    const distributionData = Object.entries(counts).map(([name, count]) => ({ name, value: count }));
    const most = distributionData.sort((a,b) => b.value - a.value)[0] || { name: '-', value: 0 };
    return {
      type: 'qualitative',
      kpis: { most: most.name, mostCount: most.value },
      distributionData
    };
  }, [filteredData, selectedIndicatorKey, filters.indicator, filters.category, categoryIndicators]);



  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', p: 3 }}>
        <Container maxWidth="lg">
          <Alert 
            severity="error" 
            action={
              <IconButton color="inherit" size="small" onClick={fetchData}>
                <Refresh />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Reusable Navigation Header - Matches Landing Page Styling */}
      <AppHeader 
        ctaLabel="Home"
        onCtaClick={() => setCurrentPage && setCurrentPage('dashboard')}
      />
      
      <Box sx={{ 
        minHeight: 'calc(100vh - 80px)', // Account for header height
        bgcolor: '#fafafa',
        display: 'flex'
      }}>
        {/* Permanent Sidebar - Desktop */}
      {!isMobile && (
        <Box sx={{
          width: 300,
          bgcolor: 'background.paper',
          borderRight: '1px solid #e5e7eb',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2563eb' }}>
              🎛️ Panel Kontrol
            </Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip 
                size="small" 
                label={`${getActiveFiltersCount()} filter aktif`}
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <FilterSidebar
            open={true}
            onClose={() => {}}
            mobile={false}
            filters={filters}
            onChange={handleFiltersChange}
            onReset={() => setFilters({
              category: 'Pendidikan',
              indicator: INDICATOR_ALL,
              kecamatan: '',
              desa: ''
            })}
            categories={categories}
            getIndicatorsForCategory={getIndicatorsForCategory}
            kecamatanList={kecamatanList.sort()}
            desaList={desaList}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Box>
      )}

      {/* Mobile Filter Drawer */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              height: '75vh',
              bgcolor: '#fafafa',
              border: 'none',
              boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
              borderRadius: '24px 24px 0 0'
            }
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2563eb' }}>
                🎛️ Panel Kontrol
              </Typography>
              <IconButton 
                onClick={() => setSidebarOpen(false)}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>
            {getActiveFiltersCount() > 0 && (
              <Chip 
                size="small" 
                label={`${getActiveFiltersCount()} filter aktif`}
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <FilterSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            mobile={true}
            filters={filters}
            onChange={handleFiltersChange}
            onReset={() => setFilters({
              category: 'Pendidikan',
              indicator: 'jumlah_tk',
              kecamatan: '',
              desa: ''
            })}
            categories={categories}
            getIndicatorsForCategory={getIndicatorsForCategory}
            kecamatanList={kecamatanList.sort()}
            desaList={desaList}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box sx={{ 
        flexGrow: 1,
        ml: isMobile ? 0 : '300px', // Offset for permanent sidebar on desktop
        minHeight: '100vh'
      }}>
        {/* Header */}
        <Box sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 999,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: 2
            }}>
              {/* Mobile Filter Button */}
              {isMobile && (
                <Button
                  variant="contained"
                  startIcon={<FilterList />}
                  onClick={() => setSidebarOpen(true)}
                  sx={{
                    bgcolor: '#2563eb',
                    color: 'white',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    '&:hover': { 
                      bgcolor: '#1d4ed8',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  Filter
                </Button>
              )}

              {/* Title Section */}
              <Box sx={{ 
                flex: 1, 
                textAlign: isMobile ? 'center' : 'left',
                ml: isMobile ? 0 : 2
              }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"}
                  sx={{ 
                    fontWeight: 700,
                    color: '#111827',
                    mb: 0.5
                  }}
                >
                  {getDynamicTitle()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kota Batu • 24 Desa/Kelurahan
                </Typography>
              </Box>

              {/* Refresh Button */}
              <IconButton 
                onClick={fetchData}
                disabled={loading}
                sx={{ 
                  bgcolor: 'background.paper',
                  border: '1px solid #e5e7eb',
                  '&:hover': { bgcolor: '#f9fafb' }
                }}
              >
                <Refresh />
              </IconButton>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
        {loading ? (
          <DashboardSkeleton />
        ) : viewMode === 'peta' ? (
          /* Peta Geospasial Mode */
          <Fade in={!loading} timeout={300}>
            <Box>
              <GeospatialMap />
            </Box>
          </Fade>
        ) : (
          /* Mode Analisis */
          <Fade in={!loading} timeout={300}>
            <Box>
              {/* KPI Cards Section */}
              <Box sx={{ mb: 4 }}>
                <KPICards
                  analysisData={analysisData}
                  totalVillages={filteredData.length}
                  loading={loading}
                />
              </Box>

              {/* Ringkasan Seluruh Indikator Section - Generic for ALL categories */}
              {filters.indicator === 'Semua' && (
                <>
                  {/* Use legacy IndicatorsSummary for quantitative categories (Pendidikan, Kesehatan) */}
                  {(filters.category === 'Pendidikan' || filters.category === 'Kesehatan') && (
                    <IndicatorsSummary 
                      categoryKey={filters.category}
                      data={data}
                      filteredData={filteredData}
                    />
                  )}
                  
                  {/* Use new SummaryAccordionSection for qualitative categories */}
                  {(filters.category === 'Infrastruktur & Konektivitas' || filters.category === 'Lingkungan & Kebencanaan') && (
                    <SummaryAccordionSection
                      categoryKey={filters.category}
                      data={data}
                      filteredData={filteredData}
                      filters={filters}  // Pass filters for single indicator handling
                      allowToggleAll={true}
                      accordionType="single"
                    />
                  )}
                </>
              )}

              {/* Universal Single Indicator Analysis - Same proven component as "Semua Indikator" */}
              {filters.indicator !== 'Semua' && selectedIndicatorKey && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1 
                  }}>
                    🎯 Analisis: {(() => {
                      try {
                        const indicators = getIndicatorsForCategory(filters.category) || {};
                        return indicators[selectedIndicatorKey] || selectedIndicatorKey;
                      } catch (e) {
                        console.error("getIndicatorsForCategory failed in render", e);
                        return selectedIndicatorKey;
                      }
                    })()}
                  </Typography>
                  
                  {/* Use the exact same proven UniversalIndicatorPanel from "Semua Indikator" */}
                  <UniversalIndicatorPanel
                    categoryKey={filters.category.toLowerCase()}
                    indicatorKey={selectedIndicatorKey}
                    dataset={metadata?.villages || filteredData}
                    isOpen={true}
                    loading={loading}
                  />
                </Box>
              )}

              {/* Old Charts Section removed - now handled by IndicatorDetailPanel in IndicatorsSummary */}

              {/* Enhanced Village Comparison Section - Larger & More Responsive */}
              <Box sx={{ mb: 4 }}>
                <Card 
                  elevation={0}
                  sx={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    minHeight: 600 // Make it larger
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <ComparisonView
                      villages={filteredData}
                      dataset={filteredData}
                      currentCategory={filters.category}
                    />
                  </CardContent>
                </Card>
              </Box>

              {/* Full Data Table Section - Always Visible */}
              <FullDataTable
                categoryKey={filters.category}
                rows={filteredData}
                debug={new URLSearchParams(window.location.search).has('debugTable')}
              />

              {/* Bottom Information Section */}
              <Box sx={{ mt: 6, mb: 4 }}>
                <Card 
                  elevation={0}
                  sx={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: 3,
                    bgcolor: '#f8fafc'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={4} alignItems="center">
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                            📊 Data: Podes 2024 - BPS
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Sumber data resmi terpercaya
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                            📈 Total Desa Dianalisis: {filteredData.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cakupan analisis komprehensif
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
                            🎯 Kategori: {filters.category}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Focus area analisis
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Fade>
        )}
        </Container>
      </Box>
    </Box>
    </Box>
  );
};

export default AnalysisPage;
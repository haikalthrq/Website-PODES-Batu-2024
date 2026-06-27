import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Paper,
  Divider
} from '@mui/material';
import {
  Analytics,
  Assessment,
  TrendingUp,
  LocationOn,
  Business,
  School,
  LocalHospital,
  Menu,
  PlayArrow,
  Insights,
  Map
} from '@mui/icons-material';

// Import components
import AppHeader from '../components/AppHeader';
import RankingChart from '../components/RankingChart';
import DistributionChart from '../components/DistributionChart';
import { podesService } from '../services/api';

const Dashboard = ({ setCurrentPage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Purple theme colors inspired by Pitchly
  const purpleTheme = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #4c63d2 0%, #5b21b6 100%)',
    light: '#f8fafc',
    white: '#ffffff'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await podesService.getAllVillages();
      setData(response);
    } catch (err) {
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Mock stats data
  const statsData = [
    { label: 'Total Desa/Kelurahan', value: data?.length || 24, icon: LocationOn, color: '#10b981' },
    { label: 'Fasilitas Umum', value: '89', icon: Business, color: '#f59e0b' },
    { label: 'Sekolah Aktif', value: '45', icon: School, color: '#8b5cf6' }
  ];

  const features = [
    {
      icon: Analytics,
      title: 'Analisis Data Komprehensif',
      description: 'Visualisasi data PODES 2024 dengan berbagai perspektif analisis yang mendalam'
    },
    {
      icon: Assessment,
      title: 'Dashboard Interaktif',
      description: 'Interface yang user-friendly untuk eksplorasi data dengan filter dinamis'
    },
    {
      icon: TrendingUp,
      title: 'Insight Real-time',
      description: 'Dapatkan wawasan terkini tentang kondisi desa dan kelurahan di Kota Batu'
    },
    {
      icon: LocationOn,
      title: 'Pemetaan Wilayah',
      description: 'Visualisasi geografis untuk memahami distribusi data per wilayah'
    }
  ];

  return (
    <Box sx={{ background: purpleTheme.gradient, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Reusable Navigation Header */}
      <AppHeader 
        ctaLabel="Mulai Analisis"
        onCtaClick={() => setCurrentPage('analysis')}
      />

      {/* Hero Section with Enhanced Purple Gradient */}
      <Box sx={{
        background: purpleTheme.gradient,
        color: purpleTheme.white,
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '70vh', md: '80vh' }
      }}>
        {/* Enhanced Background Pattern with Better Contrast */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 70%), 
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 60%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
        }} />
        
        {/* Semi-transparent overlay for better text readability */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(0.5px)'
        }} />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ minHeight: { xs: 'auto', md: '60vh' } }}>
            {/* Enhanced Left Content */}
            <Grid size={{ xs: 12, lg: 6 }}>
              {/* Main Headline */}
              <Typography variant="h1" sx={{ 
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.8rem', md: '4rem', lg: '4.5rem' },
                lineHeight: { xs: 1.1, md: 1.05 },
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                letterSpacing: '-0.02em'
              }}>
                Potensi Desa Kota Batu 2024
              </Typography>
              
              {/* Enhanced Subheading */}
              <Typography variant="h4" sx={{ 
                mb: 4,
                fontWeight: 600,
                fontSize: { xs: '1.3rem', md: '1.6rem' },
                lineHeight: 1.4,
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}>
                Transformasi Data Menjadi Insight Strategis
              </Typography>

              {/* Restructured Body Text with Key Benefits */}
              <Box sx={{ mb: 5 }}>
                <Typography variant="body1" sx={{ 
                  mb: 3,
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.92)',
                  maxWidth: '520px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  Platform analisis data PODES 2024 yang memungkinkan pengambil kebijakan 
                  membuat keputusan berbasis data yang lebih tepat dan strategis.
                </Typography>

                {/* Key Features as Bullet Points */}
                <Box component="ul" sx={{ 
                  listStyle: 'none', 
                  p: 0, 
                  m: 0,
                  '& li': {
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  },
                  '& li::before': {
                    content: '"✓"',
                    mr: 2,
                    color: '#10b981',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }
                }}>
                  <li>Analisis data real-time dari 24 desa di Kota Batu</li>
                  <li>Dashboard interaktif dengan visualisasi yang mudah dipahami</li>
                  <li>Laporan komprehensif untuk mendukung pengambilan keputusan</li>
                  <li>Data lengkap 4 kategori utama dengan 18 indikator pembangunan desa</li>
                </Box>
              </Box>

              {/* Enhanced Primary CTA Buttons */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center'
              }}>
                <Button 
                  variant="contained"
                  size="large"
                  startIcon={<Analytics sx={{ fontSize: '1.2rem' }} />}
                  sx={{
                    bgcolor: '#10b981',
                    color: 'white',
                    fontWeight: 800,
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.8, md: 2.2 },
                    minHeight: { xs: 56, md: 64 },
                    minWidth: { xs: 260, md: 300 },
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: { xs: '1.05rem', md: '1.15rem' },
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    '&:hover': {
                      bgcolor: '#059669',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 40px rgba(16, 185, 129, 0.5)'
                    },
                    '&:active': {
                      transform: 'translateY(-1px)'
                    }
                  }}
                  onClick={() => setCurrentPage('analysis')}
                >
                  Mulai Analisis Sekarang
                </Button>

                <Button 
                  variant="outlined"
                  size="large"
                  startIcon={<Map sx={{ fontSize: '1.2rem' }} />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    fontWeight: 700,
                    px: { xs: 4, md: 5 },
                    py: { xs: 1.8, md: 2.2 },
                    minHeight: { xs: 56, md: 64 },
                    minWidth: { xs: 260, md: 280 },
                    borderRadius: 3,
                    borderWidth: 2,
                    textTransform: 'none',
                    fontSize: { xs: '1.05rem', md: '1.15rem' },
                    backdropFilter: 'blur(4px)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      borderColor: 'white',
                      borderWidth: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3)'
                    },
                    '&:active': {
                      transform: 'translateY(-1px)'
                    }
                  }}
                  onClick={() => {
                    // Navigate to analysis page with map mode
                    if (setCurrentPage) {
                      // Store viewMode preference in sessionStorage
                      sessionStorage.setItem('viewMode', 'peta');
                      setCurrentPage('analysis');
                    }
                  }}
                >
                  Peta Geospasial
                </Button>
              </Box>
            </Grid>

            {/* Enhanced Right Content - Dashboard Preview & Stats */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Grid container spacing={{ xs: 2, md: 4 }} sx={{ height: '100%', minHeight: { xs: 400, md: 500 } }}>
                {/* Enhanced Dashboard Preview */}
                <Grid size={{ xs: 12, md: 6, lg: 7 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <Paper sx={{
                      p: 3.5,
                      borderRadius: 5,
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                      bgcolor: purpleTheme.white,
                      width: '100%',
                      maxWidth: { xs: 300, md: 320 },
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transform: { 
                        xs: 'none',
                        lg: 'perspective(1200px) rotateY(-12deg) rotateX(8deg)' 
                      },
                      '&:hover': {
                        transform: { 
                          xs: 'translateY(-4px)',
                          lg: 'perspective(1200px) rotateY(-8deg) rotateX(4deg)' 
                        },
                        transition: 'transform 0.3s ease'
                      }
                    }}>
                      {/* Enhanced Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mb: 2.5,
                        pb: 2,
                        borderBottom: '2px solid #f1f5f9'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Analytics sx={{ fontSize: 20, color: purpleTheme.primary }} />
                          <Typography variant="subtitle1" sx={{ 
                            color: '#1f2937',
                            fontWeight: 800,
                            fontSize: '1rem'
                          }}>
                            PODES Dashboard
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%',
                          bgcolor: '#10b981',
                          boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
                        }} />
                      </Box>
                      
                      {/* Enhanced Mini Stats Grid with Icons */}
                      <Grid container spacing={1.5} sx={{ mb: 3 }}>
                        {statsData.map((stat, index) => (
                          <Grid size={{ xs: 6 }} key={index}>
                            <Card sx={{ 
                              p: 1.5, 
                              textAlign: 'center',
                              bgcolor: index % 2 === 0 ? '#f8fafc' : '#fefefe',
                              border: '1px solid #e5e7eb',
                              borderRadius: 2,
                              minHeight: 72,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                borderColor: stat.color
                              }
                            }}>
                              <Box sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                bgcolor: `${stat.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 0.5
                              }}>
                                <stat.icon sx={{ 
                                  fontSize: 16, 
                                  color: stat.color
                                }} />
                              </Box>
                              <Typography variant="caption" sx={{ 
                                fontWeight: 800,
                                color: '#1f2937',
                                fontSize: '0.8rem',
                                display: 'block'
                              }}>
                                {stat.value}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                color: '#6b7280',
                                fontSize: '0.65rem',
                                fontWeight: 500
                              }}>
                                {stat.label.split(' ')[0]}
                              </Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Enhanced Mini Chart */}
                      <Box sx={{ 
                        bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: 2.5,
                        p: 2,
                        mb: 2.5,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
                          <TrendingUp sx={{ fontSize: 12, color: '#10b981' }} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'end', gap: 0.8, height: 32, mb: 1 }}>
                          {[65, 85, 45, 95, 75, 55, 80, 90].map((height, i) => (
                            <Box 
                              key={i}
                              sx={{ 
                                flex: 1,
                                height: `${height}%`,
                                bgcolor: i === 3 || i === 7 ? '#10b981' : i === 1 || i === 6 ? purpleTheme.primary : '#cbd5e1',
                                borderRadius: '2px 2px 0 0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  bgcolor: '#10b981',
                                  transform: 'scaleY(1.1)'
                                }
                              }}
                            />
                          ))}
                        </Box>

                      </Box>

                      {/* Enhanced Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained"
                          size="small"
                          startIcon={<Assessment sx={{ fontSize: 14 }} />}
                          sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            fontWeight: 700,
                            px: 1.5,
                            py: 0.8,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            flex: 1,
                            minHeight: 32,
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                            }
                          }}
                        >
                          Detail
                        </Button>
                        <Button 
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: '#cbd5e1',
                            color: '#64748b',
                            fontWeight: 600,
                            px: 1.5,
                            py: 0.8,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            flex: 1,
                            minHeight: 32,
                            '&:hover': {
                              borderColor: '#94a3b8',
                              backgroundColor: '#f8fafc',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          Export
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>

                {/* Enhanced Right Side - Exploration Panel */}
                <Grid size={{ xs: 12, md: 6, lg: 5 }}>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: 3
                  }}>
                    {/* Enhanced exploration panel */}
                    <Paper sx={{
                      p: 3.5,
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: 4,
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(8px)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Subtle background pattern */}
                      <Box sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
                        borderRadius: '50%'
                      }} />
                      
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Insights sx={{ fontSize: 18, color: 'white' }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>
                            Mulai Eksplorasi
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 3, lineHeight: 1.6 }}>
                          Pilih fokus analisis dan temukan insight dari data PODES 2024 Kota Batu. 
                          Dashboard interaktif siap membantu analisis Anda.
                        </Typography>
                        
                        {/* Enhanced category chips */}
                        <Stack 
                          direction={{ xs: 'column', sm: 'row' }} 
                          spacing={1.5} 
                          sx={{ 
                            mb: 3, 
                            flexWrap: 'wrap', 
                            gap: 1,
                            alignItems: { xs: 'stretch', sm: 'center' }
                          }}
                        >
                          <Chip 
                            icon={<Business sx={{ fontSize: 14 }} />}
                            label="Fasilitas" 
                            size="small" 
                            sx={{ 
                              bgcolor: '#eef2ff', 
                              color: '#4f46e5', 
                              fontWeight: 700,
                              borderRadius: 2,
                              '&:hover': { bgcolor: '#e0e7ff' }
                            }} 
                          />
                          <Chip 
                            icon={<School sx={{ fontSize: 14 }} />}
                            label="Pendidikan" 
                            size="small" 
                            sx={{ 
                              bgcolor: '#f5f3ff', 
                              color: '#7c3aed', 
                              fontWeight: 700,
                              borderRadius: 2,
                              '&:hover': { bgcolor: '#ede9fe' }
                            }} 
                          />
                          <Chip 
                            icon={<LocalHospital sx={{ fontSize: 14 }} />}
                            label="Kesehatan" 
                            size="small" 
                            sx={{ 
                              bgcolor: '#ecfeff', 
                              color: '#0891b2', 
                              fontWeight: 700,
                              borderRadius: 2,
                              '&:hover': { bgcolor: '#cffafe' }
                            }} 
                          />
                        </Stack>
                        
                        {/* Enhanced sparkline */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
                            <TrendingUp sx={{ fontSize: 14, color: '#10b981' }} />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 40, p: 1, bgcolor: '#f8fafc', borderRadius: 2 }}>
                            {[3, 5, 2, 6, 4, 3, 7, 5, 4, 8].map((n, i) => (
                              <Box key={i} sx={{
                                width: 12,
                                height: `${n * 4}px`,
                                borderRadius: 1,
                                background: i === 9 ? 'linear-gradient(to top, #10b981, #34d399)' : 
                                           i === 6 ? 'linear-gradient(to top, #7c3aed, #a855f7)' : '#cbd5e1',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  background: 'linear-gradient(to top, #10b981, #34d399)',
                                  transform: 'scaleY(1.1)'
                                }
                              }} />
                            ))}
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2.5, borderColor: '#e2e8f0' }} />
                        
                        {/* Enhanced sample table */}
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <LocationOn sx={{ fontSize: 16, color: '#7c3aed' }} />
                            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, fontSize: '0.8rem' }}>
                              Sampel Data Desa (3 Teratas)
                            </Typography>
                          </Box>
                          
                          <Table 
                            size="small" 
                            sx={{ 
                              borderRadius: 3, 
                              overflow: 'hidden', 
                              border: '1px solid #e2e8f0',
                              bgcolor: '#ffffff'
                            }}
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ 
                                  fontSize: '0.8rem', 
                                  fontWeight: 800, 
                                  color: '#1e293b', 
                                  bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                                  borderBottom: '2px solid #e2e8f0',
                                  py: 1.2
                                }}>
                                  Desa
                                </TableCell>
                                <TableCell sx={{ 
                                  fontSize: '0.8rem', 
                                  fontWeight: 800, 
                                  color: '#1e293b', 
                                  bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                                  borderBottom: '2px solid #e2e8f0',
                                  py: 1.2
                                }}>
                                  Kec.
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                  fontSize: '0.8rem', 
                                  fontWeight: 800, 
                                  color: '#1e293b', 
                                  bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                                  borderBottom: '2px solid #e2e8f0',
                                  py: 1.2
                                }}>
                                  <School sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                  SD
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                  fontSize: '0.8rem', 
                                  fontWeight: 800, 
                                  color: '#1e293b', 
                                  bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                                  borderBottom: '2px solid #e2e8f0',
                                  py: 1.2
                                }}>
                                  📡 BTS
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(Array.isArray(data) ? data.slice(0, 3) : [
                                { nama_desa: 'Oro-oro Ombo', nama_kecamatan: 'BATU', jumlah_sd: 3, jumlah_bts: 6 },
                                { nama_desa: 'Temas', nama_kecamatan: 'BATU', jumlah_sd: 2, jumlah_bts: 1 },
                                { nama_desa: 'Sisir', nama_kecamatan: 'BATU', jumlah_sd: 6, jumlah_bts: 4 }
                              ]).map((row, idx) => (
                                <TableRow 
                                  key={idx} 
                                  hover
                                  sx={{ 
                                    '&:nth-of-type(odd)': { bgcolor: '#fafbfc' },
                                    '&:hover': { bgcolor: '#f0f9ff' },
                                    transition: 'background-color 0.2s ease'
                                  }}
                                >
                                  <TableCell sx={{ 
                                    fontSize: '0.85rem', 
                                    color: '#1e293b', 
                                    py: 1.2,
                                    fontWeight: 600
                                  }}>
                                    {row?.nama_desa ?? '-'}
                                  </TableCell>
                                  <TableCell sx={{ 
                                    fontSize: '0.85rem', 
                                    color: '#64748b', 
                                    py: 1.2,
                                    fontWeight: 500
                                  }}>
                                    {row?.nama_kecamatan ?? '-'}
                                  </TableCell>
                                  <TableCell align="right" sx={{ 
                                    fontSize: '0.85rem', 
                                    color: '#0f766e', 
                                    py: 1.2,
                                    fontWeight: 700
                                  }}>
                                    {row?.jumlah_sd ?? '-'}
                                  </TableCell>
                                  <TableCell align="right" sx={{ 
                                    fontSize: '0.85rem', 
                                    color: '#7c3aed', 
                                    py: 1.2,
                                    fontWeight: 700
                                  }}>
                                    {row?.jumlah_bts ?? '-'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Box>
                    </Paper>

                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Platform Features Section */}
      <Box sx={{ bgcolor: purpleTheme.white, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  fontWeight: 800,
                  color: '#1f2937',
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  mb: 2
                }}
              >
                ✨ Fitur Utama Platform
              </Typography>
            </Box>

            {/* Main Categories Grid */}
            <Grid container spacing={3}>
              {/* Pendidikan */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          📚 Pendidikan
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Analisis fasilitas pendidikan: TK, SD, SMP, SMA
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Kesehatan */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          🏥 Kesehatan
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Infrastruktur kesehatan: RS, Puskesmas
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Infrastruktur */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          🌐 Infrastruktur
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Konektivitas: Sinyal Internet, Angkutan Umum
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Lingkungan & Kebencanaan */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          ⚠️ Lingkungan & Kebencanaan
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Mitigasi: Peringatan Dini, Alat & Rambu Keselamatan, Pengelolaan Sampah
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Data Coverage Stats */}
            <Box sx={{ 
              bgcolor: '#f8fafc', 
              borderRadius: 3, 
              p: 4, 
              border: '1px solid #e5e7eb',
              mt: 4
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  textAlign: 'center', 
                  mb: 3,
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                📊 Cakupan Data Podes 2024
              </Typography>
              
              <Grid container spacing={4} justifyContent="center">
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: purpleTheme.primary,
                      mb: 1
                    }}>
                      24
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      Total Desa
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: purpleTheme.primary,
                      mb: 1
                    }}>
                      3
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      Total Kecamatan
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: purpleTheme.primary,
                      mb: 1
                    }}>
                      4
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      Kategori Analisis
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: purpleTheme.primary,
                      mb: 1
                    }}>
                      18
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      Total Indikator
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Bottom Info */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 4,
                mt: 4,
                pt: 3,
                borderTop: '1px solid #e5e7eb'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    📋 Sumber Data:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937', fontWeight: 600 }}>
                    Survey Podes 2024 - BPS
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    🏛️ Pengelola:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937', fontWeight: 600 }}>
                    Badan Pusat Statistik Kota Batu
                  </Typography>
                </Box>
                

              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  Assessment,
  LocationOn,
  PlayArrow,
  Insights
} from '@mui/icons-material';

const LandingPage = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    if (setCurrentPage) {
      setCurrentPage('landing');
    }
  }, [setCurrentPage]);

  const purpleTheme = {
    primary: '#7c3aed',
    secondary: '#a855f7',
    light: '#f3e8ff',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #4c1d95 100%)',
    white: '#ffffff'
  };

  const features = [
    { icon: <Analytics />, title: 'Dashboard Interaktif', desc: 'Visualisasi data yang mudah dipahami' },
    { icon: <TrendingUp />, title: 'Analisis Real-time', desc: 'Data terkini dari 24 desa' },
    { icon: <Assessment />, title: 'Laporan Komprehensif', desc: 'Insight mendalam untuk keputusan' },
    { icon: <LocationOn />, title: 'Pemetaan Wilayah', desc: 'Visualisasi geografis interaktif' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header Navigation */}
      <Box sx={{ 
        bgcolor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            
            <Button 
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
                background: purpleTheme.gradient,
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)'
                }
              }}
            >
              Mulai Analisis
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ 
        background: purpleTheme.gradient,
        color: 'white',
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 8, md: 16 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid xs={12} md={6}>
              <Stack spacing={4}>
                <Box>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.1,
                      mb: 3
                    }}
                  >
                    Potensi Desa Kota Batu 2024
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      opacity: 0.9,
                      fontSize: '1.25rem',
                      fontWeight: 400,
                      lineHeight: 1.6
                    }}
                  >
                    Platform analisis data PODES 2024 Kota Batu yang membantu Anda mengubah data statistik menjadi wawasan yang actionable untuk pengambilan keputusan yang lebih baik.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      bgcolor: 'white',
                      color: purpleTheme.primary,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'grey.100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Mulai Eksplorasi
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Insights />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </Stack>

                {/* Stats Row */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={4}
                  sx={{ pt: 2 }}
                >
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, opacity: 0.9 }}>
                      24
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Desa/Kelurahan
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, opacity: 0.9 }}>
                      3
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Kecamatan
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, opacity: 0.9 }}>
                      2024
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Data Terkini
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* Right Side - Dashboard Preview Cards */}
            <Grid xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                position: 'relative'
              }}>
                {/* Main Dashboard Preview Card */}
                <Card sx={{ 
                  width: '100%',
                  maxWidth: 400,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                  transform: 'rotate(-2deg)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(0deg) scale(1.02)'
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                          PODES Dashboard
                        </Typography>
                        <Chip 
                          label="Live" 
                          size="small" 
                          sx={{ 
                            bgcolor: '#10b981', 
                            color: 'white',
                            fontWeight: 600
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ 
                          flex: 1, 
                          bgcolor: '#f3f4f6', 
                          borderRadius: 2, 
                          p: 2, 
                          textAlign: 'center' 
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: purpleTheme.primary }}>
                            24
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            Total
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          flex: 1, 
                          bgcolor: '#f3f4f6', 
                          borderRadius: 2, 
                          p: 2, 
                          textAlign: 'center' 
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: purpleTheme.primary }}>
                            89
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            Fasilitas
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        bgcolor: '#fafafa', 
                        borderRadius: 2, 
                        p: 3,
                        border: '1px solid #e5e7eb'
                      }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                          Analisis Data
                        </Typography>
                        <Box sx={{ 
                          height: 40, 
                          bgcolor: purpleTheme.primary, 
                          borderRadius: 1,
                          background: `linear-gradient(90deg, ${purpleTheme.primary} 0%, ${purpleTheme.secondary} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                            📊 Visualisasi Interaktif
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayArrow />}
                        sx={{
                          background: purpleTheme.gradient,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Detail
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Secondary Card */}
                <Card sx={{ 
                  width: '90%',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                  transform: 'rotate(1deg) translateY(-20px)',
                  position: 'absolute',
                  top: 50,
                  right: -20,
                  zIndex: -1
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Mulai Eksplorasi
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Pilih fokus analisis dan lihat ringkasan cepat. Simpel dan to the point.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label="Fasilitas" size="small" sx={{ bgcolor: '#e0e7ff' }} />
                        <Chip label="Pendidikan" size="small" sx={{ bgcolor: '#fef3c7' }} />
                        <Chip label="Kesehatan" size="small" sx={{ bgcolor: '#dcfce7' }} />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  fontWeight: 800,
                  color: '#1f2937',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Mengapa Pilih Dashboard PODES Kami?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#6b7280',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Solusi terdepan untuk analisis data PODES dengan teknologi modern dan user experience terbaik
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid #f3f4f6',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 60px rgba(124, 58, 237, 0.15)',
                      borderColor: purpleTheme.primary
                    }
                  }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Stack spacing={3} alignItems="center">
                        <Avatar sx={{ 
                          bgcolor: purpleTheme.light,
                          color: purpleTheme.primary,
                          width: 64,
                          height: 64
                        }}>
                          {feature.icon}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.6 }}>
                          {feature.desc}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Platform Features Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  fontWeight: 800,
                  color: '#1f2937',
                  fontSize: { xs: '2rem', md: '2.5rem' },
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
                
                <Grid item xs={6} sm={3}>
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
                
                <Grid item xs={6} sm={3}>
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
                    Pemerintah Kota Batu
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    🎯 Manfaat:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1f2937', fontWeight: 600 }}>
                    Perencanaan berbasis data faktual untuk pelayanan publik berkualitas
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid xs={12} md={6}>
              <Stack spacing={4}>
                <Typography 
                  variant="h3" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 800,
                    color: '#1f2937',
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  Tentang PODES 2024
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8, 
                    color: '#4b5563'
                  }}
                >
                  Pendataan Potensi Desa (PODES) 2024 merupakan sensus yang mengumpulkan data 
                  karakteristik desa/kelurahan di seluruh Indonesia. Dashboard ini menyajikan 
                  visualisasi khusus untuk 24 desa/kelurahan di Kota Batu.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8, 
                    color: '#4b5563'
                  }}
                >
                  Dengan teknologi web modern, data PODES disajikan dalam format yang mudah dipahami 
                  dan dianalisis untuk mendukung pengambilan keputusan berbasis data.
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Assessment />}
                    sx={{
                      borderColor: purpleTheme.primary,
                      color: purpleTheme.primary,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: purpleTheme.primary,
                        bgcolor: purpleTheme.light
                      }
                    }}
                  >
                    Lihat Dokumentasi
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Card sx={{ 
                  bgcolor: 'white',
                  borderRadius: 4,
                  boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  maxWidth: 400,
                  width: '100%'
                }}>
                  <Box sx={{ 
                    bgcolor: purpleTheme.primary,
                    color: 'white',
                    p: 3,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Kota Batu
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Data untuk Pembangunan Desa
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          Total Desa/Kelurahan
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          24
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          Kecamatan
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          3
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          Status Data
                        </Typography>
                        <Chip 
                          label="Terkini 2024" 
                          size="small" 
                          sx={{ 
                            bgcolor: '#dcfce7', 
                            color: '#16a34a',
                            fontWeight: 600
                          }} 
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        background: purpleTheme.gradient,
        color: 'white', 
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={4} alignItems="center">
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Siap Mengeksplorasi Data PODES?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9,
                maxWidth: '500px',
                lineHeight: 1.6
              }}
            >
              Mulai analisis mendalam dengan dashboard interaktif yang telah kami siapkan
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  bgcolor: 'white',
                  color: purpleTheme.primary,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
                  }
                }}
              >
                Mulai Sekarang
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Assessment />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Lihat Demo
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box sx={{ bgcolor: '#1f2937', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2024 Badan Pusat Statistik Kota Batu
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              PODES 2024 • Data untuk Pembangunan Desa
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Typography, Card, CardContent, CardHeader } from "@mui/material";
import ApexDonut from './viz/ApexDonut';
import ApexBar from './viz/ApexBar';
import { getInfrastructureColors } from './charts';
import { StatCard } from './common/ChartCard';
import IndicatorGrid, { StatsGrid, IndicatorSection } from './layout/IndicatorGrid';
import ChartCard from './common/ChartCard';
// New robust chart components
import DonutWithLegend from './charts/DonutWithLegend';
import BarGroupedStacked from './charts/BarGroupedStacked';
import Histogram from './charts/Histogram';

import { qualitativeCategoryCounts, histogramCounts, getDominantCategory, getDominantBin } from '../utils/infra/distribution';
import { getCategoryColor, getBinColor, SIGNAL_COLORS, INTERNET_COLORS, BINARY_COLORS } from './theme/chartColors';
import { getIndicatorConfig } from '../config/infra/indicatorRegistry';

const PALETTE = ["#22c55e","#10b981","#60a5fa","#818cf8","#f59e0b","#ef4444","#8b5cf6"];

// Percentage formatter helper
const fmtPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "-";
  const n = typeof val === "string" ? parseFloat(val) : Number(val);
  if (!isFinite(n)) return "-";
  // Only show 2 decimals when not an integer
  const out = Number.isInteger(n) ? n.toString() : n.toFixed(2);
  return `${out}%`;
};

// Get visualization specification for each indicator
// Try to use registry config first, then fallback to local specs
const getVizSpec = (indicatorKey, config = null) => {
  // If config is provided from registry, use it
  if (config) {
    return {
      mode: config.type || 'qualitative',
      categories: config.categories || [],
      dataKey: config.dataKey,
      displayName: config.title
    };
  }

  // Fallback to existing local specifications (must match actual data)
  const specs = {
    'kualitas_sinyal_seluler': {
      mode: 'qualitative',
      categories: ['Sangat Kuat', 'Kuat'], // Only these 2 exist in actual data
      dataKey: 'kekuatan_sinyal',
      displayName: 'Kualitas Sinyal Seluler'
    },
    'jenis_akses_internet': {
      mode: 'qualitative', 
      categories: ['5G/4G/LTE'], // Only this category exists in actual data
      dataKey: 'jenis_sinyal_internet',
      displayName: 'Jenis Akses Internet'
    },
    'penerangan_jalan_tenaga_surya': {
      mode: 'qualitative',
      categories: ['Ada', 'Tidak Ada'], // Confirmed correct
      dataKey: 'status_penerangan_jalan_surya', 
      displayName: 'Penerangan Jalan Tenaga Surya'
    },
    'penerangan_jalan_utama': {
      mode: 'qualitative',
      categories: ['Ada, sebagian besar', 'Ada, sebagian kecil'], // Only these 2 exist in actual data
      dataKey: 'status_penerangan_jalan_utama',
      displayName: 'Penerangan Jalan Utama'
    }
  };
  
  return specs[indicatorKey] || {
    mode: 'qualitative',
    categories: [],
    dataKey: indicatorKey,
    displayName: indicatorKey
  };
};

// Build stacked chart data for kecamatan distribution
const buildStackedByKecamatan = (distByKecamatan, orderedKecamatan = ["BATU", "BUMIAJI", "JUNREJO"]) => {
  if (!distByKecamatan) return { categories: orderedKecamatan, series: [] };
  
  // Collect all category keys (e.g., "Kuat", "Sangat Kuat")
  const catSet = new Set();
  orderedKecamatan.forEach(kec => {
    const row = distByKecamatan[kec] || {};
    Object.keys(row).forEach(k => catSet.add(k));
  });
  
  const catList = Array.from(catSet);
  const series = catList.map(cat => ({
    name: cat,
    data: orderedKecamatan.map(kec => {
      const row = distByKecamatan[kec] || {};
      const v = row[cat];
      return Number.isFinite(+v) ? +v : 0;
    })
  }));
  
  return { categories: orderedKecamatan, series };
};

const EnhancedInfrastructureIndicators = ({ 
  indicatorKey, 
  indicatorData,
  config,
  villageData,
  onChartResize,
  isAccordionOpen = false,
  accordionId
}) => {
  const [shouldRenderCharts, setShouldRenderCharts] = React.useState(false);
  const [renderKey, setRenderKey] = React.useState(0);
  const containerRef = React.useRef(null);
  
  // Use registry config if available, otherwise fallback to indicatorData
  const vizSpec = getVizSpec(indicatorKey, config);
  
  // Helper function to get display label (shorter version for charts)
  const getDisplayLabel = (originalLabel) => {
    if (config?.displayLabels && config.displayLabels[originalLabel]) {
      return config.displayLabels[originalLabel];
    }
    return originalLabel;
  };
  
  console.log('EnhancedInfrastructureIndicators:', { 
    indicatorKey, 
    isAccordionOpen,
    accordionId,
    hasConfig: !!config,
    configCharts: config?.charts,
    vizSpec,
    dataLength: villageData?.length,
    villageDataSample: villageData?.slice(0, 2)
  });

  // Chart rendering logic based on accordion state
  React.useEffect(() => {
    if (isAccordionOpen) {
      // Small delay to ensure accordion is fully opened
      const timeout = setTimeout(() => {
        console.log(`Enabling chart rendering for ${accordionId}`);
        setShouldRenderCharts(true);
        setRenderKey(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setShouldRenderCharts(false);
    }
  }, [isAccordionOpen, accordionId]);

  if (!villageData || villageData.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Data tidak tersedia untuk analisis
        </Typography>
      </Box>
    );
  }

  // Helper functions
  const getIndicatorColors = (chartData) => {
    if (!chartData || chartData.length === 0) return [];
    const categories = chartData.map(item => item.name);
    return getInfrastructureColors(getIndicatorType(indicatorKey), categories);
  };

  const getIndicatorType = (key) => {
    switch (key) {
      case 'kualitas_sinyal_internet':
        return 'signal_strength';
      case 'jenis_akses_internet':
        return 'internet_type';
      case 'penerangan_jalan_tenaga_surya':
        return 'availability';
      case 'penerangan_jalan_utama':
        return 'coverage';
      default:
        return 'qualitative';
    }
  };

  const getIndicatorUnit = (key) => {
    return 'desa';
  };

  const unit = getIndicatorUnit(indicatorKey);

  // Render stats section using new data transformation
  const renderStats = () => {
    if (!villageData || villageData.length === 0) {
      return null;
    }

    const vizSpec = getVizSpec(indicatorKey, config);
    const statEntries = [];

    // Calculate stats based on mode
    if (vizSpec.mode === 'qualitative') {
      const dominant = getDominantCategory(villageData, vizSpec.dataKey);
      const totalData = qualitativeCategoryCounts(villageData, vizSpec.dataKey, vizSpec.categories)
        .reduce((sum, item) => sum + item.count, 0);
      const categories = qualitativeCategoryCounts(villageData, vizSpec.dataKey, vizSpec.categories)
        .filter(item => item.count > 0).length;

      statEntries.push(
        ['total', { label: 'Total Desa', value: villageData.length }],
        ['totalData', { label: 'Desa dengan Data', value: totalData }],
        ['dominantCategory', { label: 'Kategori Dominan', value: dominant.category }],
        ['dominantPercentage', { label: 'Persentase Dominan', value: dominant.percentage }],
        ['categories', { label: 'Jumlah Kategori', value: categories }]
      );
    }

    console.log('Generated stat entries:', statEntries);

    if (statEntries.length === 0) {
      return null;
    }

    return (
      <IndicatorSection title="📊 Statistik Kunci">
        <StatsGrid>
          {statEntries.map(([key, stat], index) => (
            <StatCard
              key={key}
              title={stat.label}
              value={formatStatValue(stat.value, key)}
              icon={getStatIcon(key)}
              color={getStatColor(key, index)}
            />
          ))}
        </StatsGrid>
      </IndicatorSection>
    );
  };

  const renderCharts = () => {
    if (!villageData || villageData.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Tidak ada data desa tersedia
          </Typography>
        </Box>
      );
    }

    console.log('🚀 RENDERING INFRASTRUCTURE CHARTS (NEW SYSTEM):', indicatorKey);
    console.log('📝 Using config from registry:', config);
    console.log('📊 VizSpec generated:', vizSpec);
    console.log('📋 Village data sample:', villageData?.slice(0, 2).map(v => ({
      nama_desa: v.nama_desa,
      kecamatan: v.kecamatan, 
      [vizSpec.dataKey]: v[vizSpec.dataKey]
    })));
    console.log('✅ THIS SHOULD SHOW DONUT + STACKED BAR, NOT HORIZONTAL BARS');

    return (
      <IndicatorSection title="� Visualisasi Data">
        {/* Custom BTS Layout - More Spacious */}
        {false ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
            {/* Key Insights Section - Prominent */}
            <Card className="viz-card" sx={{ 
              border: '2px solid #e3f2fd',
              backgroundColor: '#f8fbff'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 600, 
                  color: 'primary.main',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontSize: '1.4rem'
                }}>
                  🏗️ Ringkasan Utama - Tower BTS
                </Typography>
                <ZeroBTSHighlight 
                  rows={villageData} 
                  valueKey="bts_di_wilayah_desa"
                  height={200}
                />
              </CardContent>
            </Card>

            {/* Main Charts Grid - 2 columns for better spacing */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: 4
            }}>
              {/* Coverage Distribution */}
              <Card className="viz-card" sx={{ height: 'fit-content' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    color: 'text.primary'
                  }}>
                    📊 Distribusi Cakupan BTS
                  </Typography>
                  <DonutWithLegend
                    title=""
                    data={histogramCounts(villageData, vizSpec.dataKey, vizSpec.bins)
                      .map((item, index) => {
                        const isZero = item.bucket === '0';
                        return {
                          label: isZero ? 'Tanpa BTS' : item.bucket === '5+' ? '5+ BTS' : `${item.bucket} BTS`,
                          value: item.count,
                          color: isZero ? '#ff5722' : index === 1 ? '#ffc107' : '#4caf50'
                        };
                      })}
                    height={320}
                    showPercentages={true}
                  />
                </CardContent>
              </Card>

              {/* BTS per Kecamatan */}
              <Card className="viz-card" sx={{ height: 'fit-content' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    color: 'text.primary'
                  }}>
                    📍 Total BTS per Kecamatan
                  </Typography>
                  <BTSPerKecamatan 
                    rows={villageData} 
                    valueKey="bts_di_wilayah_desa"
                    height={320}
                  />
                </CardContent>
              </Card>
            </Box>

            {/* Optional detailed section - collapsible and less prominent */}
            <Card className="viz-card" sx={{ 
              mt: 2,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fafafa'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ 
                  borderTop: '2px solid', 
                  borderColor: 'divider', 
                  pt: 3 
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: 'text.secondary',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    � Detail Distribusi (Opsional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                    Histogram menunjukkan distribusi detail jumlah BTS per desa. Data menunjukkan sebagian besar desa memiliki 0-3 BTS.
                  </Typography>
                  <Histogram
                    title=""
                    rows={villageData}
                    valueKey="bts_di_wilayah_desa"
                    bins={[0, 1, 2, 3, 4, 5]}
                    height={300}
                    xAxisLabel="Jumlah BTS per Desa"
                    yAxisLabel="Jumlah Desa"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <IndicatorGrid>
            {/* Left: Donut Chart */}
            <Card className="viz-card" sx={{ height: 'fit-content' }}>
              <CardContent>
                {vizSpec.mode === 'qualitative' ? (
                  <DonutWithLegend
                    title={`Distribusi ${vizSpec.displayName}`}
                    data={qualitativeCategoryCounts(villageData, vizSpec.dataKey, vizSpec.categories)
                      .map(item => ({
                        label: getDisplayLabel(item.category), // Use shorter display label
                        value: item.count,
                        color: getCategoryColor(item.category, 0) // Use original category for color mapping
                      }))}
                    height={320}
                    showPercentages={true}
                  />
                ) : (
                  <DonutWithLegend
                    title={`Distribusi ${vizSpec.displayName}`}
                    data={histogramCounts(villageData, vizSpec.dataKey, vizSpec.bins)
                      .map((item, index) => ({
                        label: item.bucket === '5+' ? '5+ BTS' : `${item.bucket} BTS`,
                        value: item.count,
                        color: getBinColor(index)
                      }))}
                    height={320}
                    showPercentages={true}
                  />
                )}
              </CardContent>
            </Card>

            {/* Right: Per-Kecamatan Distribution */}
            <Card className="viz-card" sx={{ height: 'fit-content' }}>
              <CardContent>
                <BarGroupedStacked
                  title="Distribusi per Kecamatan"
                  mode={vizSpec.mode}
                  rows={villageData}
                  valueKey={vizSpec.dataKey}
                  categories={vizSpec.categories}
                  bins={vizSpec.bins}
                  displayLabels={config?.displayLabels} // Pass display labels for shorter text
                  height={320}
                />
              </CardContent>
            </Card>
          </IndicatorGrid>
        )}
      </IndicatorSection>
    );
  };

  const renderChart = (chartConfig, colors) => {
    const { type, data: chartData, title, ...chartProps } = chartConfig;

    const debugLog = (...args) => {
      if (import.meta.env?.VITE_VIZ_DEBUG === 'true') {
        console.debug('[EnhancedInfrastructureIndicators]', ...args);
      }
    };

    debugLog('Rendering chart:', { 
      type, 
      title, 
      dataLength: chartData?.length || 0,
      visualizationData
    });

    // Special handling for "Distribusi per Kecamatan" - use stacked bar chart
    if (title && title.toLowerCase().includes('kecamatan')) {
      const distByKecamatan = visualizationData?.distributionByKecamatan || 
                              visualizationData?.distribution_by_kecamatan ||
                              {};
      
      debugLog('Kecamatan distribution data:', distByKecamatan);
      
      const { categories: kecCats, series: kecSeries } = buildStackedByKecamatan(distByKecamatan);
      
      const kecOptions = {
        chart: { 
          type: "bar", 
          stacked: true, 
          toolbar: { show: false },
          background: "transparent"
        },
        plotOptions: { 
          bar: { 
            horizontal: false, 
            columnWidth: "55%", 
            borderRadius: 6,
            borderRadiusApplication: "end"
          } 
        },
        xaxis: { 
          categories: kecCats, 
          title: { text: "Kecamatan" },
          labels: {
            style: { colors: "#334155", fontSize: "12px" }
          }
        },
        yaxis: { 
          title: { text: "Jumlah Desa" }, 
          min: 0, 
          forceNiceScale: true,
          labels: {
            style: { colors: "#334155", fontSize: "12px" }
          }
        },
        dataLabels: { 
          enabled: true,
          style: { colors: ["#ffffff"], fontSize: "11px", fontWeight: "bold" }
        },
        legend: { 
          show: true, 
          position: "right",
          fontSize: "12px",
          markers: { radius: 12 },
          labels: { colors: "#334155" }
        },
        colors: PALETTE,
        tooltip: { 
          y: { formatter: (val) => (Number.isFinite(val) ? `${val} desa` : "0 desa") } 
        },
        grid: { strokeDashArray: 4, borderColor: "#e2e8f0" },
        title: {
          text: title,
          align: "left",
          style: {
            fontSize: "16px",
            fontWeight: 600,
            color: "#1e293b"
          }
        }
      };

      return (
        <Box sx={{ width: '100%', height: 350 }}>
          <ReactApexChart 
            options={kecOptions} 
            series={kecSeries} 
            type="bar" 
            height={350} 
          />
        </Box>
      );
    }

    // Regular chart handling
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center', minHeight: 320 }}>
          <Typography color="text.secondary">
            Tidak ada data untuk ditampilkan
          </Typography>
        </Box>
      );
    }

    // Extract labels and values from data
    const labels = chartData.map(item => item.name || item.label || 'Unknown');
    const values = chartData.map(item => item.value || item.count || 0);

    switch (type) {
      case 'pie':
      case 'donut':
        const donutOptions = {
          chart: { type: "donut", background: "transparent" },
          labels: labels,
          legend: { 
            show: true, 
            position: "right",
            fontSize: "12px",
            markers: { radius: 12 },
            labels: { colors: "#334155" }
          },
          colors: PALETTE,
          dataLabels: { 
            enabled: true, 
            formatter: (val) => `${val.toFixed(1)}%`,
            style: { colors: ["#ffffff"], fontSize: "11px", fontWeight: "bold" }
          },
          tooltip: {
            y: { 
              formatter: (val, { seriesIndex }) => {
                const rawCount = values[seriesIndex];
                return Number.isFinite(rawCount) ? `${rawCount} desa` : val;
              }
            }
          },
          stroke: { width: 1, colors: ["#ffffff"] },
          plotOptions: {
            pie: {
              donut: {
                size: "68%",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "Total",
                    formatter: () => values.reduce((a, b) => a + b, 0)
                  }
                }
              }
            }
          },
          title: {
            text: title,
            align: "left",
            style: {
              fontSize: "16px",
              fontWeight: 600,
              color: "#1e293b"
            }
          }
        };

        return (
          <Box sx={{ width: '100%', height: 340 }}>
            <ReactApexChart 
              options={donutOptions} 
              series={values} 
              type="donut" 
              height={340} 
            />
          </Box>
        );
      
      case 'bar':
        const rankOptions = {
          chart: { 
            type: "bar", 
            toolbar: { show: false },
            background: "transparent"
          },
          plotOptions: { 
            bar: { 
              horizontal: false, 
              columnWidth: "45%", 
              borderRadius: 6,
              borderRadiusApplication: "end"
            } 
          },
          xaxis: { 
            categories: labels,
            labels: {
              style: { colors: "#334155", fontSize: "12px" }
            }
          },
          yaxis: { 
            title: { text: "Jumlah Desa" },
            labels: {
              style: { colors: "#334155", fontSize: "12px" }
            }
          },
          legend: { 
            show: true, 
            position: "right",
            fontSize: "12px",
            markers: { radius: 12 },
            labels: { colors: "#334155" }
          },
          colors: PALETTE,
          dataLabels: { 
            enabled: true,
            style: { colors: ["#ffffff"], fontSize: "11px", fontWeight: "bold" }
          },
          grid: { strokeDashArray: 4, borderColor: "#e2e8f0" },
          title: {
            text: title,
            align: "left",
            style: {
              fontSize: "16px",
              fontWeight: 600,
              color: "#1e293b"
            }
          }
        };

        return (
          <Box sx={{ width: '100%', height: 360 }}>
            <ReactApexChart 
              options={rankOptions} 
              series={[{ name: "Jumlah Desa", data: values }]} 
              type="bar" 
              height={360} 
            />
          </Box>
        );
      
      case 'distribution':
        // For distribution charts, use horizontal bar with limited height
        const distOptions = {
          chart: { 
            type: "bar", 
            toolbar: { show: false },
            background: "transparent"
          },
          plotOptions: { 
            bar: { 
              horizontal: true, 
              borderRadius: 6,
              borderRadiusApplication: "end"
            } 
          },
          xaxis: { 
            title: { text: "Jumlah Desa" },
            labels: {
              style: { colors: "#334155", fontSize: "12px" }
            }
          },
          yaxis: { 
            categories: labels,
            labels: {
              style: { colors: "#334155", fontSize: "12px" }
            }
          },
          legend: { 
            show: true, 
            position: "right",
            fontSize: "12px",
            markers: { radius: 12 },
            labels: { colors: "#334155" }
          },
          colors: PALETTE,
          dataLabels: { 
            enabled: true,
            style: { colors: ["#ffffff"], fontSize: "11px", fontWeight: "bold" }
          },
          grid: { strokeDashArray: 4, borderColor: "#e2e8f0" },
          title: {
            text: title,
            align: "left",
            style: {
              fontSize: "16px",
              fontWeight: 600,
              color: "#1e293b"
            }
          }
        };

        const distHeight = Math.min(400, Math.max(300, labels.length * 35));
        
        return (
          <Box sx={{ width: '100%', height: distHeight }}>
            <ReactApexChart 
              options={distOptions} 
              series={[{ name: unit || "Jumlah", data: values }]} 
              type="bar" 
              height={distHeight} 
            />
          </Box>
        );
      
      default:
        debugLog('Unsupported chart type:', type);
        return (
          <Box sx={{ p: 3, textAlign: 'center', minHeight: 320 }}>
            <Typography color="text.secondary">
              Chart type "{type}" not supported
            </Typography>
          </Box>
        );
    }
  };

  // Helper functions for stats with improved percentage formatting
  const formatStatValue = (value, key) => {
    // Handle null/undefined values first
    if (value === null || value === undefined) return "-";
    
    // For dominant category (string values), return as-is but NOT for dominantPercentage
    if (key && key === 'dominantCategory') {
      return String(value);
    }
    
    // Improved percentage formatting - specifically handle dominantPercentage
    if (key && (key.includes('percentage') || key.includes('Percentage') || key === 'pct' || key === 'dominantPercentage')) {
      const n = typeof value === "string" ? parseFloat(value) : Number(value);
      if (!isFinite(n)) return "-";
      
      // Round to 2 decimal places, but show no decimals if it's a whole number
      const rounded = Math.round(n * 100) / 100;
      const formatted = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
      return `${formatted}%`;
    }
    
    // Format numbers with proper decimals for averages/means
    if (typeof value === 'number') {
      if (key && (key.includes('mean') || key.includes('average') || key.includes('median'))) {
        const rounded = Math.round(value * 100) / 100;
        return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
      }
      return value.toLocaleString('id-ID');
    }
    
    return String(value);
  };

  const getStatIcon = (key) => {
    switch (key) {
      case 'total': return '📊';
      case 'dominant': 
      case 'dominantCategory': return '👑';
      case 'percentage': return '📈';
      case 'average': return '📊';
      default: return '📊';
    }
  };

  const getStatColor = (key, index) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
    return colors[index % colors.length];
  };

  if (!shouldRenderCharts && isAccordionOpen) {
    return (
      <Box ref={containerRef} sx={{ p: 3, textAlign: 'center', minHeight: 320 }}>
        <Typography variant="body2" color="text.secondary">
          Memuat visualisasi...
        </Typography>
      </Box>
    );
  }

  return (
    <Box ref={containerRef} sx={{ p: 3 }}>
      {renderStats()}
      {shouldRenderCharts ? renderCharts() : (
        <Box sx={{ p: 3, textAlign: 'center', minHeight: 320 }}>
          <Typography variant="body2" color="text.secondary">
            {!isAccordionOpen 
              ? "Buka accordion untuk melihat visualisasi"
              : "Memuat visualisasi..."
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EnhancedInfrastructureIndicators;

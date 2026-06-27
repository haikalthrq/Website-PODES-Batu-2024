import React, { useMemo, useRef } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, TableSortLabel } from '@mui/material';
import { ExpandMore, TableChart } from '@mui/icons-material';
import ReactApexChart from 'react-apexcharts';
import { buildStats, buildCharts, buildDetailTable } from '../../adapters/environmentDataAdapter';
import StatCards from '../unified/StatCards';
import ChartCard from '../common/ChartCard';
import { useSize } from '../../hooks/useSize';
import { ChartDownloadButton } from '../charts/ChartDownloadButton';

/**
 * Thin shell component for Environment indicators
 * Minimal logic - just wires config + transformers + engine
 */
export default function EnvironmentIndicatorShell({ 
  indicatorKey, 
  villageData = [], 
  config, 
  isOpen = false 
}) {
  const [detailTableOpen, setDetailTableOpen] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // Handle sort request
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Memoize heavy computations
  const { stats, charts, detailTable } = useMemo(() => {
    if (!config || !Array.isArray(villageData) || villageData.length === 0) {
      return {
        stats: {},
        charts: [],
        detailTable: { headers: [], rows: [] }
      };
    }

    return {
      stats: buildStats(villageData, config),
      charts: buildCharts(villageData, config),
      detailTable: buildDetailTable(villageData, config)
    };
  }, [villageData, config]);

  // Apply sorting to table rows
  const sortedRows = useMemo(() => {
    if (!sortConfig.key || !detailTable.rows) return detailTable.rows;

    const sorted = [...detailTable.rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      // String comparison (case-insensitive)
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [detailTable.rows, sortConfig]);

  if (!config) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          Konfigurasi indikator tidak ditemukan
        </Typography>
      </Box>
    );
  }

  if (!Array.isArray(villageData) || villageData.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          Tidak ada data untuk filter saat ini
        </Typography>
      </Box>
    );
  }

  // Auto-sizing chart wrapper component
  const AutoChart = React.memo(({ options, series, type, minHeight = 260, title = '' }) => {
    const { ref, size } = useSize();
    const chartContainerRef = useRef(null);
    
    // Memoize height calculation
    const targetHeight = useMemo(() => {
      return size.width > 0 
        ? Math.max(minHeight, Math.min(420, size.width * 0.56))
        : minHeight;
    }, [size.width, minHeight]);

    return (
      <Box 
        ref={ref} 
        sx={{ 
          width: '100%', 
          minHeight: minHeight,
          position: 'relative',
          // Hardware acceleration
          transform: 'translateZ(0)',
          willChange: 'auto',
          // Prevent layout thrashing
          containIntrinsicSize: `auto ${targetHeight}px`,
          contentVisibility: 'auto'
        }}
      >
        {/* Download Button */}
        {size.width > 0 && (
          <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
            <ChartDownloadButton
              chartRef={chartContainerRef}
              filename={title ? title.toLowerCase().replace(/\s+/g, '-') : 'chart'}
              size="small"
            />
          </Box>
        )}
        
        <Box ref={chartContainerRef}>
          {size.width > 0 && (
            <ReactApexChart
              options={options}
              series={series}
              type={type}
              height={targetHeight}
            />
          )}
        </Box>
      </Box>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison for memo - only re-render if data actually changed
    return (
      JSON.stringify(prevProps.series) === JSON.stringify(nextProps.series) &&
      prevProps.type === nextProps.type &&
      prevProps.minHeight === nextProps.minHeight &&
      prevProps.title === nextProps.title
    );
  });

  // Render ApexCharts with responsive layout
  const renderCharts = useMemo(() => {
    if (!charts || charts.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          Tidak ada chart untuk ditampilkan
        </Typography>
      );
    }

    return (
      <Grid 
        container 
        spacing={2}
        sx={{
          // Prevent layout shifts
          containIntrinsicSize: 'auto 500px',
          contentVisibility: 'auto'
        }}
      >
        {charts.map((chart, index) => {
          const { type, title, data, colors } = chart;
          
          if (type === 'donut') {
            const chartData = data || [];
            const total = chartData.reduce((sum, item) => sum + item.value, 0);
            
            const donutOptions = {
              chart: {
                type: 'donut',
                toolbar: { show: false },
                animations: { enabled: true },
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              },
              plotOptions: {
                pie: {
                  donut: {
                    size: '65%',
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        label: 'Total Desa',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#334155',
                        formatter: () => total.toString()
                      },
                      value: {
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#0f172a'
                      }
                    }
                  }
                }
              },
              colors: colors || [],
              labels: chartData.map(item => item.name),
              legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '12px',
                fontFamily: 'inherit',
                markers: {
                  width: 12,
                  height: 12,
                  radius: 2
                },
                itemMargin: {
                  horizontal: 8,
                  vertical: 4
                }
              },
              tooltip: {
                y: {
                  formatter: (value) => {
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return `${value} desa (${percentage}%)`;
                  }
                }
              },
              dataLabels: {
                enabled: false
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  legend: {
                    fontSize: '11px'
                  }
                }
              }]
            };

            return (
              <Grid item xs={12} md={6} lg={4} key={`${type}-${index}`}>
                <ChartCard title={title} minHeight={320}>
                  <AutoChart
                    options={donutOptions}
                    series={chartData.map(item => item.value)}
                    type="donut"
                    minHeight={260}
                    title={title}
                  />
                </ChartCard>
              </Grid>
            );
          }

          if (type === 'bar') {
            const barOptions = {
              chart: {
                type: 'bar',
                toolbar: { show: false },
                animations: { enabled: true },
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: '60%',
                  borderRadius: 4,
                  dataLabels: {
                    position: 'top'
                  }
                }
              },
              colors: colors || [],
              dataLabels: {
                enabled: true,
                offsetY: -20,
                style: {
                  fontSize: '11px',
                  fontWeight: 600,
                  colors: ['#475569']
                }
              },
              xaxis: {
                categories: data?.labels || [],
                labels: {
                  style: {
                    fontSize: '11px',
                    colors: '#64748b'
                  },
                  rotate: -45,
                  rotateAlways: false,
                  hideOverlappingLabels: true
                }
              },
              yaxis: {
                title: {
                  text: 'Jumlah Desa',
                  style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569'
                  }
                },
                labels: {
                  style: {
                    fontSize: '11px',
                    colors: '#64748b'
                  }
                }
              },
              grid: {
                borderColor: '#f1f5f9',
                strokeDashArray: 4
              },
              tooltip: {
                y: {
                  formatter: (value) => `${value} desa`
                }
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '80%'
                    }
                  }
                }
              }]
            };

            const barSeries = [{
              name: 'Jumlah Desa',
              data: (data?.values || []).map(item => item.value || item)
            }];

            return (
              <Grid item xs={12} md={6} lg={4} key={`${type}-${index}`}>
                <ChartCard title={title} minHeight={320}>
                  <AutoChart
                    options={barOptions}
                    title={title}
                    series={barSeries}
                    type="bar"
                    minHeight={260}
                  />
                </ChartCard>
              </Grid>
            );
          }

          if (type === 'stackedBar') {
            const stackedOptions = {
              chart: {
                type: 'bar',
                stacked: true,
                toolbar: { show: false },
                animations: { enabled: true },
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: '70%',
                  borderRadius: 4
                }
              },
              colors: colors || [],
              dataLabels: {
                enabled: true,
                formatter: (val) => val > 0 ? val.toString() : '',
                style: {
                  fontSize: '10px',
                  fontWeight: 600,
                  colors: ['#fff']
                }
              },
              xaxis: {
                categories: data?.categories || [],
                labels: {
                  style: {
                    fontSize: '11px',
                    colors: '#64748b'
                  }
                }
              },
              yaxis: {
                title: {
                  text: 'Jumlah Desa',
                  style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569'
                  }
                },
                labels: {
                  style: {
                    fontSize: '11px',
                    colors: '#64748b'
                  }
                }
              },
              legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '12px',
                fontFamily: 'inherit',
                markers: {
                  width: 12,
                  height: 12,
                  radius: 2
                },
                itemMargin: {
                  horizontal: 8,
                  vertical: 4
                }
              },
              grid: {
                borderColor: '#f1f5f9',
                strokeDashArray: 4
              },
              tooltip: {
                y: {
                  formatter: (value) => `${value} desa`
                }
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  plotOptions: {
                    bar: {
                      columnWidth: '90%'
                    }
                  },
                  legend: {
                    fontSize: '11px'
                  }
                }
              }]
            };

            return (
              <Grid item xs={12} lg={4} key={`${type}-${index}`}>
                <ChartCard title={title} minHeight={320}>
                  <AutoChart
                    options={stackedOptions}
                    series={data?.series || []}
                    type="bar"
                    minHeight={260}
                  />
                </ChartCard>
              </Grid>
            );
          }

          return null;
        })}
      </Grid>
    );
  }, [charts]); // Memoize charts rendering

  return (
    <Box sx={{ width: '100%' }}>
      {/* Stats Cards Row */}
      <StatCards stats={stats} />

      {/* Charts Row */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          📊 Visualisasi Data
        </Typography>
        {renderCharts}
      </Box>

      {/* Detail Table */}
      <Box sx={{ mb: 2 }}>
        <Accordion 
          expanded={detailTableOpen}
          onChange={() => setDetailTableOpen(!detailTableOpen)}
          sx={{ 
            boxShadow: 1,
            // Hardware acceleration
            transform: 'translateZ(0)',
            willChange: detailTableOpen ? 'height' : 'auto'
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: 'background.paper',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableChart color="primary" />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                  Data Detail per Desa
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {detailTable.rows.length} desa • Klik kolom untuk mengurutkan
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small" aria-label="detail table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    {detailTable.headers.map((header) => (
                      <TableCell 
                        key={header.key}
                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                        sortDirection={sortConfig.key === header.key ? sortConfig.direction : false}
                      >
                        <TableSortLabel
                          active={sortConfig.key === header.key}
                          direction={sortConfig.key === header.key ? sortConfig.direction : 'asc'}
                          onClick={() => handleSort(header.key)}
                          sx={{ 
                            '&:hover': { color: 'primary.main' },
                            '&.Mui-active': { 
                              color: 'primary.main',
                              '& .MuiTableSortLabel-icon': { 
                                color: 'primary.main !important' 
                              }
                            }
                          }}
                        >
                          {header.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedRows.map((row, index) => (
                    <TableRow 
                      key={`${row.nama_desa}-${index}`}
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                    >
                      {detailTable.headers.map((header) => (
                        <TableCell key={header.key} sx={{ fontSize: '0.875rem' }}>
                          {row[header.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
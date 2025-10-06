// Implements Figure A & C for "Perbandingan Antar Desa" with max 5 villages & 5 indicators
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Alert,
  Typography
} from '@mui/material';
import { BarChart } from '@mui/icons-material';
import VillageIndicatorSelectors from './VillageIndicatorSelectors';
import GroupedBarsComparisonChart from './GroupedBarsComparisonChart';
import { ComparisonSummaryTable } from './ComparisonTables';
import useComparisonData from '../hooks/useComparisonData';

/**
 * ComparisonView - Complete redesign implementing Figure A & C
 * Features: Hero intro card, multi-select with limits, grouped bar chart, accordion tables
 * Supports max 5 villages & 5 indicators with search, validation, and responsive design
 */
const ComparisonView = ({ 
  villages = [], 
  dataset = [], 
  currentCategory = 'pendidikan' 
}) => {
  // State for selections with new limits (max 5 each)
  const [selectedVillages, setSelectedVillages] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);

  // Prepare comparison data using our custom hook
  const comparisonData = useComparisonData(
    dataset,
    selectedVillages,
    selectedIndicators,
    currentCategory
  );

  // Reset indicators when category changes
  useEffect(() => {
    setSelectedIndicators([]);
  }, [currentCategory]);

  // Handlers for selections
  const handleVillagesChange = (newVillages) => {
    setSelectedVillages(newVillages);
  };

  const handleIndicatorsChange = (newIndicators) => {
    setSelectedIndicators(newIndicators);
  };

  // Check if we should show chart and tables
  const showComparison = comparisonData.isValidForComparison;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        px: { xs: 2, sm: 3, lg: 4 }, 
        py: 3,
        maxWidth: '1400px !important'
      }}
    >
      {/* Main Title - Always visible */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <BarChart 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
            color: 'primary.main',
            mr: 2
          }} 
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
          }}
        >
          Perbandingan Antar Desa
        </Typography>
      </Box>

      {/* Selection Controls */}
      <VillageIndicatorSelectors
        villages={villages}
        selectedVillages={selectedVillages}
        selectedIndicators={selectedIndicators}
        currentCategory={currentCategory}
        onVillagesChange={handleVillagesChange}
        onIndicatorsChange={handleIndicatorsChange}
        maxVillages={5}
        maxIndicators={5}
      />

      {/* Comparison Results */}
      {showComparison && (
        <Box sx={{ mt: 4 }}>
          {/* Show different content based on data type */}
          {comparisonData.hasQualitativeData ? (
            <>
              {/* Alert for qualitative data explanation */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>📋 Data Kualitatif:</strong> Kategori ini berisi data berupa teks/kategori (seperti "Ada/Tidak Ada", "Kuat/Lemah"). 
                  Grafik tidak tersedia untuk jenis data ini, namun Anda dapat melihat perbandingan lengkap dalam tabel di bawah.
                </Typography>
              </Alert>
              
              {/* Table only for qualitative data */}
              <ComparisonSummaryTable
                summaryData={comparisonData.summaryData}
                indicatorConfigs={comparisonData.indicatorConfigs}
                title="📊 Tabel Perbandingan Data Kualitatif"
                showTotal={false}
                hasQualitativeData={true}
              />
            </>
          ) : (
            <>
              {/* Grouped Bar Chart for quantitative data */}
              <GroupedBarsComparisonChart
                data={comparisonData.series}
                categories={comparisonData.categories}
                series={comparisonData.series}
                title="Perbandingan Indikator Kuantitatif"
                height={480}
              />

              {/* Accordion Tables */}
              <Box sx={{ mt: 3 }}>
                <ComparisonSummaryTable
                  summaryData={comparisonData.summaryData}
                  indicatorConfigs={comparisonData.indicatorConfigs}
                  title="Ringkasan Lengkap Perbandingan"
                />
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Additional validation messages */}
      {selectedVillages.length > 0 && !showComparison && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Perbandingan memerlukan minimal 2 indikator. Silakan pilih indikator tambahan untuk melihat grafik dan tabel perbandingan.
        </Alert>
      )}
    </Container>
  );
};

export default ComparisonView;
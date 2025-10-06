// Contoh implementasi SummaryAccordionSection di halaman analysis
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import { SummaryAccordionSection } from '../../analysis/sections';
import { CATEGORIES_CONFIG } from '../../config/categories.config';

/**
 * CONTOH PENGGUNAAN: Analysis Page dengan Universal Accordion
 * Demonstrasi implementasi SummaryAccordionSection untuk kategori baru
 */
const ExampleAnalysisPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Available categories - bisa dikustomisasi sesuai kebutuhan
  const availableCategories = [
    'pendidikan',
    'kesehatan', 
    'lingkungan_konektivitas',
    'lingkungan_kebencanaan'
  ];

  // Load data (simulasi - ganti dengan API call sebenarnya)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulasi loading data
        // const response = await fetch('/api/villages');
        // const villageData = await response.json();
        
        // Sementara menggunakan data dummy
        const dummyData = [
          { id: 1, village_name: 'Desa A', /* ... data lainnya */ },
          { id: 2, village_name: 'Desa B', /* ... data lainnya */ },
        ];
        
        setData(dummyData);
        setFilteredData(dummyData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getCurrentCategoryKey = () => {
    return availableCategories[activeTab] || 'pendidikan';
  };

  const getCurrentCategoryConfig = () => {
    const categoryKey = getCurrentCategoryKey();
    return CATEGORIES_CONFIG[categoryKey] || {};
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          📊 Analisis Indikator Desa
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ringkasan dan analisis mendalam untuk setiap kategori indikator
        </Typography>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {availableCategories.map((categoryKey, index) => {
            const config = CATEGORIES_CONFIG[categoryKey];
            return (
              <Tab
                key={categoryKey}
                label={config?.title || categoryKey}
                icon={<span>{config?.icon || '📊'}</span>}
                iconPosition="start"
                sx={{ 
                  minHeight: 72,
                  '& .MuiTab-iconWrapper': { mb: 0, mr: 1 }
                }}
              />
            );
          })}
        </Tabs>
      </Box>

      {/* Current Category Analysis */}
      <Box sx={{ mt: 2 }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            mb: 3
          }}
        >
          <span>{getCurrentCategoryConfig().icon}</span>
          {getCurrentCategoryConfig().title}
        </Typography>

        {/* Universal Summary Accordion Section */}
        <SummaryAccordionSection
          categoryKey={getCurrentCategoryKey()}
          data={data}
          filteredData={filteredData}
          allowToggleAll={true}
          accordionType="multiple" // atau "single"
        />
      </Box>
    </Container>
  );
};

export default ExampleAnalysisPage;
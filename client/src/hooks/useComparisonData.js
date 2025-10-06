import { useMemo } from 'react';
import { getComparisonConfig } from '../config/categories.config';

/**
 * useComparisonData - Custom hook for preparing comparison chart and table data
 * Memoized to prevent unnecessary re-computations
 * @param {Array} dataset - Village data array
 * @param {Array} selectedVillages - Selected village objects
 * @param {Array} selectedIndicators - Selected indicator keys
 * @param {string} categoryKey - Current category key
 * @returns {Object} Processed data for charts and tables
 */
const useComparisonData = (dataset, selectedVillages, selectedIndicators, categoryKey) => {
  return useMemo(() => {
    if (!dataset || !selectedVillages.length || !selectedIndicators.length) {
      return {
        series: [],
        categories: [],
        tableRows: [],
        tableColumns: [],
        summaryData: [],
        isValidForComparison: false,
        hasQualitativeData: false
      };
    }

    const categoryConfig = getComparisonConfig(categoryKey);
    if (!categoryConfig) {
      return {
        series: [],
        categories: [],
        tableRows: [],
        tableColumns: [],
        summaryData: [],
        isValidForComparison: false,
        hasQualitativeData: false
      };
    }

    // Check if this category has qualitative data
    const hasQualitativeData = categoryConfig.hasQualitativeData || false;

    // Filter dataset to only selected villages
    const selectedVillageIds = selectedVillages.map(v => v.id_desa);
    const filteredData = dataset.filter(row => 
      selectedVillageIds.includes(row.id_desa)
    );

    // Create village label mapping for charts
    const villageLabels = selectedVillages.map(village => 
      `${village.nama_desa} (${village.nama_kecamatan})`
    );

    // Get indicator configurations
    const indicatorConfigs = selectedIndicators.map(indicatorKey => 
      categoryConfig.indicators.find(indicator => indicator.key === indicatorKey)
    ).filter(Boolean);

    // Prepare chart series data
    const series = indicatorConfigs.map(indicator => {
      const seriesData = selectedVillages.map(village => {
        const villageData = filteredData.find(row => row.id_desa === village.id_desa);
        return villageData ? indicator.accessor(villageData) : 0;
      });

      return {
        name: indicator.label,
        data: seriesData,
        color: indicator.color
      };
    });

    // Prepare quantitative data table rows
    const tableRows = filteredData.map(row => {
      const rowData = {
        desa: row.nama_desa,
        kecamatan: row.nama_kecamatan,
        desaKecamatan: `${row.nama_desa} (${row.nama_kecamatan})`
      };

      // Add indicator values to row
      indicatorConfigs.forEach(indicator => {
        rowData[indicator.key] = indicator.accessor(row);
      });

      return rowData;
    });

    // Prepare table columns for quantitative data table
    const tableColumns = [
      { key: 'desaKecamatan', label: 'Desa (Kecamatan)', align: 'left' },
      ...indicatorConfigs.map(indicator => ({
        key: indicator.key,
        label: indicator.label,
        align: 'right'
      }))
    ];

    // Prepare summary data for comparison summary table
    const summaryData = selectedVillages.map((village, index) => {
      const villageData = filteredData.find(row => row.id_desa === village.id_desa);
      const summaryRow = {
        no: index + 1,
        desa: village.nama_desa,
        kecamatan: village.nama_kecamatan,
        desaKecamatan: `${village.nama_desa} (${village.nama_kecamatan})`
      };

      // Add indicator values and calculate total (only for quantitative data)
      let total = 0;
      indicatorConfigs.forEach(indicator => {
        const value = villageData ? indicator.accessor(villageData) : (hasQualitativeData ? '-' : 0);
        summaryRow[indicator.key] = value;
        
        // Only add to total if it's a number (quantitative data)
        if (!hasQualitativeData && typeof value === 'number') {
          total += value;
        }
      });

      if (!hasQualitativeData) {
        summaryRow.total = total;
        summaryRow.average = total / indicatorConfigs.length;
      }

      return summaryRow;
    });

    // Sort summary data by total (descending) only for quantitative data
    if (!hasQualitativeData) {
      summaryData.sort((a, b) => b.total - a.total);
    }

    return {
      series,
      categories: villageLabels,
      tableRows,
      tableColumns,
      summaryData,
      indicatorConfigs,
      hasQualitativeData,
      isValidForComparison: selectedVillages.length >= 1 && selectedIndicators.length >= 2,
      stats: {
        totalVillages: selectedVillages.length,
        totalIndicators: selectedIndicators.length,
        categoryTitle: categoryConfig.title
      }
    };
  }, [dataset, selectedVillages, selectedIndicators, categoryKey]);
};

export default useComparisonData;
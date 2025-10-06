import { useMemo } from 'react';

/**
 * Custom hook for computing indicator analysis data
 * Handles ranking, distribution, and statistics calculations
 * 
 * @param {Array} data - Array of village data
 * @param {Function} accessor - Function to extract indicator value from data row
 * @returns {Object} Computed analysis data
 */
export const useIndicatorComputations = (data, accessor) => {
  return useMemo(() => {
    if (!data || !data.length || typeof accessor !== 'function') {
      return {
        rankingList: [],
        distribution: { ada: 0, tidakAda: 0 },
        stats: { tertinggi: 0, terendah: 0, total: 0, totalDesa: 0 },
        isEmpty: true
      };
    }

    // Compute values using accessor function
    const dataWithValues = data.map(village => ({
      ...village,
      value: accessor(village) || 0
    }));

    // Generate ranking list (sorted by value descending)
    const rankingList = dataWithValues
      .sort((a, b) => b.value - a.value)
      .map((village, index) => ({
        ...village,
        rank: index + 1,
        displayName: `${village.nama_desa} (${village.nama_kecamatan}) Rank #${index + 1}`
      }));

    // Compute distribution (Ada vs Tidak Ada)
    const adaCount = dataWithValues.filter(village => village.value > 0).length;
    const tidakAdaCount = dataWithValues.length - adaCount;
    
    const distribution = {
      ada: adaCount,
      tidakAda: tidakAdaCount,
      // Chart data format
      chartData: [
        { 
          name: 'Tidak Ada', 
          value: tidakAdaCount,
          label: `${tidakAdaCount} desa`,
          percentage: tidakAdaCount > 0 ? ((tidakAdaCount / dataWithValues.length) * 100).toFixed(1) : '0'
        },
        { 
          name: 'Ada', 
          value: adaCount,
          label: `${adaCount} desa`,
          percentage: adaCount > 0 ? ((adaCount / dataWithValues.length) * 100).toFixed(1) : '0'
        }
      ].filter(item => item.value > 0) // Only include categories with data
    };

    // Compute statistics
    const values = dataWithValues.map(village => village.value);
    const stats = {
      tertinggi: Math.max(...values),
      terendah: Math.min(...values),
      total: values.reduce((sum, val) => sum + val, 0),
      totalDesa: dataWithValues.length,
      rataRata: values.length > 0 ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2) : 0
    };

    return {
      rankingList,
      distribution,
      stats,
      isEmpty: false,
      dataWithValues
    };
  }, [data, accessor]);
};

export default useIndicatorComputations;
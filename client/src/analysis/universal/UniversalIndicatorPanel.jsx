// Universal Indicator Panel - Single, reusable component for ALL indicator analysis
// Replaces duplicate chart logic with proven working implementation from IndicatorDetailPanel

import React from 'react';
import { getCategoryConfig, CATEGORIES_CONFIG } from '../../config/categories.config';
import IndicatorDetailPanel from '../../components/IndicatorDetailPanel';
import { formatAnalysisTitle } from './titleUtils';
// Special imports for Infrastructure category
import InfrastructureIndicatorContent from '../../components/InfrastructureIndicatorContent';
import { getIndicatorConfig } from '../../config/infra/indicatorRegistry';
// Special imports for Environment category
import EnvironmentIndicatorContent from '../../pages/indicators/EnvironmentIndicatorContent';

/**
 * Universal component that works for BOTH "Semua Indikator" accordions AND specific indicator views
 * Uses the exact same proven IndicatorDetailPanel that works in the "Semua Indikator" section
 * 
 * @param {Object} props
 * @param {string} props.categoryKey - Category key from config (e.g., 'pendidikan', 'kesehatan')
 * @param {string} props.indicatorKey - Indicator key from config (e.g., 'tk', 'sd', 'smp', 'sma')
 * @param {Array} props.dataset - Array of village data rows
 * @param {Object} props.titles - Optional custom titles { ranking?: string, distribution?: string }
 * @param {Object} props.colors - Optional custom colors { bar?: string, distribution?: string }
 * @param {boolean} props.isOpen - Whether panel is visible (for accordion lazy loading)
 * @param {boolean} props.loading - Loading state
 */
const UniversalIndicatorPanel = ({
  categoryKey,
  indicatorKey,
  dataset,
  titles = {},
  colors = {},
  isOpen = true,
  loading = false
}) => {
  // Don't render if not open (accordion optimization)
  if (!isOpen || !dataset || dataset.length === 0) {
    return null;
  }

  // Special handling for Infrastructure category - use registry system
  if (categoryKey === 'infrastruktur & konektivitas' || categoryKey === 'infrastruktur' || categoryKey.toLowerCase().includes('infrastruktur')) {
    console.log('🚀 UniversalIndicatorPanel: Using Infrastructure registry system for:', indicatorKey);
    
    const infraConfig = getIndicatorConfig(indicatorKey);
    if (infraConfig) {
      return (
        <InfrastructureIndicatorContent
          indicatorKey={indicatorKey}
          villageData={dataset}
        />
      );
    } else {
      console.warn('Infrastructure indicator config not found:', indicatorKey);
      return <div>Infrastructure indicator config not found: {indicatorKey}</div>;
    }
  }

  // Special handling for Environment category - reuse universal visualization stack
  if (categoryKey === 'lingkungan & kebencanaan' || categoryKey === 'lingkungan' || categoryKey.toLowerCase().includes('lingkungan')) {
    console.log('🌍 UniversalIndicatorPanel: Using Environment universal visualizations for:', indicatorKey);
    
    return (
      <EnvironmentIndicatorContent
        filters={{ indicator: indicatorKey }}
        villageData={dataset}
      />
    );
  }

  // Get category configuration for other categories
  const categoryConfig = getCategoryConfig(categoryKey);
  console.log('UniversalIndicatorPanel:', { categoryKey, indicatorKey, categoryFound: !!categoryConfig });
  
  if (!categoryConfig) {
    console.error(`Category config not found for: ${categoryKey}`);
    return <div>Category config not found: {categoryKey}</div>;
  }

  // Find specific indicator configuration
  // Handle both formats: 'tk' (config key) and 'jumlah_tk' (data key)
  let indicatorConfig = categoryConfig.indicators.find(ind => ind.key === indicatorKey);
  
  // If not found by key, try to find by dataKey
  if (!indicatorConfig) {
    indicatorConfig = categoryConfig.indicators.find(ind => ind.dataKey === indicatorKey);
  }
  
  console.log('Indicator found:', !!indicatorConfig, 'for', indicatorKey);
  
  if (!indicatorConfig) {
    console.warn(`Indicator config not found for: ${categoryKey}.${indicatorKey}. Creating fallback.`);
    // Create fallback config using indicatorKey as dataKey
    indicatorConfig = {
      key: indicatorKey,
      label: indicatorKey.replace(/^jumlah_/, '').toUpperCase().replace(/_/g, ' '),
      dataKey: indicatorKey,
      accessor: (row) => row[indicatorKey] || 0,
      colorTokens: { primary: '#2563eb', secondary: '#3b82f6' }
    };
  }

  // Use the exact same proven IndicatorDetailPanel that works in "Semua Indikator"
  return (
    <IndicatorDetailPanel
      title={titles.ranking || indicatorConfig.label}
      dataset={dataset}
      accessor={indicatorConfig.accessor}
      indicatorName={indicatorConfig.label}
      colorTokens={colors.bar ? { primary: colors.bar, ...indicatorConfig.colorTokens } : indicatorConfig.colorTokens}
      loading={loading}
    />
  );
};

export default UniversalIndicatorPanel;
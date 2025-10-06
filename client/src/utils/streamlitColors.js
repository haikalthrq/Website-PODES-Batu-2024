// Streamlit-inspired color palette for consistency
export const streamlitColors = {
  // Primary colors matching Streamlit's blue theme
  primary: '#1f77b4',      // Main blue from Streamlit
  primaryLight: '#60a5fa',
  primaryDark: '#0f4c75',
  
  // Secondary colors
  secondary: '#2E86AB',    // Used in quantitative charts
  secondaryLight: '#A23B72', // Used in qualitative charts
  
  // Success/positive
  success: '#4CAF50',      // Green for download buttons
  successDark: '#45a049',
  
  // Chart colors matching Streamlit defaults
  chart: {
    blue: '#1f77b4',
    orange: '#ff7f0e', 
    green: '#2ca02c',
    red: '#d62728',
    purple: '#9467bd',
    brown: '#8c564b',
    pink: '#e377c2',
    gray: '#7f7f7f',
    olive: '#bcbd22',
    cyan: '#17becf'
  },
  
  // Qualitative palette matching Plotly/Streamlit
  qualitative: [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
    '#14b8a6', '#f472b6', '#a78bfa', '#fb7185', '#34d399'
  ],
  
  // Background colors
  background: {
    light: '#f0f2f6',     // Light gray background
    card: '#ffffff',      // White card background
    accent: '#f8f9fa'     // Very light gray
  },
  
  // Text colors
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    muted: '#94a3b8'
  },
  
  // Gradient backgrounds matching landing page
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    purple: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #4c1d95 100%)'
  }
};

// Streamlit-style metrics configuration
export const streamlitMetrics = {
  borderRadius: '15px',
  padding: '1.5rem',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  borderLeft: '5px solid #1f77b4'
};

// Chart configuration matching Streamlit defaults
export const streamlitChartConfig = {
  colors: {
    quantitative: '#2E86AB',
    qualitative: '#A23B72',
    ranking: ['#2E86AB', '#F24236'], // Top vs Bottom
    distribution: '#A23B72'
  },
  layout: {
    font: {
      family: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      size: 12
    },
    colorway: [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ]
  }
};

export default streamlitColors;
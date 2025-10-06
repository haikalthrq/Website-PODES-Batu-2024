export const vizTheme = {
  bg: "transparent",
  text: "#1f2937",
  grid: "#e5e7eb",
  series: [
    "#22c55e", // green-500
    "#3b82f6", // blue-500
    "#a855f7", // purple-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#14b8a6", // teal-500
    "#f97316", // orange-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#84cc16"  // lime-500
  ],
  // Additional colors for better contrast
  cardBg: "#ffffff",
  cardBorder: "#e5e7eb",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af"
};

// Helper function to get series colors with fallback
export const getSeriesColors = (count: number): string[] => {
  const colors = [...vizTheme.series];
  while (colors.length < count) {
    colors.push(...vizTheme.series);
  }
  return colors.slice(0, count);
};

// Helper function for responsive font sizes
export const getFontSize = (size: 'sm' | 'md' | 'lg'): number => {
  switch (size) {
    case 'sm': return 12;
    case 'md': return 14;
    case 'lg': return 16;
    default: return 14;
  }
};
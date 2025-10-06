import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Paper
} from '@mui/material';

// Skeleton for KPI Cards
export const KPICardsSkeleton = () => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    {[1, 2, 3, 4].map((i) => (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Skeleton variant="text" width="60%" height={32} />
            </Box>
            <Skeleton variant="text" width="80%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Skeleton for Chart Components
export const ChartSkeleton = ({ title = "Loading Chart..." }) => (
  <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
    <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
    <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
      <Skeleton variant="text" width="100%" height={16} />
    </Box>
  </Paper>
);

// Skeleton for Filter Sidebar
export const FilterSidebarSkeleton = () => (
  <Box sx={{ p: 3 }}>
    {/* Header */}
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
      <Skeleton variant="text" width="60%" height={32} />
    </Box>
    
    {/* Form Fields */}
    {[1, 2, 3, 4].map((i) => (
      <Box key={i} sx={{ mb: 3 }}>
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
      </Box>
    ))}
    
    {/* Reset Button */}
    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
  </Box>
);

// Skeleton for Data Table
export const DataTableSkeleton = () => (
  <Paper elevation={3} sx={{ mb: 4 }}>
    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width="30%" height={24} sx={{ flexGrow: 1 }} />
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1, mr: 1 }} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </Box>
    
    <Box sx={{ p: 3 }}>
      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Skeleton variant="rectangular" width={250} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      
      {/* Table */}
      <Box>
        {/* Table Header */}
        <Box sx={{ display: 'flex', mb: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" width="20%" height={48} sx={{ mr: 1 }} />
          ))}
        </Box>
        
        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <Box key={row} sx={{ display: 'flex', mb: 1 }}>
            {[1, 2, 3, 4, 5].map((col) => (
              <Skeleton key={col} variant="text" width="20%" height={40} sx={{ mr: 1 }} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  </Paper>
);

// Skeleton for Comparison View
export const ComparisonViewSkeleton = () => (
  <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width="40%" height={32} />
      </Box>
      <Skeleton variant="text" width="60%" height={20} />
    </Box>
    
    {/* Selection Controls */}
    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: 1 }} />
    
    {/* Placeholder Content */}
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Skeleton variant="circular" width={64} height={64} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" width="50%" height={32} sx={{ mx: 'auto', mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mx: 'auto' }} />
    </Box>
  </Paper>
);

// Complete Dashboard Skeleton
export const DashboardSkeleton = () => (
  <Grid container spacing={3}>
    {/* KPI Cards */}
    <Grid size={12}>
      <KPICardsSkeleton />
    </Grid>
    
    {/* Chart */}
    <Grid size={12}>
      <ChartSkeleton />
    </Grid>
    
    {/* Comparison View */}
    <Grid size={12}>
      <ComparisonViewSkeleton />
    </Grid>
    
    {/* Data Table */}
    <Grid size={12}>
      <DataTableSkeleton />
    </Grid>
  </Grid>
);

export default {
  KPICardsSkeleton,
  ChartSkeleton,
  FilterSidebarSkeleton,
  DataTableSkeleton,
  ComparisonViewSkeleton,
  DashboardSkeleton
};
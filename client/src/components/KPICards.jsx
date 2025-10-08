import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const Metric = ({ label, value, sub }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
      {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
    </CardContent>
  </Card>
);

const KPICards = ({ analysisData }) => {
  if (!analysisData) return null;

  // Handle summary type for "Semua" indicator
  if (analysisData.type === 'summary') {
    const { total_villages, total_kecamatan, category, indicators_count } = analysisData.kpis || {};
    return (
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 3 }}><Metric label="Total Desa" value={total_villages ?? '-'} /></Grid>
        <Grid size={{ xs: 12, sm: 3 }}><Metric label="Total Kecamatan" value={total_kecamatan ?? '-'} /></Grid>
        <Grid size={{ xs: 12, sm: 3 }}><Metric label="Kategori" value={category ?? '-'} /></Grid>
        <Grid size={{ xs: 12, sm: 3 }}><Metric label="Jumlah Indikator" value={indicators_count ?? '-'} /></Grid>
      </Grid>
    );
  }

  if (analysisData.type === 'overview') {
    return (
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}><Metric label="Total Desa" value={analysisData.total_villages} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><Metric label="Total Kecamatan" value={analysisData.total_kecamatan} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><Metric label="Jumlah Indikator" value={analysisData.indicators_count} /></Grid>
      </Grid>
    );
  }

  if (analysisData.type === 'quantitative') {
    const { total, max, min, top } = analysisData.kpis || {};
    return (
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}><Metric label="Total" value={total ?? '-'} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><Metric label="Maks" value={max ?? '-'} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }}><Metric label="Min" value={min ?? '-'} sub={top ? `${top.nama_desa}` : undefined} /></Grid>
      </Grid>
    );
  }

  if (analysisData.type === 'qualitative') {
    return null;
  }

  return null;
};

export default KPICards;

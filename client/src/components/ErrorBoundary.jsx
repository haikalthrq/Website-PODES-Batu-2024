import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container
} from '@mui/material';
import {
  ErrorOutline,
  Refresh
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              color: 'white'
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Oops! Terjadi Kesalahan
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Aplikasi mengalami masalah tak terduga
            </Typography>
            
            <Box sx={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: 2, 
              p: 2, 
              mb: 3,
              textAlign: 'left'
            }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {this.state.error && this.state.error.toString()}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<Refresh />}
              onClick={this.handleReload}
              sx={{
                backgroundColor: 'white',
                color: '#ff6b6b',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              Muat Ulang Halaman
            </Button>
            
            <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
              Jika masalah berlanjut, silakan hubungi administrator sistem
            </Typography>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
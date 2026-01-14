import React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep a breadcrumb in console for debugging in production
    // eslint-disable-next-line no-console
    console.error('UI crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg =
      (this.state.error && typeof this.state.error.message === 'string' && this.state.error.message) ||
      'Something went wrong';

    return (
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            The page crashed
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {msg}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Reload
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              Back to login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
}


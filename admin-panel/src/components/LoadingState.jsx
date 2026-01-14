import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState = ({ message, fullScreen = false }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: fullScreen ? 0 : 8,
        minHeight: fullScreen ? '100vh' : 'auto',
        gap: 2,
        bgcolor: fullScreen ? 'background.default' : 'transparent'
      }}
    >
      <CircularProgress size={48} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {message || t('common.loading')}
      </Typography>
    </Box>
  );
};

export default LoadingState;

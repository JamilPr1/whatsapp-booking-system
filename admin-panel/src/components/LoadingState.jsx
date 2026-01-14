import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { toErrorMessage } from '../utils/errorMessage';

const LoadingState = ({ message, fullScreen = false }) => {
  const { t } = useTranslation();
  const safeMessage = toErrorMessage(message, t('common.loading'));
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
        {safeMessage}
      </Typography>
    </Box>
  );
};

export default LoadingState;

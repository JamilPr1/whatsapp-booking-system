import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorState = ({ 
  title, 
  message,
  onRetry 
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center'
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" color="error" gutterBottom>
        {title || t('common.error')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {message || t('common.noDataMessage')}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="error" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;

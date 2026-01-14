import React from 'react';
import { Box, Typography } from '@mui/material';
import { toErrorMessage } from '../utils/errorMessage';

const PageHeader = ({ title, subtitle, action }) => {
  const safeTitle = toErrorMessage(title, '');
  const safeSubtitle = subtitle ? toErrorMessage(subtitle, '') : '';
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
          {safeTitle}
        </Typography>
        {safeSubtitle && (
          <Typography variant="body2" color="text.secondary">
            {safeSubtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;

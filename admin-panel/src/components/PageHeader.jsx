import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, action }) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;

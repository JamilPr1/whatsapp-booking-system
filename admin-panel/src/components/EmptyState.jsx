import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { toErrorMessage } from '../utils/errorMessage';

const EmptyState = ({ 
  title = 'No data available', 
  message = 'There are no items to display at this time.',
  action,
  actionLabel,
  icon: Icon = InboxIcon 
}) => {
  const safeTitle = toErrorMessage(title, 'No data available');
  const safeMessage = toErrorMessage(message, 'There are no items to display at this time.');
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
      <Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {safeTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {safeMessage}
      </Typography>
      {action && actionLabel && (
        <Button variant="contained" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;

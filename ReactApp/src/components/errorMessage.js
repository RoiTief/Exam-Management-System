import React from 'react';
import { Box, Typography } from '@mui/material';

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        color: 'error.main',
        padding: 2,
        marginTop: 3,
        width: '100%',
        textAlign: 'center'
      }}
    >
      <Typography variant="body2">
        {message}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;

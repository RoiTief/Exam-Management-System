import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ERROR_MESSAGES } from 'src/constants';

const ErrorMessage = ({ message }) => {
  const router = useRouter();
  if (!message) {
    return null;
  }

  useEffect(() => {
    if (message === ERROR_MESSAGES.INVALID_CREDENTIALS) {
      
        window.alert(ERROR_MESSAGES.NOT_AUTHENTICATE);
        router
          .replace({
            pathname: '/auth/login',
            query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
          })
          .catch(console.error);
    }
  }, [message]);


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

import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { ERROR_MESSAGES } from 'src/constants';
import useRouterOverride from '../hooks/use-router';

const ErrorMessage = ({ message }) => {
  const router = useRouterOverride();

  useEffect(() => {
    if (message && message.includes(ERROR_MESSAGES.INVALID_CREDENTIALS)) {
      window.alert(ERROR_MESSAGES.NOT_AUTHENTICATE);
      router
        .replace({
          pathname: '/auth/login',
          query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined,
        })
        .catch(console.error);
    }
  }, [message, router]);

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
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
};

export default ErrorMessage;

import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { ACCOUNT } from '../../constants';
import useRouterOverride from '../../hooks/use-router';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouterOverride();
  const auth = useAuth();

  const handleSignOut = useCallback(
    async () => {
      onClose?.();
      await auth.signOut();
      router.push('/auth/login');
    },
    [onClose, auth, router]
  );
    const handleAccount = useCallback(
        async () => {
            onClose?.();
            router.push('/account');
        },
        [onClose, auth, router]
    );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          {ACCOUNT.ACCOUNT}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {JSON.stringify(auth.user?.username)}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
          <MenuItem onClick={handleAccount}>
            {ACCOUNT.ACCOUNT_SETTINGS}
          </MenuItem>
        <MenuItem onClick={handleSignOut}>
          {ACCOUNT.SIGN_OUT}
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

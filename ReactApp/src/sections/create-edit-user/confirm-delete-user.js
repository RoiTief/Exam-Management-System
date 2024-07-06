import { overlayStyle, popupStyle } from '../popUps/popup-style';
import {
  Button,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { USERS } from '../../constants';
import { useUser } from 'src/hooks/use-user';
import ErrorMessage from '../../components/errorMessage';
export const ConfirmDeleteUserPopup = ({user, isOpen, closePopup}) => {
  const { deleteUser } = useUser()
  const [errorMessage, setErrorMessage] = useState('');

  const confirmDeleteUser = async () => {
    try {
      deleteUser(user.username);
      closePopup();
    } catch (err) {
      setErrorMessage(err.message)
    }
  };
  return (
    isOpen ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={{ ...popupStyle, width: '30%' }}>
          <Typography variant="h5" component="h2" gutterBottom padding={2}>
            {USERS.CONFIRM_DELETION}
          </Typography>
          <Typography variant="body1">
            {USERS.CONFIRM_DELETION_MSG(user?.username)}
          </Typography>
          <Stack spacing={1}>
            <Button onClick={confirmDeleteUser} color="primary">
              Yes
            </Button>
            <Button onClick={closePopup} color="primary">
              No
            </Button>
            <ErrorMessage message={errorMessage}/>
          </Stack>
        </div>
      </div>
    ) : null
  )
}


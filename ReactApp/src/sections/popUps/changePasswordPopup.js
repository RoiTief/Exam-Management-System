import { overlayStyle, popupStyle } from '../popUps/popup-style';
import { Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Stack,
  TextField,
  Typography, InputLabel, Select, MenuItem, FormHelperText, FormControl
} from '@mui/material';
import React, { useState } from 'react';
import { LOGIN, USERS } from '../../constants';
import { useUser } from 'src/hooks/use-user';
import ErrorMessage from '../../components/errorMessage';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';

const ChangePasswordPopup = ({user, isOpen, closePopup}) => {
  const router = useRouter();
  const auth = useAuth();
  const [changePasswordValues, setChangePasswordValues] = useState({ newPassword: '', confirmNewPassword: '' });
  const [errorMessage, setErrorMessage] = useState('');

  function validateLegalPassword(password){
    return password.length >= 5;
  }

  const handleSubmit = async () => {
    try {
      if (changePasswordValues.newPassword !== changePasswordValues.confirmNewPassword)
        throw LOGIN.PASSWORDS_DO_NOT_MATCH
      if (!validateLegalPassword(changePasswordValues.newPassword))
        throw LOGIN.ILLEGAL_PASSWORD
      await auth.changePassword(user.username, changePasswordValues.newPassword);
      router.push('/');
    } catch (err) {
      setErrorMessage(err)
    }
  };

  return (
    isOpen ? (
     <div className="popup">
      <div onClick={closePopup} style={overlayStyle}></div>
      <div className="popup-content" style={{ ...popupStyle, width: '30%' }}>
        <Typography variant="h5" component="h2" gutterBottom padding={2}>
          {LOGIN.CHANGE_PASSWORD_TITLE}
        </Typography>
        <Stack spacing={1}>
          <TextField
            margin="dense"
            id="newPassword"
            label={LOGIN.NEW_PASSWORD_LABEL}
            type="password"
            fullWidth
            value={changePasswordValues.newPassword}
            onChange={(e) => setChangePasswordValues({ ...changePasswordValues, newPassword: e.target.value })}
          />
          <TextField
            margin="dense"
            id="confirmNewPassword"
            label={LOGIN.CONFIRM_NEW_PASSWORD_LABEL}
            type="password"
            fullWidth
            value={changePasswordValues.confirmNewPassword}
            onChange={(e) => setChangePasswordValues({ ...changePasswordValues, confirmNewPassword: e.target.value })}
          />
          <Stack direction="row" spacing={2} width="100%">
            <Button onClick={closePopup}>
              {LOGIN.CANCEL_BUTTON}
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {LOGIN.CHANGE_PASSWORD_BUTTON}
            </Button>
          </Stack>
          <ErrorMessage message={errorMessage}/>
        </Stack>
      </div>
    </div>
    ) : null
  )
}

export default ChangePasswordPopup;

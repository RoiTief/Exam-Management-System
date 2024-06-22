import { overlayStyle, popupStyle } from '../popUps/popup-style';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { LOGIN } from '../../constants';
import ErrorMessage from '../../components/errorMessage';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';

const ChangePasswordPopup = ({ user, isOpen, closePopup }) => {
  const router = useRouter();
  const auth = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().min(5, LOGIN.ILLEGAL_PASSWORD).required(LOGIN.NEW_PASSWORD_REQUIRED),
    confirmNewPassword: Yup.string()
                           .oneOf([Yup.ref('newPassword'), null], LOGIN.PASSWORDS_DO_NOT_MATCH)
                           .required(LOGIN.CONFIRM_NEW_PASSWORD_REQUIRED),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await auth.changePassword(user.username, values.newPassword);
      router.push('/');
    } catch (err) {
      setErrorMessage(err.message);
      setSubmitting(false);
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
          <Formik
            initialValues={{ newPassword: '', confirmNewPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleChange, handleBlur, values, touched, errors }) => (
              <Form>
                <Stack spacing={1}>
                  <TextField
                    margin="dense"
                    id="newPassword"
                    name="newPassword"
                    label={LOGIN.NEW_PASSWORD_LABEL}
                    type="password"
                    fullWidth
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.newPassword && !!errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                  />
                  <TextField
                    margin="dense"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    label={LOGIN.CONFIRM_NEW_PASSWORD_LABEL}
                    type="password"
                    fullWidth
                    value={values.confirmNewPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmNewPassword && !!errors.confirmNewPassword}
                    helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                  />
                  <Stack direction="row" spacing={2} width="100%">
                    <Button onClick={closePopup}>
                      {LOGIN.CANCEL_BUTTON}
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {LOGIN.CHANGE_PASSWORD_BUTTON}
                    </Button>
                  </Stack>
                  <ErrorMessage message={errorMessage} />
                </Stack>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    ) : null
  );
};

export default ChangePasswordPopup;

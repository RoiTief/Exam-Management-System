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
import { USERS } from '../../constants';
import { useUser } from 'src/hooks/use-user';
import ErrorMessage from '../../components/errorMessage';

const validationSchema = Yup.object().shape({
  username: Yup.string().required(USERS.USERNAME_REQUIRED),
  firstName: Yup.string().required(USERS.FIRST_NAME_REQUIRED),
  lastName: Yup.string().required(USERS.LAST_NAME_REQUIRED),
  email: Yup.string().email(USERS.INVALID_EMAIL).required(USERS.EMAIL_REQUIRED),
  type: Yup.string().required(USERS.TYPE_REQUIRED).oneOf([USERS.LECTURER, USERS.TA], USERS.INVALID_TYPE),
});

const EditUserPopup = ({user, editMode, isOpen, closePopup}) => {
  const { addUser, editUser } = useUser()
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    type: user?.type || '',
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      editMode ? await editUser({ ...user, ...values }) : await addUser({ ...values });
      closePopup()
    } catch (err) {
      setErrorMessage(err)
    }
  };

  return (
    isOpen ? (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, handleBlur, isSubmitting, setFieldValue, touched, errors }) => (
          <Form>
            <div className="popup">
              <div onClick={closePopup} style={overlayStyle}></div>
              <div className="popup-content" style={{ ...popupStyle, width: '30%' }}>
                <Typography variant="h5" component="h2" gutterBottom padding={2}>
                  {editMode ? USERS.EDIT_USER : USERS.ADD_USER}
                </Typography>
                <Stack spacing={1}>
                  <TextField
                    fullWidth
                    margin="dense"
                    id="username"
                    name="username"
                    inputProps={{ readOnly: editMode }}
                    label={USERS.USERNAME}
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    id="firstName"
                    name="firstName"
                    label={USERS.FIRST_NAME}
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label={USERS.LAST_NAME}
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    id="email"
                    name="email"
                    label={USERS.EMAIL}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={touched.type && Boolean(errors.type)}
                  >
                    <InputLabel id="type-label">{USERS.TYPE}</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type"
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <MenuItem value="Lecturer">{USERS.LECTURER}</MenuItem>
                      <MenuItem value="TA">{USERS.TA}</MenuItem>
                    </Select>
                    {touched.type && errors.type && (
                      <FormHelperText>{errors.type}</FormHelperText>
                    )}
                  </FormControl>
                  <Stack direction="row" spacing={2} width="100%">
                    <Button onClick={closePopup} color="primary">
                      {USERS.CANCEL_ACTION}
                    </Button>
                    <Button
                      sx={{ mt: 3 }}
                      type="submit"
                      color="primary"
                    >
                      {editMode ? USERS.SAVE_ACTION : USERS.ADD_USER}
                    </Button>
                  </Stack>
                  <ErrorMessage message={errorMessage}/>
                </Stack>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    ) : null
  )
}

export default EditUserPopup;

import PropTypes from 'prop-types';
import {overlayStyle, popupStyle} from './popup-style'
import { useCallback, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {httpsMethod, serverPath, requestServer,TOKEN_FIELD_NAME} from 'src/utils/rest-api-call';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';


export const AddPersonalToCourse = (props) => {
  const { isOpen, closePopup } = props;
  const [method, setMethod] = useState('TA');

  const formik = useFormik({
    initialValues: {
      username: '',
      submit: null
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required('Username is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        let request = (method=='TA') ? serverPath.ADD_TA : serverPath.ADD_GRADER
        await requestServer(request, httpsMethod.POST, {"username": values.username})
        closePopup();
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },[] );

  return (
    (isOpen) ? (
        <div className="popup">
            <div onClick={closePopup} style={overlayStyle}></div>
            <div className="popup-content" style={popupStyle}>
                <h2>Add Personal To Course</h2>
                <Tabs
                  onChange={handleMethodChange}
                  sx={{ mb: 3 }}
                  value={method}
                >
                  <Tab label="TA" value="TA"/>
                  <Tab label="Grader" value="grader"/>
                </Tabs>

                <form
                  noValidate
                  onSubmit={formik.handleSubmit}
                >
                  <Stack spacing={3}>
                    <TextField
                      error={!!(formik.touched.username && formik.errors.username)}
                      fullWidth
                      helperText={formik.touched.username && formik.errors.username}
                      label="Username"
                      name="username"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="username"
                      value={formik.values.username}
                    />
                  </Stack>
                  {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                  )}
                  <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    type="submit"
                    variant="contained"
                  >
                    Add Personal
                  </Button>
                </form> 
            </div>
        </div>
    ) : ""
  );
};


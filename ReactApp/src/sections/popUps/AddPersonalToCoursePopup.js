import PropTypes from 'prop-types';
import { overlayStyle, popupStyle } from './popup-style';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { httpsMethod, serverPath, requestServer, TOKEN_FIELD_NAME } from 'src/utils/rest-api-call';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material';
import { useEffect, useState } from 'react';

export const AddPersonalToCourse = (props) => {
  const { isOpen, closePopup, state } = props;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { users } = await requestServer(serverPath.GET_ALL_USERS, httpsMethod.GET);
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

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
        const request = (state === 'TA') ? serverPath.ADD_TA : serverPath.ADD_COURSE_ADMIN;
        await requestServer(request, httpsMethod.POST, { username: values.username });
        closePopup();
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    isOpen ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={{ ...popupStyle, width: '30%' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add Personal To Course
          </Typography>
          <form
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <Stack spacing={3}>
              <Autocomplete
                fullWidth
                options={users}
                value={formik.values.username}
                onChange={(event, newValue) => {
                  formik.setFieldValue('username', newValue || '');
                }}
                renderInput={(params) => <TextField {...params} label="Username" variant="outlined" />}
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
    ) : null
  );
};

AddPersonalToCourse.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
};

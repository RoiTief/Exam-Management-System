import PropTypes from 'prop-types';
import {overlayStyle, popupStyle} from './popup-style'
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

export const AddCourse = (props) => {
  const { isOpen, closePopup } = props;

  const formik = useFormik({
    initialValues: {
      courseName: '',
      courseId: '',
      lecturerUsername: '',
      submit: null
    },
    validationSchema: Yup.object({
        courseName: Yup
        .string()
        .max(255)
        .required('courseName is required'),
        courseId: Yup
        .string()
        .max(255)
        .required('courseId is required'),
        lecturerUsername: Yup
        .string()
        .max(255)
        .required('lecturerUsername is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await requestServer(serverPath.ADD_COURSE, httpsMethod.POST, 
          {courseId: values.courseId,
          courseName: values.courseName,
          lecturerUsername: values.lecturerUsername});
        closePopup();
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    (isOpen) ? (
        <div className="popup">
            <div onClick={closePopup} style={overlayStyle}></div>
            <div className="popup-content" style={popupStyle}>
                <h2>Create New Course</h2>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      error={!!(formik.touched.courseName && formik.errors.courseName)}
                      fullWidth
                      helperText={formik.touched.courseName && formik.errors.courseName}
                      label="Course Name"
                      name="courseName"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="courseName"
                      value={formik.values.courseName}
                    />
                    <TextField
                      error={!!(formik.touched.courseId && formik.errors.courseId)}
                      fullWidth
                      helperText={formik.touched.courseId && formik.errors.courseId}
                      label="Course Id"
                      name="courseId"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="courseId"
                      value={formik.values.courseId}
                    />
                    <TextField
                      error={!!(formik.touched.lecturerUsername && formik.errors.lecturerUsername)}
                      fullWidth
                      helperText={formik.touched.lecturerUsername && formik.errors.lecturerUsername}
                      label="lecturer Username"
                      name="lecturerUsername"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="lecturerUsername"
                      value={formik.values.lecturerUsername}
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
                  Create
                </Button>
              </form>
            </div>
        </div>
    ) : ""
  );
};

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { LOGIN } from '../../constants';
import ErrorMessage from 'src/components/errorMessage';
import ChangePasswordPopup from '../../sections/popUps/changePasswordPopup';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method] = useState('username');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordValues, setChangePasswordValues] = useState({ newPassword: '', confirmNewPassword: '' });
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required('Username is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
        const user = await auth.signIn(values.username, values.password);
        setUser(user);
        if (user.firstSignIn) {
          setChangePasswordOpen(true);
        } else {
          router.push('/');
        }
      } catch (err) {
        setErrorMessage(err.message);
        formik.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Head>
        <title>
          {LOGIN.PAGE_TITLE}
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                {LOGIN.HEADING}
              </Typography>
            </Stack>
            {method === 'username' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.username && formik.errors.username)}
                    fullWidth
                    helperText={formik.touched.username && formik.errors.username}
                    label={LOGIN.USERNAME_LABEL}
                    name="username"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="username"
                    value={formik.values.username}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label={LOGIN.PASSWORD_LABEL}
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  {LOGIN.CONTINUE_BUTTON}
                </Button>
                <ErrorMessage message={errorMessage} />
              </form>
            )}
          </div>
        </Box>
      </Box>

      <ChangePasswordPopup user={user}
                           isOpen={changePasswordOpen}
                           closePopup={() => setChangePasswordOpen(false)} />
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;

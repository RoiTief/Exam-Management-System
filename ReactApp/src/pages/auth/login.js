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

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method] = useState('username');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordValues, setChangePasswordValues] = useState({ newPassword: '', confirmNewPassword: '' });
  const [user, setUser] = useState(null)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      submit: null
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
    onSubmit: async (values, helpers) => {
      try {
        const user = await auth.signIn(values.username, values.password);
        setUser(user);
        console.log(user);
        if (user.firstSignIn) {
          setChangePasswordOpen(true);
        } else {
          router.push('/');
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleChangePassword = async () => {
    if (changePasswordValues.newPassword !== changePasswordValues.confirmNewPassword) {
      alert(LOGIN.PASSWORDS_DO_NOT_MATCH);
      return;
    }
    try {
      await auth.changePassword(user.username, changePasswordValues.newPassword);
      setChangePasswordOpen(false);
      router.push('/');
    } catch (err) {
      console.error(LOGIN.FAILED_TO_CHANGE_PASSWORD, err);
    }
  };

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
                  {LOGIN.CONTINUE_BUTTON}
                </Button>
              </form>
            )}
          </div>
        </Box>
      </Box>

      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)}>
        <DialogTitle>{LOGIN.CHANGE_PASSWORD_TITLE}</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>{LOGIN.CANCEL_BUTTON}</Button>
          <Button onClick={handleChangePassword}>{LOGIN.CHANGE_PASSWORD_BUTTON}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;

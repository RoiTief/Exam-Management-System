import React, { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {
  Box,
  Button,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Alert,
  FormHelperText, InputLabel, FormControl
} from '@mui/material';
import { AddCircle, Edit, Delete } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useUser } from 'src/hooks/use-user';
import { UserProvider } from '../../contexts/user-context';
import { SIDE_BAR, USERS } from '../../constants';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  type: Yup.string().required('Type is required').oneOf(['Lecturer', 'TA'], 'Invalid type'),
});

const ManageUsers = () => {
  const { state, addUser, editUser, deleteUser, resetPassword } = useUser();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteUserPrompt, setDeleteUserPrompt] = useState(false);
  const [resetPasswordPrompt, setResetPasswordPrompt] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToReset, setUserToReset] = useState(null);
  const [error, setError] = useState('');

  const handleOpen = (user) => {
    setEditMode(!!user);
    setCurrentUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setEditMode(false);
    setCurrentUser(null);
    setOpen(false);
    setDeleteUserPrompt(false);
    setUserToDelete(null);
    setResetPasswordPrompt(false);
    setUserToReset(null);
    setError('');
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteUserPrompt(true);
  };

  const confirmDeleteUser = () => {
    deleteUser(userToDelete.username);
    setDeleteUserPrompt(false);
  };

  const handleResetPassword = (user) => {
    setUserToReset(user);
    setResetPasswordPrompt(true);
  };

  const confirmResetPassword = () => {
    resetPassword(userToReset.username);
    setResetPasswordPrompt(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const result = editMode ? await editUser({ ...currentUser, ...values }) : await addUser({ ...values });
    setSubmitting(false);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: 2 }}>
      <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {SIDE_BAR.MANAGE_USERS}
        </Typography>
        <Button startIcon={<AddCircle />} variant="contained" onClick={() => handleOpen(null)} sx={{ mb: 2 }}>
          {USERS.ADD_USER}
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{USERS.USERNAME}</TableCell>
                <TableCell>{USERS.FIRST_NAME}</TableCell>
                <TableCell>{USERS.LAST_NAME}</TableCell>
                <TableCell>{USERS.EMAIL}</TableCell>
                <TableCell>{USERS.TYPE}</TableCell>
                <TableCell>{USERS.ACTIONS}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(state.users) && state.users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user)}>
                      <Delete />
                    </IconButton>
                    <Button onClick={() => handleResetPassword(user)}>
                      Reset Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? USERS.EDIT_USER : USERS.ADD_USER}</DialogTitle>
          {error && <Alert severity="error">{error}</Alert>}
          <Formik
            initialValues={{
              username: currentUser?.username || '',
              firstName: currentUser?.firstName || '',
              lastName: currentUser?.lastName || '',
              email: currentUser?.email || '',
              type: currentUser?.type || ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    {USERS.CANCEL_ACTION}
                  </Button>
                  <Button type="submit" color="primary" disabled={isSubmitting}>
                    {editMode ? USERS.SAVE_ACTION : USERS.ADD_USER}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>

        <Dialog open={deleteUserPrompt} onClose={() => setDeleteUserPrompt(false)}>
          <DialogTitle>{USERS.CONFIRM_DELETION}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {USERS.CONFIRM_DELETION_MSG(userToDelete?.username)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteUser} color="primary">
              Yes
            </Button>
            <Button onClick={() => setDeleteUserPrompt(false)} color="primary">
              No
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={resetPasswordPrompt} onClose={() => setResetPasswordPrompt(false)}>
          <DialogTitle>{USERS.CONFIRM_RESET_PASSWORD}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {USERS.CONFIRM_RESET_PASSWORD_MSG(userToReset?.username)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmResetPassword} color="primary">
              Yes
            </Button>
            <Button onClick={() => setResetPasswordPrompt(false)} color="primary">
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

ManageUsers.getLayout = (page) => (
  <DashboardLayout>
    <UserProvider>
      {page}
    </UserProvider>
  </DashboardLayout>
);

export default ManageUsers;

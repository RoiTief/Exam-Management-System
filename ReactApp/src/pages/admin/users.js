import React, { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Box, Button, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { AddCircle, Edit, Delete } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useUser } from 'src/hooks/use-user';
import { UserProvider } from '../../contexts/user-context';

const validationSchema = Yup.object().shape({
  type: Yup.string().required('Type is required').oneOf(['Lecturer', 'TA'], 'Invalid type'),
});

const ManageUsers = () => {
  const { state, addUser, editUser, deleteUser } = useUser();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteUserPrompt, setDeleteUserPrompt] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteUserPrompt(true);
  };

  const confirmDeleteUser = () => {
    deleteUser(userToDelete.username);
    setDeleteUserPrompt(false);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (editMode) {
      editUser({ ...currentUser, ...values });
    } else {
      addUser({ ...values });
    }
    setSubmitting(false);
    handleClose();
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: 2 }}>
      <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Users
        </Typography>
        <Button startIcon={<AddCircle />} variant="contained" onClick={() => handleOpen(null)} sx={{ mb: 2 }}>
          Add User
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(state.users) && state.users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
          <Formik
            initialValues={{
              username: currentUser?.username || '',
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
                    label="Username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                  <Select
                    fullWidth
                    margin="dense"
                    id="type"
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.type && Boolean(errors.type)}
                  >
                    <MenuItem value="Lecturer">Lecturer</MenuItem>
                    <MenuItem value="TA">TA</MenuItem>
                  </Select>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" disabled={isSubmitting}>
                    {editMode ? 'Save Changes' : 'Add User'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>

        <Dialog open={deleteUserPrompt} onClose={() => setDeleteUserPrompt(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete the user {userToDelete?.username}?
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

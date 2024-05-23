import React, { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Box, Button, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import { AddCircle, Edit, Delete } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useUserContext } from '../../contexts/user-context';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  courseName: Yup.string().required('Course name is required'),
  type: Yup.string().required('Type is required')
});

const ManageUsers = () => {
  const { state, addUser, editUser, deleteUser } = useUserContext();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleOpen = (user) => {
    setEditMode(!!user);
    setCurrentUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setEditMode(false);
    setCurrentUser(null);
    setOpen(false);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (editMode) {
      editUser({ ...currentUser, ...values });
    } else {
      addUser({ id: Date.now(), ...values });
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
                <TableCell>Course Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(state.users) && state.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.courseName}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => deleteUser(user.id)}>
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
              courseName: currentUser?.courseName || '',
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
                  <TextField
                    fullWidth
                    margin="dense"
                    id="courseName"
                    name="courseName"
                    label="Course Name"
                    value={values.courseName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.courseName && Boolean(errors.courseName)}
                    helperText={touched.courseName && errors.courseName}
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
                    <MenuItem value="Course admin">Course admin</MenuItem>
                    <MenuItem value="Grader">Grader</MenuItem>
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
      </Container>
    </Box>
  );
};

ManageUsers.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ManageUsers;

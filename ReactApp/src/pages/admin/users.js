import React, { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import { AddCircle, Edit, Delete } from '@mui/icons-material';
import * as Yup from 'yup';
import { UserProvider } from '../../contexts/user-context';
import { SIDE_BAR, USERS } from '../../constants';
import EditUserPopup from '../../sections/create-edit-user/EditUserPopup';
import { UsersTable } from '../../sections/create-edit-user/users-table';
import { ConfirmDeleteUserPopup } from '../../sections/create-edit-user/confirm-delete-user';
import { ConfirmResetPasswordPopup } from '../../sections/create-edit-user/confirm-reset-password';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(USERS.FIRST_NAME_REQUIRED),
  lastName: Yup.string().required(USERS.LAST_NAME_REQUIRED),
  email: Yup.string().email(USERS.INVALID_EMAIL).required(USERS.EMAIL_REQUIRED),
  type: Yup.string().required(USERS.TYPE_REQUIRED).oneOf([USERS.LECTURER, USERS.TA], USERS.INVALID_TYPE),
});

const ManageUsers = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToReset, setUserToReset] = useState(null);

  const handleAddUser = () => {
    setEditMode(false);
    setCurrentUser(null);
    setOpen(true);
  };


  const enterEditMode = (user) => {
    setCurrentUser(user)
    setEditMode(true)
    setOpen(true)
  }


  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: 2 }}>
      <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {SIDE_BAR.MANAGE_USERS}
        </Typography>
        <Button startIcon={<AddCircle />} variant="contained" onClick={handleAddUser} sx={{ mb: 2 }}>
          {USERS.ADD_USER}
        </Button>

        <UsersTable setEditMode={enterEditMode} setUserToDelete={setUserToDelete} setUserToReset={setUserToReset} />
        <EditUserPopup user={currentUser} editMode={editMode} isOpen={open} closePopup={() => setOpen(false)} />
        <ConfirmDeleteUserPopup user={userToDelete} isOpen={userToDelete!==null} closePopup={() => setUserToDelete(null)} />
        <ConfirmResetPasswordPopup user={userToReset} isOpen={userToReset!==null} closePopup={() => setUserToReset(null)} />

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

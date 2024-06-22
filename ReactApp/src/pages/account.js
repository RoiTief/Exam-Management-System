import { useState, useCallback } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ACCOUNT } from '../constants';
import { useAuth } from '../hooks/use-auth';

const AccountProfile = ({ userDetails, onEdit }) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>{userDetails?.username ? userDetails.username.charAt(0).toUpperCase() : ""}</Avatar>}
        title={`${userDetails.firstName} ${userDetails.lastName}`}
        subheader={userDetails.type}
        titleTypographyProps={{ variant: 'h5' }}
        subheaderTypographyProps={{ variant: 'subtitle1' }}
      />
      <CardContent>
        <Typography variant="subtitle1" color="textSecondary">First Name</Typography>
        <Typography variant="h6" gutterBottom>{userDetails.firstName}</Typography>

        <Typography variant="subtitle1" color="textSecondary">Last Name</Typography>
        <Typography variant="h6" gutterBottom>{userDetails.lastName}</Typography>

        <Typography variant="subtitle1" color="textSecondary">Username</Typography>
        <Typography variant="h6" gutterBottom>{userDetails.username}</Typography>

        <Typography variant="subtitle1" color="textSecondary">Email</Typography>
        <Typography variant="h6" gutterBottom>{userDetails.email}</Typography>

        <Typography variant="subtitle1" color="textSecondary">Account Type</Typography>
        <Typography variant="h6">{userDetails.type}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={onEdit}>Edit Details</Button>
      </CardActions>
    </Card>
  );
};

const EditProfileDialog = ({ open, onClose, userDetails, onSave }) => {
  const [values, setValues] = useState({
    username: userDetails.username,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    email: userDetails.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [changePassword, setChangePassword] = useState(false);

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  }, []);

  const handleToggleChangePassword = useCallback(() => {
    setChangePassword((prev) => !prev);
  }, []);

  const handleSave = useCallback(() => {
    if (changePassword && values.newPassword !== values.confirmPassword) {
      setError(ACCOUNT.PASSWORDS_DO_NOT_MATCH);
      return;
    }
    if (changePassword && (values.newPassword.length <= 4 || values.currentPassword.length <= 4)) {
      setError(ACCOUNT.ILLEGAL_PASSWORD);
      return;
    }
    // Add additional validation as needed
    setError("")
    onSave(values);
  }, [values, changePassword, onSave]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Profile Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={ACCOUNT.FIRST_NAME}
              name="firstName"
              onChange={handleChange}
              required
              value={values.firstName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={ACCOUNT.LAST_NAME}
              name="lastName"
              onChange={handleChange}
              required
              value={values.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={ACCOUNT.EMAIL}
              name="email"
              onChange={handleChange}
              required
              value={values.email}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch checked={changePassword} onChange={handleToggleChangePassword} color="primary" />
              }
              label={ACCOUNT.CHANGE_PASSWORD}
            />
          </Grid>
          {changePassword && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={ACCOUNT.CURRENT_PASSWORD}
                  name="currentPassword"
                  onChange={handleChange}
                  type="password"
                  value={values.currentPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={ACCOUNT.NEW_PASSWORD}
                  name="newPassword"
                  onChange={handleChange}
                  type="password"
                  value={values.newPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={ACCOUNT.CONFIRM_PASSWORD}
                  name="confirmPassword"
                  onChange={handleChange}
                  type="password"
                  value={values.confirmPassword}
                />
              </Grid>
            </>
          )}
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const Page = () => {
  const auth = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [error, setError] = useState("")
  const [user, setUser] = useState(auth.user)

  const handleEdit = useCallback(() => {
    setEditDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setEditDialogOpen(false);
  }, []);

  const handleSave = useCallback(async (values) => {
    try {
      // Save the updated details here (e.g., make an API call)
      await auth.editDetails(values).then(userDetails => {
        setUser(userDetails)
        setError('');
      })
    } catch (e) {
      setError(ACCOUNT.FAILED(e.message));
    }
    setEditDialogOpen(false);
  }, []);

  return (
    <>
      <Head>
        <title>{ACCOUNT.ACCOUNT}</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">{ACCOUNT.ACCOUNT}</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AccountProfile userDetails={user} onEdit={handleEdit} />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
            </Grid>
          </Stack>
        </Container>
      </Box>
      <EditProfileDialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        userDetails={user}
        onSave={handleSave}
      />
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

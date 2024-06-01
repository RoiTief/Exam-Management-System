import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  SvgIcon,
  Divider,
  Stack
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import ChevronDoubleDownIcon from '@heroicons/react/20/solid/ChevronDoubleDownIcon';
import ChevronDoubleUpIcon from '@heroicons/react/20/solid/ChevronDoubleUpIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { AddPersonalToCourse } from 'src/sections/popUps/AddPersonalToCoursePopup';
import { COURSE_STAFF } from '../constants';

const Page = () => {
  const [course, setCourse] = useState({});
  const [showAllAdmins, setShowAllAdmins] = useState(false);
  const [showAllTAs, setShowAllTAs] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupState, setPopupState] = useState('');

  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await requestServer(serverPath.GET_ALL_STAFF, httpsMethod.GET);
        setCourse(response.staff);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    getCourse();
  }, []);

  const toggleAdmins = () => {
    setShowAllAdmins(!showAllAdmins);
  };

  const toggleTAs = () => {
    setShowAllTAs(!showAllTAs);
  };

  const handleAddPersonal = (type) => {
    setPopupState(type);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        py: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            p: 4,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 2,
              p: '0.5em',
              mb: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {COURSE_STAFF.HEADING}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h5" component="h2" gutterBottom>
                  {COURSE_STAFF.LECTURERS_HEADING}
                </Typography>
                <SvgIcon color="primary" component={PlusIcon} onClick={() => handleAddPersonal('admin')} sx={{ cursor: 'pointer' }} />
              </Stack>
              <List>
                {course?.['Lecturers']?.slice(0, showAllAdmins ? undefined : 3).map((admin, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={admin.username} />
                  </ListItem>
                ))}
              </List>
              {course?.['Lecturers']?.length > 3 && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={toggleAdmins}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      {showAllAdmins ? <ChevronDoubleUpIcon /> : <ChevronDoubleDownIcon />}
                    </SvgIcon>
                  )}
                >
                  {showAllAdmins ? COURSE_STAFF.SHOW_LESS_ADMINS : COURSE_STAFF.SHOW_MORE_ADMINS}
                </Button>
              )}
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'neutral.700' }} />

            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h5" component="h2" gutterBottom>
                  {COURSE_STAFF.TAS_HEADING}
                </Typography>
                <SvgIcon color="primary" component={PlusIcon} onClick={() => handleAddPersonal('TA')} sx={{ cursor: 'pointer' }} />
              </Stack>
              <List>
                {course?.['TAs']?.slice(0, showAllTAs ? undefined : 3).map((ta, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ta.username} />
                  </ListItem>
                ))}
              </List>
              {course?.['TAs']?.length > 3 && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={toggleTAs}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      {showAllTAs ? <ChevronDoubleUpIcon /> : <ChevronDoubleDownIcon />}
                    </SvgIcon>
                  )}
                >
                  {showAllTAs ? COURSE_STAFF.SHOW_LESS_TAS : COURSE_STAFF.SHOW_MORE_TAS}
                </Button>
              )}
            </Box>
          </Stack>
        </Paper>
      </Container>

      <AddPersonalToCourse isOpen={isPopupOpen} closePopup={closePopup} state={popupState} />
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

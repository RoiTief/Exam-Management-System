import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { useEffect, useState } from 'react';
import {httpsMethod, serverPath, requestServer,TOKEN_FIELD_NAME} from 'src/utils/rest-api-call';
import {SERVER_ROOT_URL} from 'src/utils/rest-api-call'

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export const OverviewUserOptions = () => {
  const [username, setUsername] = useState('');
  const [usertype, setUseType] = useState('User');

  useEffect( () => {
    const fetchUsername = async () => {
      try {
      const {username} = await requestServer(serverPath.GET_USERNAME, httpsMethod.GET);
      setUsername(username)
      }
      catch(err){
        console.error('Error fetching username:', err)
      }
    }
    fetchUsername();
  }, [])

  useEffect( () => {
    const fetchUserType = async () => {
      try{
      const {userType} = await requestServer(serverPath.GET_USER_TYPE, httpsMethod.GET);
      setUseType(userType)
      }
      catch(err){
        console.error('Error fetching user type:', err)
      }
    }
    fetchUserType();
  }, [])


  const buttons = [
    {
      for: ['Course Admin', 'TA'], 
      title: 'Browse Questions',
      path: '/allQuestions',
    },
    {
      for: ['Course Admin', 'TA'], 
      title: 'Add Question',
      path: '/addQuestion',
    },
    {
      for: ['System Admin'], 
      title: 'Add Course',
      path: '/addCourse',
    },
    {
      for: ['Course Admin', 'TA', 'Grader'], 
      title: 'Ask for New Task',
      path: '/askForNewTask',
    },
    {
      for: ['Course Admin'],
      title: 'Check Staff Progress',
      path: '/checkStaffProgress',
    },
    {
      for: ['Course Admin'],
      title: 'Add New Personal To Course',
      path: '/addPersonal',
    },
    {
      for: ['Course Admin'],
      title: 'Create Task',
      path: '/createTask',
    },
    {
      for: ['Course Admin'],
      title: 'Create Exam',
      path: '/createExam',
    }
  ];


  return (
    <Card>
      <CardHeader title={`Hello, ${username}`}/>
        <Box sx={{ minWidth: 75 }}>
          <Stack component="ul" spacing={2}>
            {buttons.filter(button => button.for.includes(usertype))
            .map((item) => {
              return (
                <Stack>
                  <Button size="small" variant="contained"
                  href={`${SERVER_ROOT_URL}${item.path}`} type='submit'>
                    {`${item.title}`}
                  </Button>
                </Stack>
              );
            })}
          </Stack>
        </Box>      
    </Card>
  );
};

OverviewUserOptions.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};

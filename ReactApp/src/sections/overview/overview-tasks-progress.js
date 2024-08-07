import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {httpsMethod, serverPath, requestServer,TOKEN_FIELD_NAME} from 'src/utils/rest-api-call';
import { TASK_PROGRESS } from '../../constants';
import ErrorMessage from '../../components/errorMessage';


export const OverviewTasksProgress = () => {
  const [value, setValue] = useState(0)
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
   const fetchList = async () => {
     try {
      setValue(0)
     }
     catch(err){
       console.error('Error fetching task list:', err)
       setErrorMessage(`Error fetching tasks: ${err}`)
     }
   }
 
   fetchList();
  }, [])



  
  return (
    <Card>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="column"
          justifyContent="space-between"
          spacing={1}
        >
          <Stack spacing={1}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              backgroundColor: 'lightgray', // Adjust background color as needed
            }}
          >
            <Typography variant="h5">
              {value}%
            </Typography>
            </Avatar>
            <Typography
              color="text.secondary"
              fontWeight= "bold"
              fontSize={20}
              align= "center"            
              >
              {TASK_PROGRESS.TASK_PROGRESS}
            </Typography>
          </Stack>
        </Stack>
        <ErrorMessage message={errorMessage} />
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  value: PropTypes.number.isRequired,
};

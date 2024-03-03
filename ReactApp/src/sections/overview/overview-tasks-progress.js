import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import {httpsMethod, serverPath, requestServer,TOKEN_FIELD_NAME} from 'src/utils/rest-api-call';


export const OverviewTasksProgress = () => {
  const [value, setValue] = useState(0)

  useEffect(() => {
   const fetchList = async () => {
     try {
      const {tasks} = await requestServer(serverPath.VIEW_TASKS, httpsMethod.GET);
      
      var finishedTasks = tasks.filter(task => task.finished).length
      var totalTasks = tasks.length
      setValue(totalTasks!=0 ? (finishedTasks / totalTasks) * 100 : 0)
     }
     catch(err){
       console.error('Error fetching task list:', err)
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
              Task Progress
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  value: PropTypes.number.isRequired,
};

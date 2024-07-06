import PropTypes from 'prop-types';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import {
  Card,
  CardActions,
  CardHeader,
  Stack,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TASK } from '../../constants';
import ErrorMessage from '../../components/errorMessage';
import NextLink from 'next/link';
import TaskIcon from '@mui/icons-material/Assignment'; // Import an icon for tasks

export const OverviewAssignedTasks = () => {
  const [tasks, setList] = useState([]);
  const [taskToView, setTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleButtonClick = (task) => {
    setTask(task);
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const { tasks } = await requestServer(serverPath.VIEW_TASKS, httpsMethod.GET);
        setList(tasks);
      } catch(err) {
        console.error('Error fetching task list:', err);
        setErrorMessage(`Error fetching tasks: ${err}`);
      }
    };

    fetchList();
  }, []);

  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardHeader
          title={TASK.MY_TASKS_TITLE}
          sx={{
            textAlign: 'center',
            py: 2,
            borderBottom: '1px solid #e0e0e0'
          }}
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold'}}
        />
        <List>
          {tasks.map((task) => {
            const href = task.type === "tag-review"
              ? `/task/unmatched-tag?task=${encodeURIComponent(JSON.stringify(task))}`
              : `/task/new-explanation?task=${encodeURIComponent(JSON.stringify(task))}`;

            return (
              <NextLink key={task.taskId} href={href}>
                <ListItem
                  component="a"
                  onClick={() => handleButtonClick(task)}
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                    '&:hover': {
                      backgroundColor: '#f9f9f9'
                    },
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5
                  }}
                >
                  <Box display="flex" alignItems="center" sx={{ textDecoration: 'none' }}>
                    <TaskIcon sx={{ color: '#f38946', mr: 2 }} />
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold" color="black" sx={{ textDecoration: 'none' }}>
                          {TASK.HEADLINE(task.type)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="textSecondary" sx={{ textDecoration: 'none' }}>
                          {task.metaQuestion?.stem}
                        </Typography>
                      }
                    />
                  </Box>
                </ListItem>
              </NextLink>
            );
          })}
        </List>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Typography variant="caption" color="textSecondary">
            {TASK.NUM_ASSIGNED(tasks.length)}
          </Typography>
        </CardActions>
      </Card>
    </Stack>
  );
};

OverviewAssignedTasks.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object
};

import PropTypes from 'prop-types';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import {
  Card,
  CardActions,
  CardHeader,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SvgIcon
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Task } from '../popUps/TaskPopup';
import { TASK } from '../../constants';
import ErrorMessage from '../../components/errorMessage';

export const OverviewAssignedTasks = () => {
  const [tasks, setList] = useState([]);
  const [taskToView, setTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleButtonClick = (task) => {
    setTask(task);
  };

  const closePopup = () => {
    setTask(null);
  };

  useEffect( (task) => {handleButtonClick(task)}, []);
  useEffect( () => {closePopup()}, []);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const { tasks } = await requestServer(serverPath.VIEW_TASKS, httpsMethod.GET);
        setList(tasks);
      }
      catch(err){
        console.error('Error fetching task list:', err);
        setErrorMessage(`Error fetching tasks: ${err}`)
      }
    };

    fetchList();
  }, []);

  const handleClick = () => {};

  return (
    <Stack>
      <Card>
        <CardHeader title={TASK.MY_TASKS_TITLE} />
        <List>
          {tasks.filter(task => !task.finished).map((task) => {
            return (
              <ListItem key={task.taskId}>
                <button
                  onClick={() => handleButtonClick(task)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <ListItemText
                    primary={task.type}
                    primaryTypographyProps={{ variant: 'subtitle1' }}
                    secondary={task.description}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </button>
                <IconButton edge="end">
                  <SvgIcon>
                    <EllipsisVerticalIcon />
                  </SvgIcon>
                </IconButton>
              </ListItem>
            );
          })}
        </List>
        <ErrorMessage message={errorMessage} />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
        </CardActions>
      </Card>
      <div>
        <Task
          isOpen={taskToView != null}
          closePopup={() => closePopup()}
          task={taskToView} />
      </div>
    </Stack>
  );
};

OverviewAssignedTasks.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object
};

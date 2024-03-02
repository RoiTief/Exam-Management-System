import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import {httpsMethod, serverPath, requestServer,TOKEN_FIELD_NAME} from 'src/utils/rest-api-call';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon
} from '@mui/material';
import { useEffect, useState } from 'react';


export const OverviewAssignedTasks = () => {
 const [tasks, setList] = useState([])

 useEffect(() => {
  const fetchList = async () => {
    try {
      const {tasks} = await requestServer(serverPath.VIEW_TASKS, httpsMethod.GET);
      setList(tasks);
    }
    catch(err){
      console.error('Error fetching task list:', err)
    }
  }

  fetchList();
 }, [])
  

  return (
    <Card>
      <CardHeader title="My Tasks" />
      <List>
        {tasks.map((task) => {
          return (
            <ListItem>
              <ListItemText
                primary={task.type}
                primaryTypographyProps={{ variant: 'subtitle1' }}
                secondary={task.description}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
              <IconButton edge="end">
                <SvgIcon>
                  <EllipsisVerticalIcon />
                </SvgIcon>
              </IconButton>
            </ListItem>
          );
        })}
      </List>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
      </CardActions>
    </Card>
  );
};

OverviewAssignedTasks.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object
};

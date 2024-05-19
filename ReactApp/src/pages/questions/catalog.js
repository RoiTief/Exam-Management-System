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
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Question } from '../../sections/popUps/QuestionPopup';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';

const Page = () => {
  const [questions, setList] = useState([])
  const [questionToView, setQuestion] = useState(null);

  const handleButtonClick = (question) => {
    setQuestion(question)
  };

  const closePopup = () => {
    setQuestion(null)
  };

  useEffect( (question) => {handleButtonClick(question)}, [])
  useEffect( () => {closePopup()}, [])

  useEffect(() => {
    const fetchList = async () => {
      try {
        const {questions} = await requestServer(serverPath.VIEW_QUESTIONS, httpsMethod.GET);
        setList(questions);
      }
      catch(err){
        console.error('Error fetching question list:', err)
      }
    }

    fetchList();
  }, [])

  const handleClick = () => {}

  return (
    <Stack>
      <Card>
        <CardHeader title="Meta Questions" />
        <List>
          {questions.map((question) => {
            return (
              <ListItem>
                <button
                  onClick={() => handleButtonClick(question)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <ListItemText
                    primary={question.subject}
                    primaryTypographyProps={{ variant: 'subtitle1' }}
                    secondary={question.stem}
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
        <CardActions sx={{ justifyContent: 'flex-end' }}>
        </CardActions>
      </Card>
      <div>
        <Question
          isOpen={questionToView!=null}
          closePopup={() => closePopup()}
          question = {questionToView} />
      </div>
    </Stack>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

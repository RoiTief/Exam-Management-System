import {
  Box,
  Button,
  Card,
  CardHeader,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {httpsMethod, serverPath, requestServer} from 'src/utils/rest-api-call';
import { AddCourse } from 'src/sections/popUps/AddCoursePopup';
import { AddPersonalToCourse } from '../popUps/AddPersonalToCoursePopup';
import { AddQuestion } from '../popUps/AddQuestionPopup';
import { AssignNewTask } from '../popUps/AssignNewTaskPopup';
import { CheckStaffProgress } from '../popUps/CheckStaffProgressPopup';
import { CreateExam } from '../popUps/CreateExamPopup';
import { CreateTask } from '../popUps/CreateTaskPopup';
import { ViewCourse } from '../popUps/ViewCoursePopup';


export const OverviewUserOptions = () => {
  const [username, setUsername] = useState('');
  const [usertype, setUseType] = useState('User');
  const [PopupOpen, setPopupOpen] = useState(null);

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
      for: ['Lecturer', 'TA'], 
      title: 'View Course',
      action: 'ViewCourse',
    },
    {
      for: ['Lecturer', 'TA'], 
      title: 'Add Question',
      action: 'AddQuestion',
    },
    {
      for: ['System Admin'], 
      title: 'Add Course',
      action: 'AddCourse',
    },
    {
      for: ['Lecturer', 'TA', 'Grader'], 
      title: 'Ask for New Task',
      action: 'AssignNewTask',
    },
    {
      for: ['Lecturer'],
      title: 'Check Staff Progress',
      action: 'CheckStaffProgress',
    },
    {
      for: ['Lecturer'],
      title: 'Add New Personal To Course',
      action: 'AddPersonalToCourse',
    },
    {
      for: ['Lecturer'],
      title: 'Create Task',
      action: 'CreateTask',
    },
    {
      for: ['Lecturer'],
      title: 'Create Exam',
      action: 'CreateExam',
    }
  ];

  const handleButtonClick = (action) => {
    setPopupOpen(action)
  };

  const closePopup = () => { 
    setPopupOpen(null)
  };

  useEffect( (action) => {handleButtonClick(action)}, [])

  useEffect( () => {closePopup()}, [])

  return (
    <Stack>
    <Card>
      <CardHeader title={`Hello, ${username}`}/>
        <Stack sx={{ minWidth: 75 }}>
          <Stack component="ul" spacing={2}>
            {buttons
            .filter(button => button.for.includes(usertype))
            .map((item) => {
              return (
                <Stack>
                  <Button size="small" variant="contained"
                   type='submit' onClick={() => handleButtonClick(item.action)}>
                    {item.title}
                  </Button>            
                </Stack>
              )
            })}
          </Stack>  
        </Stack>
    </Card>
      <div>
        <AddCourse
        isOpen={PopupOpen=='AddCourse'}
        closePopup={() => closePopup()} />
      </div>
      <div>
        <AddPersonalToCourse
        isOpen={PopupOpen=='AddPersonalToCourse'}
        closePopup={() => closePopup()} />
      </div>
      <div>
        <AddQuestion
        isOpen={PopupOpen=='AddQuestion'}
        closePopup={() => closePopup()} />
      </div>
      <div>
        <AssignNewTask
        isOpen={PopupOpen=='AssignNewTask'}
        closePopup={() => closePopup()} />
      </div>
      <div>
        <CheckStaffProgress
        isOpen={PopupOpen=='CheckStaffProgress'}
        closePopup={() => closePopup()} />
      </div>
      <div>
        <CreateExam
        isOpen={PopupOpen=='CreateExam'}
        closePopup={() => closePopup()} />
      </div>
      <div>
        <CreateTask
        isOpen={PopupOpen=='CreateTask'}
        closePopup={() => closePopup()} />
      </div>
      <div>
        <ViewCourse
        isOpen={PopupOpen=='ViewCourse'}
        closePopup={() => closePopup()} />
      </div>
    </Stack>
  );
};


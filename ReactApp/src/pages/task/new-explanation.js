import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { NewExplanation } from '../../constants';
import {
  httpsMethod,
  latexServerPath,
  requestServer,
  serverPath
} from '../../utils/rest-api-call';
import { GENERATED_TASK_TYPES } from '../../../../src/main/Enums';
import dynamic from 'next/dynamic';
const QuestionPhotoView = dynamic(() => import('../../sections/popUps/QuestionPhotoView'), { ssr: false });
import ErrorMessage from 'src/components/errorMessage';
import { useRouter } from 'next/router';

const UnmatchedTags = () => {
  const router = useRouter();
  const { task } = router.query
  const [taskData, setTaskData] = useState({});
  const [originalAnswer, setOriginalAnswer] = useState({})
  const [selectedTag, setSelectedTag] = useState('');
  const [error, setError] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
      if (task) {
        try {
          const parsedTask = JSON.parse(decodeURIComponent(task));
          setTaskData(parsedTask);
          if (parsedTask.answer.tag === 'key') {
            setOriginalAnswer(parsedTask.metaQuestion.keys.find(key => key.id === parsedTask.answer.id));
          }
          else {
            setOriginalAnswer(parsedTask.metaQuestion.distractors.find(distractor => distractor.id === parsedTask.answer.id));
          }
          setError("");
        } catch (error) {
          console.error('Failed to fetch question:', error);
          setError(error.message);
        }
      }
  }, [task]);

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  useEffect(() => {
    const handleFinishTask = async () => {
      if (isFinished) {
        try {
          await requestServer(serverPath.COMPLETE_CREATED_TASK, httpsMethod.POST, taskData);
          resetStates();
        } catch (error) {
          console.error('Failed to finish task:', error);
          setError(error.message)
        }
      }
    };
    handleFinishTask();
  }, [isFinished]);

  const resetStates = () => {
    setError("");
    setIsFinished(false);
  };

  const handleSubmit = () => {
    if (selectedTag === 'new') {
      setTaskData((prevState) => ({
        ...prevState,
        metaQuestion: {...prevState.metaQuestion}
      }));
    }
    setIsFinished(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: 2 }}>
      <Container maxWidth="sm" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {NewExplanation.REVIEW_EXPLANATION}
        </Typography>
        {taskData?.metaQuestion?.appendixTag && (
          <Typography variant="h6" component="h1" gutterBottom>{NewExplanation.APPENDIX}</Typography>
        )}
        {taskData?.metaQuestion?.appendixTag && (
          <QuestionPhotoView content={taskData?.metaQuestion?.appendixTag} type={latexServerPath.COMPILE_APPENDIX}/>
        )}
        <Typography variant="h6" component="h1" gutterBottom>{NewExplanation.STEM}</Typography>
        {taskData?.metaQuestion?.stem && (
          <QuestionPhotoView content={taskData?.metaQuestion?.stem} type={latexServerPath.COMPILE_STEM}/>
        )}
        <Typography variant="h6" component="h1" gutterBottom>{NewExplanation.ANSWER}</Typography>
        {originalAnswer && (
          <QuestionPhotoView content={originalAnswer} type={latexServerPath.COMPILE_ANSWER}/>
        )}
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend"></FormLabel>
          <RadioGroup
            aria-label="tag"
            name="tag"
            value={selectedTag}
            onChange={handleTagChange}
          >
            <Typography variant="h5" component="h1" gutterBottom>{NewExplanation.TAGGED(originalAnswer?.tag)}</Typography>
            <FormControlLabel value="original" control={<Radio />} label={originalAnswer?.explanation} />
            <FormControlLabel value="new" control={<Radio />} label={taskData?.answer?.explanation} />
          </RadioGroup>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} href={"/"} disabled={!selectedTag}>
            {NewExplanation.SUBMIT}
          </Button>
        </Box>
        <ErrorMessage message={error}></ErrorMessage>
      </Container>

    </Box>
  );
};

const Page = () => {
  return (
    <UnmatchedTags/>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

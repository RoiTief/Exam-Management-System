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
import { TAG_ANSWERS } from '../../constants';
import { CheckExplanationPopup } from '../../sections/ask-work/checkExplanationPopup';
import { ProvideExplanationPopup } from '../../sections/ask-work/provideExplanationPopup';
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

const TagAnswers = () => {
  const [selectedTag, setSelectedTag] = useState('');
  const [isCheckExplanationOpen, setIsCheckExplanationOpen] = useState(false);
  const [isProvideExplanationOpen, setIsProvideExplanationOpen] = useState(false);
  const [question, setQuestion] = useState({});
  const [tag, setTag] = useState("");
  const [explanation, setExplanation] = useState("");
  const [generate, setGenerate] = useState(false);
  const [error, setError] = useState("");
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      if (Object.keys(question).length === 0) {
        try {
          const response = await requestServer(serverPath.GENERATE_TASK, httpsMethod.POST, {taskType: GENERATED_TASK_TYPES.TAG_ANSWER});
          setQuestion(response.work);
          setError("")
          return { success: true };
        } catch (error) {
          console.error('Failed to fetch question:', error);
          setError(error.message)
          return { success: false, error: error };
        }
      }
    };
    fetchRandomQuestion();
  }, [generate]);

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  useEffect(() => {
    const handleFinishTask = async () => {
      if (isFinished) {
        try {
          const changes = {
            taskType: GENERATED_TASK_TYPES.TAG_ANSWER,
            answerId: question?.answer?.id,
            userTag: tag,
            ...(explanation && { explanation: explanation })
          };
          await requestServer(serverPath.COMPLETE_GENERATED_TASK, httpsMethod.POST, changes);
          resetStates();
          return { success: true };
        } catch (error) {
          console.error('Failed to finish task:', error);
          setError(error.message)
          return { success: false, error: error };
        }
      }
    };
    handleFinishTask();
  }, [isFinished]);

  const resetStates = () => {
    setGenerate(!generate);
    setQuestion({});
    setTag("");
    setExplanation("");
    setError("");
    setIsFinished(false);
  };

  const handleSubmit = () => {
    if (selectedTag === question?.answer?.tag) {
      setIsCheckExplanationOpen(true);
    } else {
      setIsProvideExplanationOpen(true);
    }
    setTag(selectedTag);
  };

  const handleSetExplanation = (newExplanation) => {
    setExplanation(newExplanation);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: 2 }}>
      <Container maxWidth="sm" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {TAG_ANSWERS.FOLLOWING_QUESTION}
        </Typography>
        {question.appendix && (
          <Typography variant="h6" component="h1" gutterBottom>{TAG_ANSWERS.APPENDIX}</Typography>
        )}
        {question.appendix && (
          <QuestionPhotoView content={question.appendix} type={latexServerPath.COMPILE_APPENDIX}/>
        )}
        <Typography variant="h6" component="h1" gutterBottom>{TAG_ANSWERS.STEM}</Typography>
        {question.stem && (
          <QuestionPhotoView content={question.stem} type={latexServerPath.COMPILE_STEM}/>
        )}
        <Typography variant="h4" component="h1" gutterBottom>
          {TAG_ANSWERS.FOLLOWING_ANSWER}
        </Typography>
        {question.answer && (
          <QuestionPhotoView content={question.answer} type={latexServerPath.COMPILE_ANSWER}/>
        )}
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend"></FormLabel>
          <RadioGroup
            aria-label="tag"
            name="tag"
            value={selectedTag}
            onChange={handleTagChange}
          >
            <FormControlLabel value="key" control={<Radio />} label={TAG_ANSWERS.KEY} />
            <FormControlLabel value="distractor" control={<Radio />} label={TAG_ANSWERS.DISTRACTOR} />
          </RadioGroup>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!selectedTag}>
            {TAG_ANSWERS.SUBMIT}
          </Button>
        </Box>
        <ErrorMessage message={error}></ErrorMessage>
      </Container>

      <CheckExplanationPopup
        isOpen={isCheckExplanationOpen}
        closePopup={() => setIsCheckExplanationOpen(false)}
        explanation={question.answer?.explanation}
        handleWrongExplanation={() => setIsProvideExplanationOpen(true)}
        finishTask={() => setIsFinished(true)}/>

      <ProvideExplanationPopup
        isOpen={isProvideExplanationOpen}
        closePopup={() => setIsProvideExplanationOpen(false)}
        handleSetExplanation={handleSetExplanation}
        finishTask={() => setIsFinished(true)}/>

    </Box>
  );
};

const Page = () => {
  return (
    <TagAnswers/>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

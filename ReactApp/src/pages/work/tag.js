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
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      try {
        const response = await requestServer(serverPath.GENERATE_TASK, httpsMethod.POST, {taskType: GENERATED_TASK_TYPES.TAG_ANSWER});
        setQuestion(response.work);
        setTag(response.work.answer.tag);
        setExplanation(response.work.answer.explanation);
        setError("")
        return { success: true };
      } catch (error) {
        console.error('Failed to fetch question:', error);
        setError(error.message)
        return { success: false, error: error };
      }
    };
    fetchRandomQuestion();
  }, [generate]);

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleFinishTask = async () => {
    try {
      const changes = {tag: tag, explanation: explanation};
      await requestServer(serverPath.COMPLETE_GENERATED_TASK, httpsMethod.POST, {taskType: GENERATED_TASK_TYPES.TAG_ANSWER});
      setGenerate(!generate);
      return { success: true };
    } catch (error) {
      console.error('Failed to finish task:', error);
      return { success: false, error: error };
    }
  };

  const handleSubmit = () => {
    if (selectedTag === tag) {
      setIsCheckExplanationOpen(true);
    } else {
      setTag(selectedTag)
      setIsProvideExplanationOpen(true);
    }
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
      </Container>

      <CheckExplanationPopup
        isOpen={isCheckExplanationOpen}
        closePopup={() => setIsCheckExplanationOpen(false)}
        explanation={question.answer?.explanation}
        handleWrongExplanation={() => setIsProvideExplanationOpen(true)}
        generate={() => handleFinishTask()}/>

      <ProvideExplanationPopup
        isOpen={isProvideExplanationOpen}
        closePopup={() => setIsProvideExplanationOpen(false)}
        setExplanation={(newExplanation) => setExplanation(newExplanation)}
        generate={() => handleFinishTask()}/>

      <ErrorMessage message={error}></ErrorMessage>

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

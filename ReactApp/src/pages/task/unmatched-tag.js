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
import { UnmatchedTag } from '../../constants';
import { SameTagPopup } from '../../sections/tag/sameTagPopup';
import { DifferentTagPopup } from '../../sections/tag/differentTagPopup';
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
import { useRouter } from 'next/router';

const UnmatchedTags = () => {
  const router = useRouter();
  const { task } = router.query
  const [taskData, setTaskData] = useState({});
  const [originalAnswer, setOriginalAnswer] = useState({})
  const [selectedTag, setSelectedTag] = useState('');
  const [isSameTagOpen, setIsSameTagOpen] = useState(false);
  const [isDifferentTagOpen, setIsDifferentTagOpen] = useState(false);
  const [isProvideExplanationOpen, setIsProvideExplanationOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [explanation, setExplanation] = useState("");
  const [generate, setGenerate] = useState(false);
  const [error, setError] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [taDetails, setTaDetails] = useState({
    taTag: 'key',
    taExplanation: 'because this is true',
    firstName: 'Idan',
    lastName: 'Aharoni'
  });

  useEffect(() => {
    const fetchRandomQuestion = async () => {
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
          setTaDetails({
            taTag: 'key',
            taExplanation: 'because this is true',
            firstName: 'Idan',
            lastName: 'Aharoni'
          })
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
    setTag("");
    setExplanation("");
    setError("");
    setIsFinished(false);
  };

  const handleSubmit = () => {
    if (selectedTag === taDetails?.taTag) {
      setIsSameTagOpen(true);
    } else {
      setIsDifferentTagOpen(true);
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
          {UnmatchedTag.FOLLOWING_QUESTION}
        </Typography>
        {taskData?.metaQuestion?.appendixTag && (
          <Typography variant="h6" component="h1" gutterBottom>{UnmatchedTag.APPENDIX}</Typography>
        )}
        {taskData?.metaQuestion?.appendixTag && (
          <QuestionPhotoView content={taskData?.metaQuestion?.appendixTag} type={latexServerPath.COMPILE_APPENDIX}/>
        )}
        <Typography variant="h6" component="h1" gutterBottom>{UnmatchedTag.STEM}</Typography>
        {taskData?.metaQuestion?.stem && (
          <QuestionPhotoView content={taskData?.metaQuestion?.stem} type={latexServerPath.COMPILE_STEM}/>
        )}
        <Typography variant="h4" component="h1" gutterBottom>
          {UnmatchedTag.FOLLOWING_ANSWER}
        </Typography>
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
            <FormControlLabel value="key" control={<Radio />} label={UnmatchedTag.KEY} />
            <FormControlLabel value="distractor" control={<Radio />} label={UnmatchedTag.DISTRACTOR} />
          </RadioGroup>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!selectedTag}>
            {UnmatchedTag.SUBMIT}
          </Button>
        </Box>
        <ErrorMessage message={error}></ErrorMessage>
      </Container>

      <SameTagPopup
        isOpen={isSameTagOpen}
        closePopup={() => setIsSameTagOpen(false)}
        taDetails={taDetails}
        handleWrongExplanation={() => setIsProvideExplanationOpen(true)}
        finishTask={() => setIsFinished(true)}/>

      <DifferentTagPopup
        isOpen={isDifferentTagOpen}
        closePopup={() => setIsDifferentTagOpen(false)}
        taDetails={taDetails}
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
    <UnmatchedTags/>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

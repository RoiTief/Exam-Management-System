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
  requestLatexServer,
  requestServer,
  serverPath
} from '../../utils/rest-api-call';

const TagAnswers = () => {
  const [selectedTag, setSelectedTag] = useState('');
  const [isCheckExplanationOpen, setIsCheckExplanationOpen] = useState(false);
  const [isProvideExplanationOpen, setIsProvideExplanationOpen] = useState(false);
  const [metaQuestions, setMetaQuestions] = useState([])
  const [question, setQuestion] = useState({});
  const [i, setI] = useState(0);

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      try {
        const response = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
        setMetaQuestions(response.metaQuestions);
        if (response.metaQuestions.length > 0){
          handleNewQuestion(response.metaQuestions);
        }
        return { success: true };
      } catch (error) {
        console.error('Failed to fetch users:', error);
        return { success: false, error: error };
      }
    };

    fetchRandomQuestion();
  }, []);

  const handleNewQuestion = (metaQuestions) => {
    if (metaQuestions.length === 0) return;
    const newQuestion = createQuestion(metaQuestions[i]);
    setQuestion(newQuestion);
    setI((i + 1) % metaQuestions.length);
  };

  const createQuestion = (metaQuestion) => {
    return {
      appendix: metaQuestion.appendix?.content,
      stem: metaQuestion.stem,
      answer: metaQuestion.keys[0].text,
      explanation: metaQuestion.keys[0].explanation,
      tag: 'key'
    };
  }

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedTag === question.tag) {
      setIsCheckExplanationOpen(true);
    } else {
      question.tag = selectedTag;
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
          <Typography variant="body1" component="div" gutterBottom>
            {question.appendix}
          </Typography>
        )}
        <Typography variant="body1" component="div" gutterBottom>
          {question.stem}
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          {TAG_ANSWERS.FOLLOWING_ANSWER}
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
          {question.answer}
        </Typography>
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
        explanation={question.explanation}
        handleWrongExplanation={() => setIsProvideExplanationOpen(true)}
        generate={() => handleNewQuestion(metaQuestions)}/>

      <ProvideExplanationPopup
        isOpen={isProvideExplanationOpen}
        closePopup={() => setIsProvideExplanationOpen(false)}
        setExplanation={(newExplanation) => question.explanation = newExplanation}
        generate={() => true}/>

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

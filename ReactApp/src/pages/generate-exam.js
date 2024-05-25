import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import { Box, Button, Container, Typography } from '@mui/material';
import QuestionForm from '/src/sections/exam/question-form';
import QuestionList from '/src/sections/exam/question-list';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';

const Page = () => {
  const [questions, setQuestions] = useState([]);
  const [metaQuestions, setMetaQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [usedAnswers, setUsedAnswers] = useState({});
  const [usedDistractors, setUsedDistractors] = useState({});

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        const { metaQuestions } = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
        setMetaQuestions(metaQuestions);
      } catch (error) {
        console.error('Error fetching meta questions:', error);
      }
    }

    fetchMetaQuestions();
  }, []);

  const addQuestion = (question) => {
    setQuestions([...questions, question]);

    const key = `${question.stem}-${question.appendix ? question.appendix.title : ''}`;

    setUsedAnswers(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), question.answer]
    }));

    setUsedDistractors(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), ...question.distractors]
    }));

    setCurrentQuestion(null)
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        p: 2,
      }}
    >
      <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Exam
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Button variant="contained" onClick={() => setCurrentQuestion({})} sx={{ mb: 2 }}>
            + Add Question
          </Button>
          {currentQuestion && (
            <QuestionForm
              metaQuestions={metaQuestions}
              addQuestion={addQuestion}
              usedAnswers={usedAnswers}
              usedDistractors={usedDistractors}
            />
          )}
          <QuestionList questions={questions} />
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Save Test
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
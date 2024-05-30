import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import { Box, Button, Container, Typography } from '@mui/material';
import QuestionForm from '/src/sections/exam/question-form';
import QuestionList from '/src/sections/exam/question-list';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();
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
      [key]: [...(prev[key] || []), question.key]
    }));

    setUsedDistractors(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), ...question.distractors]
    }));

    setCurrentQuestion(null)
  };

  const saveTest = async () => {
    try {
      console.log(JSON.stringify(questions))
      await requestServer(serverPath.CREATE_TEST, httpsMethod.POST, questions);
      await router.push('/');
    } catch (error) {
      console.error('Error fetching meta questions:', error);
    }
  }
  
  const removeQuestion = (index) => {
    const questionToRemove = questions[index];
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);

    const key = `${questionToRemove.stem}-${questionToRemove.appendix ? questionToRemove.appendix.title : ''}`;

    setUsedAnswers(prevUsedAnswers => {
      const updatedAnswers = { ...prevUsedAnswers };
      updatedAnswers[key] = updatedAnswers[key].filter(a => a.text !== questionToRemove.key.text);
      return updatedAnswers;
    });

    setUsedDistractors(prevUsedDistractors => {
      const updatedDistractors = { ...prevUsedDistractors };
      updatedDistractors[key] = updatedDistractors[key].filter(d =>
          !questionToRemove.distractors.some(dist => dist.text === d.text)
      );
      return updatedDistractors;
    });
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
              usedKeys={usedAnswers}
              usedDistractors={usedDistractors}
            />
          )}
          <QuestionList questions={questions} removeQuestion={removeQuestion} />
          <Button variant="contained" color="primary" sx={{ mt: 2 }}
          onClick={saveTest}>
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
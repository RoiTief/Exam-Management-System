import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import { Box, Button, Container, Typography } from '@mui/material';
import QuestionForm from '/src/sections/exam/question-form';
import QuestionList from '/src/sections/exam/question-list';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';

const data = [
  {
    stem: 'S1',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key3']
  },
  {
    stem: 'S2',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "title1", tag: "tag", content: "appendix1 content"}
  },
  {
    stem: 'S3',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "title1", tag: "tag", content: "appendix2 content"}
  },
  {
    stem: 'S4',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "title1", tag: "tag", content: "appendix1 content"}
  },
  {
    stem: 'S5',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key3']
  }
]

const Page = () => {
  const [questions, setQuestions] = useState([]);
  const [metaQuestions, setMetaQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        // const response = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
        // setMetaQuestions(response);
        setMetaQuestions(data)
      } catch (error) {
        console.error('Error fetching meta questions:', error);
      }
    }

    fetchMetaQuestions();
  }, []);

  const addQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        p: 2,
      }}
    >
      <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Exam Management
        </Typography>
        <Button variant="contained" onClick={() => setCurrentQuestion({})} sx={{ mb: 2 }}>
          + Add Question
        </Button>
        {currentQuestion && (
          <QuestionForm
            metaQuestions={metaQuestions}
            addQuestion={addQuestion}
            onClose={() => setCurrentQuestion(null)}
          />
        )}
        <QuestionList questions={questions} />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Test
        </Button>
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
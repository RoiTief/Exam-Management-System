import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import { Box, Button, Container, Typography } from '@mui/material';
import QuestionForm from '/src/sections/exam/question-form';
import QuestionList from '/src/sections/exam/question-list';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';

const data = [
  {
    stem: 'what did Idan listen to when he was a kid',
    correctAnswers: [{text:'baby motzart', explanation: 'explanation1'},
      {text:'baby bethoven', explanation: 'explanation2'}],
    distractors: [{text:'Machrozet Chaffla', explanation: 'explanation1'},
      {text:'zohar Argov', explanation: 'explanation2'}, {text:'Begins "tzachtzachim" speach', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key3']
  },
  {
    stem: "what is Mor's last name",
    correctAnswers: [{text:'Abo', explanation: 'explanation1'},
      {text:'Abu', explanation: 'explanation2'}],
    distractors: [{text:'abow', explanation: 'explanation1'},
      {text:'abou', explanation: 'explanation2'}, {text:'aboo', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "Mor's ID", tag: "tag", content: "imagine there is my id here"}
  },
  {
    stem: "What is Roi's nickname",
    correctAnswers: [{text:'The Tief', explanation: 'explanation1'},
      {text:"Gali's soon to be husband", explanation: 'explanation2'}],
    distractors: [{text:'that blonde guy', explanation: 'explanation1'},
      {text:'that tall guy', explanation: 'explanation2'}, {text:'the one with the black nail polish', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "Roi picture", tag: "tag", content: "some amberesing picture of roi"}
  },
  {
    stem: 'How old is Mor',
    correctAnswers: [{text:'25', explanation: 'explanation1'},
      {text:'22 with "vetek"', explanation: 'explanation2'}],
    distractors: [{text:'19 (but thank you)', explanation: 'explanation1'},
      {text:'30', explanation: 'explanation2'}, {text:'35', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "Mor's ID", tag: "tag", content: "imagine there is my id here"}
  },
  {
    stem: 'where does Ofek leave',
    correctAnswers: [{text:'in Gan Yavne', explanation: 'explanation1'},
      {text:'next to the orange square', explanation: 'explanation2'},
      {text:"next to mor's brother", explanation: 'explanation1'}],
    distractors: [{text:'at the beach - surffing', explanation: 'explanation1'},
      {text:'riding bike in the fields', explanation: 'explanation2'}, {text:"in may's house", explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key3']
  }
]

const Page = () => {
  const [questions, setQuestions] = useState([]);
  const [metaQuestions, setMetaQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [usedAnswers, setUsedAnswers] = useState({});
  const [usedDistractors, setUsedDistractors] = useState({});

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        // const { metaQuestions } = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
        // setMetaQuestions(metaQuestions);
        //TODO - Remove line 68 and the data and use lines 65-66
        setMetaQuestions(data)
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
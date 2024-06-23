import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer, latexServerPath } from 'src/utils/rest-api-call';
import { Box, Button, Container, Typography } from '@mui/material';
import QuestionList from '/src/sections/create-exam/question-list';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { PdfLatexPopup } from '../sections/popUps/QuestionPdfView';
import { EXAM } from '../constants';
import ErrorMessage from '../components/errorMessage';
import { AddQuestionToExamPopup } from '../sections/create-exam/add-question-to-exam-popup';

const Page = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [metaQuestions, setMetaQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showPdfView, setShowPdfView] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        const { metaQuestions } = await requestServer(serverPath.GET_META_QUESTIONS_FOR_EXAM, httpsMethod.GET);
        setMetaQuestions(metaQuestions);
      } catch (error) {
        console.error('Error fetching meta questions:', error);
        setErrorMessage(`Error fetching meta questions: ${error}`)
      }
    }

    fetchMetaQuestions();
  }, [setQuestions]);

  const addQuestion = async (question, AutomaticGenerateState) => {
    try{
      console.log(question)
      let request = AutomaticGenerateState ? serverPath.ADD_AUTOMATIC_META_QUESTION : serverPath.ADD_MANUAL_META_QUESTION
      const { examQuestion } = await requestServer(request, httpsMethod.POST, { question });
      console.log(examQuestion)
      setQuestions([...questions, examQuestion]);
      setCurrentQuestion(null)

    } catch (err) {
      setErrorMessage(err.message)
    }
  };

  const saveTest = async () => {
    try {
      setShowPdfView(true)
      await requestServer(serverPath.CREATE_EXAM, httpsMethod.POST, questions);
    } catch (error) {
      console.error('Error creating exam:', error);
      setErrorMessage(`Error creating exam: ${error}`)
    }
  }

  const removeQuestion = async (index) => {
    try {
      const questionToRemove = questions[index];
      await requestServer(serverPath.REMOVE_QUESTION_FROM_EXAM, httpsMethod.POST, questionToRemove);
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } catch (err) {
      setErrorMessage(err.message)
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedQuestions = Array.from(questions);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);
    setQuestions(reorderedQuestions);
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
          {EXAM.PAGE_TITLE}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Button variant="contained" onClick={() => setCurrentQuestion({})} sx={{ mb: 2 }}>
            {EXAM.ADD_QUESTION_BUTTON}
          </Button>
          <AddQuestionToExamPopup
            isOpen={currentQuestion!==null}
            closePopup={() => setCurrentQuestion(null)}
            metaQuestions={metaQuestions}
            addQuestion={addQuestion}
            />
          <QuestionList questions={questions}
                        removeQuestion={removeQuestion}
                        onDragEnd={onDragEnd}/>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}
                  onClick={saveTest}>
            {EXAM.SAVE_TEST_BUTTON}
          </Button>
          <ErrorMessage message={errorMessage} />
        </Box>
      </Container>
      {showPdfView &&
        <PdfLatexPopup isOpen={showPdfView}
                       closePopup={() => setShowPdfView(false)}
                       content={questions}
                       type= {latexServerPath.COMPILE_EXAM} />
      }
    </Box>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

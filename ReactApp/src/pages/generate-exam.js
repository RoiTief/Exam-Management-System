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
  const [usedAnswers, setUsedAnswers] = useState({});
  const [usedDistractors, setUsedDistractors] = useState({});
  const [showPdfView, setShowPdfView] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        const { metaQuestions } = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
        setMetaQuestions(metaQuestions);
      } catch (error) {
        console.error('Error fetching meta questions:', error);
        setErrorMessage(`Error fetching meta questions: ${error}`)
      }
    }

    fetchMetaQuestions();
  }, []);

  const addQuestion = async (question, AutomaticGenerateState) => {

    try{
      console.log(question)
      let request = AutomaticGenerateState ? serverPath.ADD_AUTOMATIC_META_QUESTION : serverPath.ADD_MANUAL_META_QUESTION
      const { examQuestion } = await requestServer(request, httpsMethod.POST, { question });
      console.log(examQuestion)
      setQuestions([...questions, examQuestion]);

      const key = `${examQuestion.stem}-${examQuestion.appendix ? examQuestion.appendix.title : ''}`;

      setUsedAnswers(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), examQuestion.key]
      }));

      setUsedDistractors(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), ...examQuestion.distractors]
      }));

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
            usedKeys={usedAnswers}
            usedDistractors={usedDistractors}
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

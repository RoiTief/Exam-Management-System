import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer, latexServerPath } from 'src/utils/rest-api-call';
import { Box, Button, Container, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Input } from '@mui/material';
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
  const [showDialog, setShowDialog] = useState(false);
  const [numVersions, setNumVersions] = useState(1);
  const [examReason, setExamReason] = useState('');

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        const { metaQuestions } = await requestServer(serverPath.GET_META_QUESTIONS_FOR_EXAM, httpsMethod.GET);
        setMetaQuestions(metaQuestions);
        setErrorMessage('')
      } catch (error) {
        console.error('Error fetching meta questions:', error);
        setErrorMessage(`Error fetching meta questions: ${error}`)
      }
    }

    fetchMetaQuestions();
  }, [setQuestions]);

  const addQuestion = async (question, AutomaticGenerateState) => {
    try{
      let request = AutomaticGenerateState ? serverPath.ADD_AUTOMATIC_META_QUESTION : serverPath.ADD_MANUAL_META_QUESTION
      const { examQuestion } = await requestServer(request, httpsMethod.POST, { question });
      setQuestions([...questions, examQuestion]);
      setCurrentQuestion(null)
      setErrorMessage('')
    } catch (err) {
      setErrorMessage(err.message)
    }
  };

  const saveTest = async () => {
    setShowDialog(false);
    try {
      await requestServer(serverPath.CREATE_EXAM, httpsMethod.POST, { questions, numVersions, examReason });
      await router.push('/');
      setErrorMessage('')
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
      setErrorMessage('')
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
      <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {EXAM.PAGE_TITLE}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button variant="contained" onClick={() => setCurrentQuestion({})} sx={{ mb: 2 }}>
            {EXAM.ADD_QUESTION_BUTTON}
          </Button>
          <AddQuestionToExamPopup
            isOpen={currentQuestion !== null}
            closePopup={() => setCurrentQuestion(null)}
            metaQuestions={metaQuestions}
            addQuestion={addQuestion}
          />
          <QuestionList questions={questions}
                        removeQuestion={removeQuestion}
                        onDragEnd={onDragEnd} />
          <Stack direction="row" spacing={2} padding={4}>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}
                    onClick={() => setShowDialog(true)}
                    disabled={questions.length===0}>
              {EXAM.SAVE_TEST_BUTTON}
            </Button>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }}
                    onClick={() => setShowPdfView(true)}
                    disabled={questions.length===0}>
              {EXAM.EXAM_PREVIEW_BUTTON}
            </Button>
          </Stack>
          <ErrorMessage message={errorMessage} />
        </Box>
      </Container>
      {showPdfView &&
        <PdfLatexPopup isOpen={showPdfView}
                       closePopup={() => setShowPdfView(false)}
                       content={questions}
                       type={latexServerPath.COMPILE_EXAM} />
      }
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Exam Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label={EXAM.NUMBER_VERSIONS}
            type="number"
            fullWidth
            variant="standard"
            value={numVersions}
            onChange={(e) => setNumVersions(parseInt(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
          />
          <TextField
            margin="dense"
            label={EXAM.EXAM_REASON}
            type="text"
            fullWidth
            variant="standard"
            value={examReason}
            onChange={(e) => setExamReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={saveTest}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

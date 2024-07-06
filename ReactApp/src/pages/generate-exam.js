import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer, latexServerPath } from 'src/utils/rest-api-call';
import { Box, Button, Container, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Input } from '@mui/material';
import QuestionList from '/src/sections/create-exam/question-list';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { PdfLatexPopup } from '../sections/popUps/QuestionPdfView';
import { EXAM } from '../constants';
import ErrorMessage from '../components/errorMessage';
import { AddQuestionToExamPopup } from '../sections/create-exam/add-question-to-exam-popup';
import useRouterOverride from '../hooks/use-router';

const Page = () => {
  const router = useRouterOverride();
  const [questions, setQuestions] = useState([]);
  const [metaQuestions, setMetaQuestions] = useState([]);
  const [isAddQuestionPopupOpen, setIsAddQuestionPopupOpen] = useState(false);
  const [usedAnswers, setUsedAnswers] = useState({});
  const [usedDistractors, setUsedDistractors] = useState({});
  const [showPdfView, setShowPdfView] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [numVersions, setNumVersions] = useState(1);
  const [examReason, setExamReason] = useState('');

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        const { metaQuestions } = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
        setMetaQuestions(metaQuestions);
        setErrorMessage('')
      } catch (error) {
        console.error('Error fetching meta questions:', error);
        setErrorMessage(`Error fetching meta questions: ${error}`)
      }
    }

    fetchMetaQuestions();
  }, []);

  async function addQuestion(question) {
    let examQuestion = extractQuestion(question)
    setQuestions(prevQuestions => [...prevQuestions, examQuestion]);

    setUsedAnswers(prev => ({
      ...prev,
      [examQuestion.id]: [...(prev[examQuestion.id] || []), examQuestion.key]
    }));

    setUsedDistractors(prev => ({
      ...prev,
      [examQuestion.id]: [...(prev[examQuestion.id] || []), ...examQuestion.distractors]
    }));

    setIsAddQuestionPopupOpen(false)
    setErrorMessage('')
  }

  const extractQuestion = (question) => {
    return {
      id: question.selectedMetaQuestion.id,
      stem: question.selectedMetaQuestion.stem,
      key: question.selectedKey,
      distractors:question.selectedDistractors,
    ...( question.selectedMetaQuestion.appendix && {appendix: question.selectedMetaQuestion.appendix})
    }
  }

  const saveTest = async () => {
    setShowDialog(false);
    try {
      await requestServer(serverPath.CREATE_EXAM, httpsMethod.POST, { questions, numVersions, examReason });
      await router.push('/');
      setErrorMessage('')
    } catch (error) {
      console.error('Error creating exam:', error.message);
      setErrorMessage(`Error creating exam: ${error.message}`)
    }
  }

  const removeQuestion = async (index) => {
    const questionToRemove = questions[index];
    const updatedQuestions = questions.filter((_, i) => i !== index);
    await setQuestions(updatedQuestions);

    setUsedAnswers(prevUsedAnswers => {
      const updatedAnswers = { ...prevUsedAnswers };
      updatedAnswers[questionToRemove.id] = updatedAnswers[questionToRemove.id].filter(a => a.text !== questionToRemove.key.text);
      return updatedAnswers;
    });

    setUsedDistractors(prevUsedDistractors => {
      const updatedDistractors = { ...prevUsedDistractors };
      updatedDistractors[questionToRemove.id] = updatedDistractors[questionToRemove.id].filter(d =>
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
      <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {EXAM.PAGE_TITLE}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button variant="contained" onClick={() => setIsAddQuestionPopupOpen(true)} sx={{ mb: 2 }}>
            {EXAM.ADD_QUESTION_BUTTON}
          </Button>
          <AddQuestionToExamPopup
            isOpen={isAddQuestionPopupOpen}
            closePopup={() => setIsAddQuestionPopupOpen(false)}
            metaQuestions={metaQuestions}
            addQuestion={addQuestion}
            usedKeys={usedAnswers}
            usedDistractors={usedDistractors}
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

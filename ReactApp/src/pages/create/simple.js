import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, IconButton } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { router } from 'next/client';

const Page = () => {
  const [stem, setStem] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState([{ text: '', isRTL: false }]);
  const [distractors, setDistractors] = useState([{ text: '', isRTL: false }]);
  const [isStemRTL, setIsStemRTL] = useState(false);

  const handleStemChange = (e) => {
    setStem(e.target.value);
  };

  const handleCorrectAnswerChange = (index, e) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[index].text = e.target.value;
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleDistractorChange = (index, e) => {
    const newDistractors = [...distractors];
    newDistractors[index].text = e.target.value;
    setDistractors(newDistractors);
  };

  const addCorrectAnswer = () => {
    setCorrectAnswers([...correctAnswers, { text: '', isRTL: false }]);
  };

  const removeCorrectAnswer = (index) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers.splice(index, 1);
    setCorrectAnswers(newCorrectAnswers);
  };

  const addDistractor = () => {
    setDistractors([...distractors, { text: '', isRTL: false }]);
  };

  const removeDistractor = (index) => {
    const newDistractors = [...distractors];
    newDistractors.splice(index, 1);
    setDistractors(newDistractors);
  };

  const toggleStemDirection = () => {
    setIsStemRTL(!isStemRTL);
  };

  const toggleCorrectAnswerDirection = (index) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[index].isRTL = !newCorrectAnswers[index].isRTL;
    setCorrectAnswers(newCorrectAnswers);
  };

  const toggleDistractorDirection = (index) => {
    const newDistractors = [...distractors];
    newDistractors[index].isRTL = !newDistractors[index].isRTL;
    setDistractors(newDistractors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const metaQuestion = {
      stem,
      correctAnswers: correctAnswers.map((item) => item.text),
      distractors: distractors.map((item) => item.text),
    };
    console.log(metaQuestion);
    router.push('/');
    // Submit the metaQuestion object to your backend or API

  };

  return (
    <>
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0', // Set the desired background color here
        padding: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Simple Meta-Question
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Stem"
              value={stem}
              onChange={handleStemChange}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              sx={{ direction: isStemRTL ? 'rtl' : 'ltr', mb: 1 }}
            />
            <IconButton onClick={toggleStemDirection}>
              {isStemRTL ? <FormatTextdirectionLToR /> : <FormatTextdirectionRToL />}
            </IconButton>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h3">
              Correct Answers:
            </Typography>
            {correctAnswers.map((answer, index) => (
              <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <TextField
                  value={answer.text}
                  onChange={(e) => handleCorrectAnswerChange(index, e)}
                  multiline
                  rows={2}
                  fullWidth
                  variant="outlined"
                  sx={{ direction: answer.isRTL ? 'rtl' : 'ltr', mr: 1 }}
                />
                <IconButton onClick={() => toggleCorrectAnswerDirection(index)}>
                  {answer.isRTL ? <FormatTextdirectionLToR /> : <FormatTextdirectionRToL />}
                </IconButton>
                <IconButton onClick={() => removeCorrectAnswer(index)}>
                  <RemoveCircleOutline />
                </IconButton>
              </Box>
            ))}
            <IconButton onClick={addCorrectAnswer}>
              <AddCircleOutline />
            </IconButton>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h3">
              Distractors:
            </Typography>
            {distractors.map((distractor, index) => (
              <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <TextField
                  value={distractor.text}
                  onChange={(e) => handleDistractorChange(index, e)}
                  multiline
                  rows={2}
                  fullWidth
                  variant="outlined"
                  sx={{ direction: distractor.isRTL ? 'rtl' : 'ltr', mr: 1 }}
                />
                <IconButton onClick={() => toggleDistractorDirection(index)}>
                  {distractor.isRTL ? <FormatTextdirectionLToR /> : <FormatTextdirectionRToL />}
                </IconButton>
                <IconButton onClick={() => removeDistractor(index)}>
                  <RemoveCircleOutline />
                </IconButton>
              </Box>
            ))}
            <IconButton onClick={addDistractor}>
              <AddCircleOutline />
            </IconButton>
          </Box>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
      </Container>
    </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

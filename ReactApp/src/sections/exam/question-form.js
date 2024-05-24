import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Divider
} from '@mui/material';
import StemSelection from './stem-selection';
import AnswerSelection from './answer-selection';
import DistractorSelection from './distractor-selection';

function QuestionForm({ metaQuestions, addQuestion, onClose }) {
  const [selectedMetaQuestion, setSelectedMetaQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedDistractors, setSelectedDistractors] = useState([]);

  const handleSaveQuestion = () => {
    addQuestion({
      stem: selectedMetaQuestion.stem,
      appendix: selectedMetaQuestion.appendix,
      answer: selectedAnswer,
      distractors: selectedDistractors
    });
    onClose();
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Exam Question
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ py: 2 }}>
        <StemSelection metaQuestions={metaQuestions} onSelect={setSelectedMetaQuestion} />
        {selectedMetaQuestion && (
          <>
            <AnswerSelection answers={selectedMetaQuestion.correctAnswers} onSelect={setSelectedAnswer} />
            {selectedAnswer && <DistractorSelection distractors={selectedMetaQuestion.distractors} onSelect={setSelectedDistractors} />}
          </>
        )}
      </Box>
      <Button variant="contained" onClick={handleSaveQuestion} disabled={!selectedMetaQuestion || !selectedAnswer}>
        Save Question
      </Button>
    </Container>
  );
}

export default QuestionForm;

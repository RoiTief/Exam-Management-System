import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

function AnswerSelection({ answers, onSelect }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
    onSelect(answer);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" component="h2" mb={2}>
        Select The Correct Answer
      </Typography>
      {answers.map((answer, index) => (
        <Button
          key={index}
          variant="outlined"
          onClick={() => handleSelectAnswer(answer)}
          sx={{ mr: 1, mb: 1, backgroundColor: selectedAnswer === answer ? '#59b61b' : 'inherit', color: selectedAnswer === answer ? '#fff' : 'inherit' }}
        >
          {answer.text}
        </Button>
      ))}
    </Box>
  );
}

export default AnswerSelection;

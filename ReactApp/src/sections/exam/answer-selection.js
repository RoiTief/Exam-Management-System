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
      <Typography variant="h6" component="h2">
        Select an Answer
      </Typography>
      {answers.map((answer, index) => (
        <Button
          key={index}
          variant="outlined"
          onClick={() => handleSelectAnswer(answer)}
          sx={{ mr: 1, mb: 1, backgroundColor: selectedAnswer === answer ? '#f87217' : 'inherit', color: selectedAnswer === answer ? '#fff' : 'inherit' }}
        >
          {answer.text}
        </Button>
      ))}
    </Box>
  );
}

export default AnswerSelection;

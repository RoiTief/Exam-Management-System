import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

function AnswerSelection({ answers, onSelect }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  console.log(`there are ${answers.length} answers`)
  const handleSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
    onSelect(answer);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" component="h2" mb={2}>
        Select The Correct Answer
      </Typography>
      {answers.length != 0 ? (
        <>
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
        </>
      )  : (
        <Stack>
          <Typography variant="h10" component="h7" mb={2}>
            There are no available answers for this question!
          </Typography>
          <Typography variant="h10" component="h7" mb={2}>
            Please choose a different question
          </Typography>
        </Stack>
      )
      }
    </Box>
  );
}

export default AnswerSelection;

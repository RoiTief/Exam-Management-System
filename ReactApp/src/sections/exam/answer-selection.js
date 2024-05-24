import React from 'react';
import { Box, Button, Typography } from '@mui/material';

function AnswerSelection({ answers, onSelect }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" component="h2">
        Select an Answer
      </Typography>
      {answers.map((answer, index) => (
        <Button key={index} variant="outlined" sx={{ mr: 1, mb: 1 }} onClick={() => onSelect(answer)}>
          {answer.text}
        </Button>
      ))}
    </Box>
  );
}

export default AnswerSelection;

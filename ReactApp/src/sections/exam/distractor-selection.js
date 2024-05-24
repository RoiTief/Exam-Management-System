import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

function DistractorSelection({ distractors, onSelect }) {
  const [selectedDistractors, setSelectedDistractors] = useState([]);

  const handleSelectDistractor = (distractor) => {
    const newSelectedDistractors = [...selectedDistractors, distractor];
    setSelectedDistractors(newSelectedDistractors);
    onSelect(newSelectedDistractors);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" component="h2">
        Select Distractors
      </Typography>
      {distractors.map((distractor, index) => (
        <Button key={index} variant="outlined" sx={{ mr: 1, mb: 1 }} onClick={() => handleSelectDistractor(distractor)}>
          {distractor.text}
        </Button>
      ))}
    </Box>
  );
}

export default DistractorSelection;

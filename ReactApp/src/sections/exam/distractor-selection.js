import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

function DistractorSelection({ distractors, onSelect }) {
  const [selectedDistractors, setSelectedDistractors] = useState([]);

  const handleSelectDistractor = (distractor) => {
    let newSelectedDistractors;
    if (selectedDistractors.includes(distractor)){
      newSelectedDistractors = selectedDistractors.filter(item => item !== distractor);
    }
    else {
      newSelectedDistractors = [...selectedDistractors, distractor];
    }
    setSelectedDistractors(newSelectedDistractors);
    onSelect(newSelectedDistractors);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" component="h2" mb={2}>
        Select Distractors
      </Typography>
      {distractors.map((distractor, index) => (
        <Button
          key={index}
          variant="outlined"
          onClick={() => handleSelectDistractor(distractor)}
          sx={{ mr: 1, mb: 1, backgroundColor: selectedDistractors.includes(distractor) ? '#f84c4c' : 'inherit', color: selectedDistractors.includes(distractor) ? '#fff' : 'inherit' }}
        >
          {distractor.text}
        </Button>
      ))}
    </Box>
  );
}

export default DistractorSelection;

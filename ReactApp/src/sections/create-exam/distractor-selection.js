import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Stack, Button } from '@mui/material';
import { EXAM } from '../../constants';

function DistractorSelection({ distractors, onSelect }) {
  const [selectedDistractors, setSelectedDistractors] = useState([]);

  const handleToggleDistractor = (distractor) => {
    const currentIndex = selectedDistractors.indexOf(distractor);
    const newSelectedDistractors = [...selectedDistractors];

    if (currentIndex === -1) {
      if (newSelectedDistractors.length < EXAM.MAX_DISTRACTOR_NUMBER) { // Limit selection to 4
        newSelectedDistractors.push(distractor);
      }
    } else {
      newSelectedDistractors.splice(currentIndex, 1);
    }

    setSelectedDistractors(newSelectedDistractors);
    onSelect(newSelectedDistractors);
  };

  const isChecked = (distractor) => selectedDistractors.indexOf(distractor) !== -1;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" component="h2" mb={2}>
        {EXAM.SELECT_DISTRACTORS_HEADING}
      </Typography>
      <Typography variant="body1" component="h2" mb={2}>
        {EXAM.SELECT_DISTRACTORS_BODY}
      </Typography>
      {distractors.length !== 0 ? (
        <Stack direction="column">
          {distractors.map((distractor, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={isChecked(distractor)}
                  onChange={() => handleToggleDistractor(distractor)}
                  color="primary"
                />
              }
              label={distractor.text}
              sx={{ mb: 1 }}
            />
          ))}
          {selectedDistractors.length === EXAM.MAX_DISTRACTOR_NUMBER && (
            <Typography variant="body3" sx={{ mt: 1, color: 'neutral.500' }}>
              {EXAM.DISTRACTORS_MAX_AMOUNT}
            </Typography>
          )}
        </Stack>
      ) : (
        <Stack>
          <Typography variant="h6" component="h6" mb={2}>
            {EXAM.NO_DISTRACTORS_MESSAGE_1}
          </Typography>
          <Typography variant="h6" component="h6" mb={2}>
            {EXAM.NO_DISTRACTORS_MESSAGE_2}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export default DistractorSelection;

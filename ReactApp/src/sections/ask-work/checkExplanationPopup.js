import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { TAG_ANSWERS } from '../../constants';

export const CheckExplanationPopup = ({ isOpen, closePopup, explanation, handleWrongExplanation, generate }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedOption === 'no') {
      handleWrongExplanation();
    } else {
      generate();
    }
    closePopup();
  };

  return (
    <Dialog open={isOpen} onClose={closePopup}>
      <DialogTitle>{TAG_ANSWERS.EXPLANATION_CORRECT}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {explanation}
        </Typography>
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <RadioGroup
            aria-label="explanation-correct"
            name="explanationCorrect"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label={TAG_ANSWERS.YES} />
            <FormControlLabel value="no" control={<Radio />} label={TAG_ANSWERS.NO} />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={closePopup} color="primary">
          {TAG_ANSWERS.CLOSE}
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={!selectedOption}>
          {TAG_ANSWERS.SUBMIT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { TAG_ANSWERS } from '../../constants';

export const ProvideExplanationPopup = ({ isOpen, closePopup, handleSetExplanation, finishTask }) => {
  const [newExplanation, setNewExplanation] = useState('');

  const handleChange = (event) => {
    setNewExplanation(event.target.value);
  };

  const handleSubmit = () => {
    handleSetExplanation(newExplanation);
    finishTask();
    closePopup();
  };

  return (
    <Dialog open={isOpen} onClose={closePopup}>
      <DialogTitle>{TAG_ANSWERS.PROVIDE_EXPLANATION}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Explanation"
          type="text"
          fullWidth
          value={newExplanation}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closePopup} color="primary">
          {TAG_ANSWERS.CLOSE}
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={!newExplanation}>
          {TAG_ANSWERS.SUBMIT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

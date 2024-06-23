import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import { TAG_ANSWERS } from '../../constants';
import React from 'react';

export const CheckExplanationPopup = ({isOpen, closePopup}) => {
  return (
    <Dialog open={isOpen} onClose={closePopup}>
      <DialogTitle>{TAG_ANSWERS.EXPLANATION_CORRECT}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Is This explanation Correct?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closePopup} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

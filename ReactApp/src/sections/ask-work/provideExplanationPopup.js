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

export const ProvideExplanationPopup = ({isOpen, closePopup}) => {
  return (
    <Dialog open={isOpen} onClose={closePopup}>
      <DialogTitle>{TAG_ANSWERS.PROVIDE_EXPLANATION}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Please provide an explanation for your chosen tag.
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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import { UnmatchedTag } from '../../constants';

export const SameTagPopup = ({ isOpen, closePopup, taDetails, taExplanation, handleWrongExplanation, handleSetExplanation, finishTask }) => {
  const handleOptionClick = (option) => {
    if (option === 'no') {
      handleWrongExplanation();
    } else {
      handleSetExplanation(taExplanation);
      finishTask();
    }
    closePopup();
  };

  return (
    <Dialog open={isOpen} onClose={closePopup}>
      <DialogTitle>{UnmatchedTag.THINKS_SAME(taDetails?.firstName, taDetails?.lastName)}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {taExplanation}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleOptionClick('yes')} color="primary">
          {UnmatchedTag.APPROVE}
        </Button>
        <Button onClick={() => handleOptionClick('no')} color="primary">
          {UnmatchedTag.REJECT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

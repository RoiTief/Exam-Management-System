import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import { UnmatchedTag } from '../../constants';

export const DifferentTagPopup = ({ isOpen, closePopup, taDetails, finishTask }) => {

  const handleSubmit = () => {
    finishTask();
    closePopup();
  };

  return (
    <Dialog open={isOpen} onClose={closePopup}>
      <DialogTitle>{UnmatchedTag.THINKS_DIFFERENT(taDetails.firstName, taDetails.lastName)}</DialogTitle>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          {UnmatchedTag.SURE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

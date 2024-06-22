import React, { useState } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { EXAM } from '../../constants';

function StemSelection({ metaQuestions, onSelect, reselectStem }) {
  const [temporarySelectedStem, setTemporarySelectedStem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
  };

  const handleNext = () => {
    onSelect(temporarySelectedStem);
    reselectStem(); // Reset selected distractors when a new stem is chosen
  };

  const handleDeselect = () => {
    setTemporarySelectedStem(null);
    onSelect(null);
  };

  return (
    <Box>
      <RadioGroup
        value={temporarySelectedStem ? temporarySelectedStem.stem : ''}
        onChange={(event) => {
          const selectedStem = metaQuestions.find(q => q.stem === event.target.value);
          setTemporarySelectedStem(selectedStem);
        }}
      >
        {metaQuestions.map((metaQuestion, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FormControlLabel
              value={metaQuestion.stem}
              control={<Radio />}
              label={metaQuestion.stem}
              sx={{ flexGrow: 1 }}
            />
            {metaQuestion.appendix && (
              <Button variant="outlined" onClick={() => handleOpenDialog(metaQuestion.appendix)}>
                {EXAM.APPENDIX_HEADING}
              </Button>
            )}
          </Box>
        ))}
      </RadioGroup>
      <Button variant="contained" onClick={handleNext} disabled={!temporarySelectedStem}>
        {EXAM.NEXT}
      </Button>
      <Button variant="outlined" onClick={handleDeselect} sx={{ ml: 2 }}>
        {EXAM.DESELECT_QUESTION}
      </Button>


      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {dialogContent && (
          <>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                {dialogContent.content}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
}

export default StemSelection;

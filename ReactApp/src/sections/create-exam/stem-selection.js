import React, { useState } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { EXAM } from '../../constants';

function StemSelection({ metaQuestions, onSelect, reselectStem }) {
  const [temporarySelectedStem, setTemporarySelectedStem] = useState(null);
  const [showNextButton, setShowNextButton] = useState(true); // State to manage visibility of Next button
  const [showDeselectButton, setShowDeselectButton] = useState(false); // State to manage visibility of Deselect button
  const [dialogContent, setDialogContent] = useState(null);

  const handleCloseDialog = () => {
    setDialogContent(null);
  };

  const handleNext = () => {
    onSelect(temporarySelectedStem);
    reselectStem(); // Reset selected distractors when a new stem is chosen
    setShowNextButton(false); // Hide Next button after pressing it
    setShowDeselectButton(true); // Show Deselect button after pressing Next
  };

  const handleDeselect = () => {
    setTemporarySelectedStem(null);
    onSelect(null);
    setShowNextButton(true); // Show Next button again after deselecting
    setShowDeselectButton(false); // Hide Deselect button after deselecting
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
              <Button variant="outlined" onClick={() => setDialogContent(metaQuestion.appendix)}>
                {EXAM.APPENDIX_HEADING}
              </Button>
            )}
          </Box>
        ))}
      </RadioGroup>

      {showNextButton && (
        <Button variant="contained" onClick={handleNext} disabled={!temporarySelectedStem}>
          {EXAM.NEXT}
        </Button>
      )}

      {showDeselectButton && (
        <Button variant="outlined" onClick={handleDeselect} sx={{ ml: 2 }}>
          {EXAM.DESELECT_QUESTION}
        </Button>
      )}

      <Dialog open={dialogContent!==null} onClose={handleCloseDialog}>
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

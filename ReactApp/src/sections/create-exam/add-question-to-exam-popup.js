import { overlayStyle, popupStyle } from '../popUps/popup-style';
import { Button, Typography, Divider, Box, FormControlLabel, Switch } from '@mui/material';
import React, { useState } from 'react';
import { EXAM } from '../../constants';
import StemSelection from './stem-selection';
import KeySelection from './keys-selection';
import DistractorSelection from './distractor-selection';

export const AddQuestionToExamPopup = ({isOpen, closePopup, metaQuestions, addQuestion}) => {

  const [selectedMetaQuestion, setSelectedMetaQuestion] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedDistractors, setSelectedDistractors] = useState([]);
  const [generateState, setGenerateState] = useState(false); // Use boolean for simplicity

  const handleSaveQuestion = () => {
    addQuestion({
      stem: selectedMetaQuestion.stem,
      appendix: selectedMetaQuestion.appendix,
      key: selectedKey,
      distractors: selectedDistractors
    }, generateState);
    handleClosePopup()
  };

  const handleClosePopup = () => {
    setSelectedDistractors([])
    setSelectedKey(null);
    setSelectedMetaQuestion(null);
    closePopup()
  }

  const handleReSelectStem = () => {
    setSelectedKey(null);
    setSelectedDistractors([]);
  };

  const handleGenerateStateChange = (event) => {
    setGenerateState(event.target.checked);
  };

  const isSaveButtonDisabled = !selectedMetaQuestion ||
    (!generateState && (!selectedKey || selectedDistractors.length < EXAM.MAX_DISTRACTOR_NUMBER));

  return (
    isOpen ? (
      <div className="popup">
        <div onClick={handleClosePopup} style={overlayStyle}></div>
        <div className="popup-content" style={{ ...popupStyle, width: '40%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {EXAM.SELECT_QUESTION_HEADING}
            </Typography>
            <FormControlLabel
              control={<Switch checked={generateState} onChange={handleGenerateStateChange} size="large" />} // Enlarge the switch here
              label={EXAM.AUTOMATIC_STATE}
            />
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ py: 2 }}>
            <StemSelection
              metaQuestions={metaQuestions}
              onSelect={setSelectedMetaQuestion}
              reselectStem={handleReSelectStem}
              generateState={generateState ? 'automatic' : 'manual'} // Pass generateState to StemSelection
            />
            <Divider/>
            {!generateState && selectedMetaQuestion && (
              <>
                <KeySelection keys={selectedMetaQuestion.keys} onSelect={setSelectedKey} />
                <Divider/>
                {selectedKey && <DistractorSelection distractors={selectedMetaQuestion.distractors} onSelect={setSelectedDistractors} />}
              </>
            )}
          </Box>
          <Button variant="contained" onClick={handleSaveQuestion}
                  disabled={isSaveButtonDisabled}>
            {EXAM.SAVE_QUESTION_BUTTON}
          </Button>
        </div>
      </div>
    ) : null
  );
};

import { overlayStyle, popupStyle } from '../popUps/popup-style';
import { Button, Typography, Divider, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { COURSE_STAFF, EXAM } from '../../constants';
import StemSelection from './stem-selection';
import KeySelection from './keys-selection';
import DistractorSelection from './distractor-selection';

export const AddQuestionToExamPopup = ({isOpen, closePopup, metaQuestions, addQuestion, usedKeys, usedDistractors}) => {

  const [selectedMetaQuestion, setSelectedMetaQuestion] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedDistractors, setSelectedDistractors] = useState([]);

  const handleSaveQuestion = () => {
    addQuestion({
      stem: selectedMetaQuestion.stem,
      appendix: selectedMetaQuestion.appendix,
      key: selectedKey,
      distractors: selectedDistractors
    });
  };

  const handleReSelectStem = () => {
    setSelectedKey(null);
    setSelectedDistractors([]);
  };

  const getFilteredOptions = (options, usedOptions, key) => {
    return options.filter(option => !usedOptions[key]?.some(usedOption => usedOption.text === option.text));
  };

  const filteredKeys = selectedMetaQuestion
    ? getFilteredOptions(selectedMetaQuestion.keys, usedKeys, `${selectedMetaQuestion.stem}-${selectedMetaQuestion.appendix?.title || ''}`)
    : [];

  const filteredDistractors = selectedMetaQuestion
    ? getFilteredOptions(selectedMetaQuestion.distractors, usedDistractors, `${selectedMetaQuestion.stem}-${selectedMetaQuestion.appendix?.title || ''}`)
    : [];


  return (
    isOpen ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={{ ...popupStyle, width: '30%' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {EXAM.SELECT_QUESTION_HEADING}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ py: 2 }}>
            <StemSelection
              metaQuestions={metaQuestions}
              onSelect={setSelectedMetaQuestion}
              reselectStem={handleReSelectStem}
            />
            <Divider/>
            {selectedMetaQuestion && (
              <>
                <KeySelection keys={filteredKeys} onSelect={setSelectedKey} />
                <Divider/>
                {selectedKey && <DistractorSelection distractors={filteredDistractors} onSelect={setSelectedDistractors} />}
              </>
            )}
          </Box>
          <Button variant="contained" onClick={handleSaveQuestion} disabled={!selectedMetaQuestion || !selectedKey}>
            {EXAM.SAVE_QUESTION_BUTTON}
          </Button>
        </div>
      </div>
    ) : null
  );
};

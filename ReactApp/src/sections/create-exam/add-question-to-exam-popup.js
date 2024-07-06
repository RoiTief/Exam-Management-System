import { overlayStyle, popupStyle } from '../popUps/popup-style';
import { Button, Typography, Divider, Box, FormControlLabel, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { EXAM } from '../../constants';
import StemSelection from './stem-selection';
import KeySelection from './keys-selection';
import DistractorSelection from './distractor-selection';

export const AddQuestionToExamPopup = ({isOpen, closePopup, metaQuestions, addQuestion, usedKeys, usedDistractors}) => {

  const [selectedMetaQuestion, setSelectedMetaQuestion] = useState(null);
  const [repeatValue, setRepeatValue] = useState(1);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedDistractors, setSelectedDistractors] = useState([]);
  const [generateState, setGenerateState] = useState(true); // Use boolean for simplicity

  const handleSaveQuestion = async () => {
    let localUsedKeys = usedKeys
    let localUsedDistractors = usedDistractors
    let selectedKeyValue;
    let selectedDistractorsValue;
    const repetitions = generateState ? repeatValue : 1;

    for (let i = 0; i < repetitions; i++) {
      if (generateState) {
        ({ selectedKeyValue, selectedDistractorsValue, localUsedKeys, localUsedDistractors } =
          saveAutomaticQuestion(localUsedKeys, localUsedDistractors));
      } else {
        selectedKeyValue = selectedKey;
        selectedDistractorsValue = selectedDistractors;
      }

      addQuestion({
        selectedMetaQuestion,
        selectedKey: selectedKeyValue,
        selectedDistractors: selectedDistractorsValue
      });
    }

    handleClosePopup();
  };

  const saveAutomaticQuestion = (localUsedKeys, localUsedDistractors) => {
    let localFilteredKeys = getFilteredOptions(selectedMetaQuestion.keys, localUsedKeys, selectedMetaQuestion.id)
    let keyIndex = Math.floor(Math.random() * localFilteredKeys.length);
    let selectedKeyValue = localFilteredKeys[keyIndex]
    localUsedKeys = {
      ...localUsedKeys,
      [selectedMetaQuestion.id]: [...(localUsedKeys[selectedMetaQuestion.id] || []), selectedKeyValue]
    }

    let localFilteredDistractors = getFilteredOptions(selectedMetaQuestion.distractors, localUsedDistractors, selectedMetaQuestion.id)
    // Shuffle the filteredKeys
    const shuffled = localFilteredDistractors.sort(() => 0.5 - Math.random());
    const selectedDistractorsValue = shuffled.slice(0, EXAM.MAX_DISTRACTOR_NUMBER);
    localUsedDistractors = {
      ...localUsedDistractors,
      [selectedMetaQuestion.id]: [...(localUsedDistractors[selectedMetaQuestion.id] || []), ...selectedDistractorsValue]
    }

    return { selectedKeyValue, selectedDistractorsValue, localUsedKeys, localUsedDistractors };
  }

  const handleClosePopup = () => {
    setSelectedDistractors([])
    setSelectedKey(null);
    setSelectedMetaQuestion(null);
    closePopup()
    setGenerateState(true)
    setRepeatValue(1)
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

  const getFilteredOptions = (options, usedOptions, key) => {
    return options.filter(option => {
      if (usedOptions[key]) {
        return !usedOptions[key].some(usedOption => usedOption.text === option.text);
      } else {
        return true; // or handle the case where usedOptions[key] is not defined
      }
    });
  };

  let filteredKeys = () => {
    return getFilteredOptions(selectedMetaQuestion.keys, usedKeys, selectedMetaQuestion.id)
  }

  let filteredDistractors = () => {
    return getFilteredOptions(selectedMetaQuestion.distractors, usedDistractors, selectedMetaQuestion.id)
  }

  let filteredQuestions = metaQuestions.filter((mq) =>
    getFilteredOptions(mq.keys, usedKeys, mq.id).length >= 1 &&
    getFilteredOptions(mq.distractors, usedDistractors, mq.id).length >= EXAM.MAX_DISTRACTOR_NUMBER
  )

  const calcMaxNumberOfQuestion = (mq) => {
    let keyLen = getFilteredOptions(mq.keys, usedKeys, mq.id).length
    let distactorLen = getFilteredOptions(mq.distractors, usedDistractors, mq.id).length
    return Math.min(keyLen, distactorLen/EXAM.MAX_DISTRACTOR_NUMBER)
  }



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
              metaQuestions={filteredQuestions}
              onSelect={setSelectedMetaQuestion}
              reselectStem={handleReSelectStem}
              generateState={generateState}
              maxNumberOfQuestion={(mq) => calcMaxNumberOfQuestion(mq)}
              setRepeatValue={setRepeatValue}
              repeatValue={repeatValue}
            />
            <Divider/>
            {!generateState && selectedMetaQuestion && (
              <>
                <KeySelection keys={filteredKeys()} onSelect={setSelectedKey} />
                <Divider/>
                {selectedKey && <DistractorSelection distractors={filteredDistractors()} onSelect={setSelectedDistractors} />}
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

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Divider
} from '@mui/material';
import StemSelection from './stem-selection';
import KeySelection from './keys-selection';
import DistractorSelection from './distractor-selection';

function QuestionForm({ metaQuestions, addQuestion, usedKeys, usedDistractors}) {
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
    console.log({usedOptions})
    console.log({key})
    return options.filter(option => !usedOptions[key]?.some(usedOption => usedOption.text === option.text));
  };

  const filteredKeys = selectedMetaQuestion
    ? getFilteredOptions(selectedMetaQuestion.keys, usedKeys, `${selectedMetaQuestion.stem}-${selectedMetaQuestion.appendix?.title || ''}`)
    : [];

  const filteredDistractors = selectedMetaQuestion
    ? getFilteredOptions(selectedMetaQuestion.distractors, usedDistractors, `${selectedMetaQuestion.stem}-${selectedMetaQuestion.appendix?.title || ''}`)
    : [];

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Select a Question:
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ py: 2 }}>
        <StemSelection
          metaQuestions={metaQuestions}
          onSelect={setSelectedMetaQuestion}
          reselectStem={handleReSelectStem}
        />
        {selectedMetaQuestion && (
          <>
            <KeySelection keys={filteredKeys} onSelect={setSelectedKey} />
            {selectedKey && <DistractorSelection distractors={filteredDistractors} onSelect={setSelectedDistractors} />}
          </>
        )}
      </Box>
      <Button variant="contained" onClick={handleSaveQuestion} disabled={!selectedMetaQuestion || !selectedKey}>
        Save Question
      </Button>
    </Container>
  );
}

export default QuestionForm;

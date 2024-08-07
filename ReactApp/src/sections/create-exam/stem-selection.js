import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField, Stack
} from '@mui/material';
import { EXAM } from '../../constants';
import { QuestionsSearch } from '../view-questions/question-search';
import ErrorMessage from '../../components/errorMessage';

function StemSelection({ metaQuestions, onSelect, reselectStem, generateState, maxNumberOfQuestion, setRepeatValue, repeatValue }) {
  const [dialogContent, setDialogContent] = useState(null);
  const [selectedMetaQuestion, setSelectedMetaQuestion] = useState(null);
  const [filteredData, setFilteredData] = useState(metaQuestions);
  const [maxValueErrorMessage, setMaxValueErrorMessage] = useState('');

  const handleCloseDialog = () => {
    setDialogContent(null);
  };

  const handleRadioClick = (question) => {
    if (selectedMetaQuestion === question) {
      setSelectedMetaQuestion(null);
      onSelect(null);
      reselectStem();
    } else {
      setSelectedMetaQuestion(question);
      onSelect(question);
      reselectStem();
    }
  };

  const handleSearch = (text) => {
    const filteredQuestions = metaQuestions.filter(question =>
      question.stem.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredQuestions);
  };

  const handleKeySearch = (keys) => {
    const filteredQuestions = metaQuestions.filter(question =>
      keys.every(key =>
        question.keywords.some(keyword =>
          keyword.toLowerCase().includes(key.toString().toLowerCase())
        )
      )
    );
    setFilteredData(filteredQuestions);
  };
  const handleRepeatValueChange = (event) => {
    const inputValue = Number(event.target.value);
    if (!isNaN(inputValue) && inputValue >= 1 && Math.floor(inputValue) === inputValue) {
      if (inputValue > maxNumberOfQuestion(selectedMetaQuestion)) {
        setMaxValueErrorMessage(EXAM.MAXIMUM_REPEAT)
      } else {
        setRepeatValue(inputValue);
        setMaxValueErrorMessage('')
      }
    }
  }

  const numberInputStyles = {
    '& input[type=number]::-webkit-inner-spin-button': {
      WebkitAppearance: 'inner-spin-button',
      opacity: 1
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      WebkitAppearance: 'inner-spin-button',
      opacity: 1
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" component="h2" mb={2}>
        {EXAM.SELECT_STEM_HEADING}
      </Typography>
      {selectedMetaQuestion === null && (
        <QuestionsSearch onSearch={handleKeySearch}
                         onTextSearch={handleSearch} />
      )}
      <RadioGroup value={selectedMetaQuestion ? selectedMetaQuestion.stem : ''}>
        {filteredData.map((metaQuestion, index) => (
            <Box
              key={index}
              sx={{
                display:
                  selectedMetaQuestion === null || selectedMetaQuestion === metaQuestion ? 'flex' : 'none',
                alignItems: 'center',
                mb: 1
              }}
            >
              <FormControlLabel
                value={metaQuestion.stem}
                control={<Radio />}
                label={metaQuestion.stem}
                sx={{ flexGrow: 1 }}
                onClick={() => handleRadioClick(metaQuestion)}
              />
              <Stack direction='column'>
              <Box>
                {generateState && selectedMetaQuestion === metaQuestion && (
                  <TextField
                    type="number"
                    value={repeatValue}
                    onChange={handleRepeatValueChange}
                    variant="outlined"
                    label="repeated"
                    sx={{ width: 70, height: '45px', ...numberInputStyles }}  // Adjusted width for clarity
                  />
                )}
                {metaQuestion.appendix && (
                  <Button
                    variant="outlined"
                    onClick={() => setDialogContent(metaQuestion.appendix)}
                    sx={{ marginLeft: generateState && selectedMetaQuestion === metaQuestion ? 2 : 0, minHeight: '40px' }}
                  >
                    {EXAM.APPENDIX_HEADING}
                  </Button>
                )}
              </Box>
                {generateState && selectedMetaQuestion === metaQuestion && maxValueErrorMessage && maxValueErrorMessage &&
                  <div style={{
                    color: 'red',
                    marginTop: '8px',
                    width: '200px',
                    wordWrap: 'break-word',
                    fontSize: '12px'
                  }}>
                    {maxValueErrorMessage}
                  </div> }
                  </Stack>
                  </Box>
                  ))}
              </RadioGroup>

              <Dialog open={dialogContent !== null} onClose={handleCloseDialog}>
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

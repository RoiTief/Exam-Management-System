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
} from '@mui/material';
import { EXAM } from '../../constants';
import { QuestionsSearch } from '../view-questions/question-search';

function StemSelection({ metaQuestions, onSelect, reselectStem }) {
  const [dialogContent, setDialogContent] = useState(null);
  const [selectedMetaQuestion, setSelectedMetaQuestion] = useState(null);
  const [filteredData, setFilteredData] = useState(metaQuestions);

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
            {metaQuestion.appendix && (
              <Button variant="outlined" onClick={() => setDialogContent(metaQuestion.appendix)}>
                {EXAM.APPENDIX_HEADING}
              </Button>
            )}
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

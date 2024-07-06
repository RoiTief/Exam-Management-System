import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { overlayStyle, popupStyle } from './popup-style';
import { Box, Typography, Divider, Button, TextField, Stack } from '@mui/material';
import { EXAM } from '../../constants';
import { PdfLatexPopup } from '../popUps/QuestionPdfView';
import { latexServerPath } from '../../utils/rest-api-call';
import { ANSWER_TYPES } from '../../../../src/main/Enums';

export const ExamPopup = ({ isOpen, closePopup, exam, setShowPdfView }) => {
  const [selectedVersion, setSelectedVersion] = useState(1);

  const handleVersionChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1 && value <= exam.numVersions) {
      setSelectedVersion(value);
    }
  };
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
    isOpen ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={{ ...popupStyle, width: '50%' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            {exam.examReason}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Number of Versions: {exam.numVersions}
          </Typography>
          {exam.questions.length > 0 && (
            <Box mt={2} paddingY={2}>
              {exam.questions.map((question, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ minWidth: '30px', mr: 2 }}>
                      <Typography variant="h6" component="h3">
                        {index + 1}.
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {question.appendix && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="subtitle1">
                            {EXAM.APPENDIX_TITLE} {question.appendix.title}
                          </Typography>
                          <Typography variant="body2">
                            {question.appendix.content}
                          </Typography>
                        </Box>
                      )}
                      <Typography variant="h6" component="h3">
                        {EXAM.QUESTION_HEADING}: {question.stem}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                        <Typography variant="body1" sx={{ minWidth: '80px' }}>
                          {EXAM.ANSWER_HEADING}:
                        </Typography>
                        <Typography variant="body2">
                          - {question.answers.find(a => a.tag === ANSWER_TYPES.KEY).text}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                        <Typography variant="body1" sx={{ minWidth: '80px' }}>
                          {EXAM.DISTRACTORS_HEADING}:
                        </Typography>
                        <Box>
                          {question.answers.filter(a => a.tag === ANSWER_TYPES.DISTRACTOR).
                            map((distractor, idx) => (
                              <Typography key={idx} variant="body2">
                                - {distractor.text}
                              </Typography>
                            ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </Box>
          )}
          <Stack direction="row" justifyContent="center" spacing={5} padding={2}>
            <TextField
              label="Version to show"
              type="number"
              inputProps={{ min: 1, max: exam.numVersions }}
              value={selectedVersion}
              onChange={handleVersionChange}
              sx={{ width: 115, mr: 2, ...numberInputStyles }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowPdfView(selectedVersion)}
            >
              Show as PDF
            </Button>
          </Stack>
        </div>
      </div>
    ) : null
  );
};

ExamPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  exam: PropTypes.object.isRequired,
};

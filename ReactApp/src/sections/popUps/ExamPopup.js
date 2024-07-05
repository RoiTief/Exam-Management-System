import PropTypes from 'prop-types';
import { overlayStyle, popupStyle } from './popup-style';
import { Box, Typography, Divider, Button } from '@mui/material';
import React from 'react';
import { EXAM } from '../../constants';

export const ExamPopup = ({ isOpen, closePopup, exam }) => {
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
            <Box mt={2} paddingY={3}>
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
                          - {question.key.text}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                        <Typography variant="body1" sx={{ minWidth: '80px' }}>
                          {EXAM.DISTRACTORS_HEADING}:
                        </Typography>
                        <Box>
                          {question.distractors.map((distractor, idx) => (
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

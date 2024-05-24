import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

function QuestionList({ questions }) {
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Created Questions
      </Typography>
      {questions.map((question, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3">
            Stem: {question.stem}
          </Typography>
          {question.appendix && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1">
                Appendix: {question.appendix.title}
              </Typography>
              <Typography variant="body2">
                {question.appendix.content}
              </Typography>
            </Box>
          )}
          <Typography variant="body1">
            Answer: {question.answer.text}
          </Typography>
          <Typography variant="body2">
            Distractors: {question.distractors.map(d => d.text).join(', ')}
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
}

export default QuestionList;

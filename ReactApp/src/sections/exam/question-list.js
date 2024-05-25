import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

function QuestionList({ questions }) {
  return (
    questions.length > 0 && (
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Created Questions
        </Typography>
        {questions.map((question, index) => (
          <Box key={index} sx={{ mb: 2 }}>
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
            <Typography variant="h6" component="h3">
              Question: {question.stem}
            </Typography>
            <Typography variant="body1">
              Answer:
            </Typography>
            <Typography variant="body2">
              - {question.answer.text}
            </Typography>
            <Typography variant="body1">
              Distractors:
            </Typography>
            {question.distractors.map(d =>
              <Typography variant="body2">
                - {d.text}
              </Typography>
              )}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Box>
    )
  );
}

export default QuestionList;

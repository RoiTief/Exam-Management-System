import React from 'react';
import { Box, Typography, Divider, IconButton, Stack } from '@mui/material';
import { RemoveCircleOutline } from '@mui/icons-material';

function QuestionList({ questions, removeQuestion }) {
  return (
    questions.length > 0 && (
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Created Questions
        </Typography>
        {questions.map((question, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Stack direction="row">
              <Box sx={{ flex: 1 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="body1" sx={{ minWidth: '80px' }}>
                    Answer:
                  </Typography>
                  <Typography variant="body2">
                    - {question.key.text}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="body1" sx={{ minWidth: '80px' }}>
                    Distractors:
                  </Typography>
                  <Box>
                    {question.distractors.map((d, i) => (
                      <Typography key={i} variant="body2">
                        - {d.text}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
              <IconButton onClick={() => removeQuestion(index)} sx={{ mt: 2 }}>
                <RemoveCircleOutline />
              </IconButton>
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Box>
    )
  );
}

export default QuestionList;

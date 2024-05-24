import React from 'react';
import { Box, Button, Typography } from '@mui/material';

function StemSelection({ metaQuestions, onSelect }) {
  const handleSelectStem = (metaQuestion) => {
    onSelect(metaQuestion);
  };

  const groupedStems = metaQuestions.reduce((acc, question) => {
    if (question.appendix) {
      const appendixIndex = acc.findIndex(item => item.title === question.appendix.title);
      if (appendixIndex !== -1) {
        acc[appendixIndex].stems.push(question);
      } else {
        acc.push({ ...question.appendix, stems: [question] });
      }
    } else {
      acc.push({ title: null, stems: [question] });
    }
    return acc;
  }, []);

  return (
    <Box>
      <Typography variant="h6" component="h2">
        Select a Stem
      </Typography>
      {groupedStems.map((group, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          {group.title ? (
            <>
              <Typography variant="subtitle1">
                Appendix: {group.title}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {group.content}
              </Typography>
              {group.stems.map((metaQuestion, idx) => (
                <Button key={idx} variant="outlined" sx={{ mr: 1, mb: 1 }} onClick={() => handleSelectStem(metaQuestion)}>
                  {metaQuestion.stem}
                </Button>
              ))}
            </>
          ) : (
            group.stems.map((metaQuestion, idx) => (
              <Button key={idx} variant="outlined" sx={{ mr: 1, mb: 1 }} onClick={() => handleSelectStem(metaQuestion)}>
                {metaQuestion.stem}
              </Button>
            ))
          )}
        </Box>
      ))}
    </Box>
  );
}

export default StemSelection;

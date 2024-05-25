import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

function StemSelection({ metaQuestions, onSelect, reselectStem }) {
  const [selectedMetaQuestion, setSelectedMetaQuestion] = useState(null)

  const handleSelectStem = (metaQuestion) => {
    if (selectedMetaQuestion === metaQuestion) {
      onSelect(null);
      setSelectedMetaQuestion(null)
      reselectStem();
    }
    else {
      onSelect(metaQuestion);
      setSelectedMetaQuestion(metaQuestion)
      reselectStem(); // Reset selected distractors when a new stem is chosen
    }
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
      {groupedStems.map((group, index) => (
      <Box key={index} sx={{ mb: 2 }}>
          {group.title ? (
            <>
              <Box sx = {{ display: selectedMetaQuestion === null ||
                                    (selectedMetaQuestion &&
                                    selectedMetaQuestion.appendix &&
                                    group.title === selectedMetaQuestion.appendix.title) ?
                                    'inline-block' : 'none' }}>
                <Typography variant="subtitle1">
                  Appendix: {group.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {group.content}
                </Typography>

                {group.stems.map((metaQuestion, idx) => (
                  <Button
                    key={idx}
                    variant="outlined"
                    onClick={() => handleSelectStem(metaQuestion)}
                    sx={{
                      mr: 1,
                      mb: 1,
                      backgroundColor: selectedMetaQuestion === metaQuestion ? '#f87217' : 'inherit',
                      color: selectedMetaQuestion === metaQuestion ? '#fff' : 'inherit',
                      display: selectedMetaQuestion === null || selectedMetaQuestion === metaQuestion ? 'inline-block' : 'none',
                    }}
                  >
                    {metaQuestion.stem}
                  </Button>
                ))}
              </Box>
            </>
          ) : (
            group.stems.map((metaQuestion, stemIndex) => (
              <Button
                key={stemIndex}
                variant="outlined"
                onClick={() => handleSelectStem(metaQuestion)}
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: selectedMetaQuestion === metaQuestion ? '#f87217' : 'inherit',
                  color: selectedMetaQuestion === metaQuestion ? '#fff' : 'inherit',
                  display: selectedMetaQuestion === null || selectedMetaQuestion === metaQuestion ? 'inline-block' : 'none',
                }}
              >
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

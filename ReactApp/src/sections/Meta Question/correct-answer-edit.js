import React from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import { AddCircleOutline, RemoveCircleOutline, FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';

const CorrectAnswersSection = ({ values, handleChange, handleBlur, setFieldValue }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" component="h3">Correct Answers:</Typography>
    <FieldArray name="correctAnswers">
      {({ remove, push }) => (
        <>
          {values.correctAnswers.map((answer, index) => (
            <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Box key={index} sx={{ mb: 1, flex: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    name={`correctAnswers[${index}].text`}
                    value={values.correctAnswers[index].text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    placeholder="Answer"
                    sx={{ direction: values.correctAnswers[index].isTextRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue(`correctAnswers[${index}].isTextRTL`, !values.correctAnswers[index].isTextRTL)}>
                    {values.correctAnswers[index].isTextRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    name={`correctAnswers[${index}].explanation`}
                    value={values.correctAnswers[index].explanation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    placeholder="Explanation"
                    sx={{ direction: values.correctAnswers[index].isExplanationRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue(`correctAnswers[${index}].isExplanationRTL`, !values.correctAnswers[index].isExplanationRTL)}>
                    {values.correctAnswers[index].isExplanationRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                  </IconButton>
                </Box>
              </Box>
              <IconButton onClick={() => remove(index)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
          <IconButton onClick={() => push({ text: '', explanation: '' })}>
            <AddCircleOutline />
          </IconButton>
        </>
      )}
    </FieldArray>
  </Box>
);

export default CorrectAnswersSection;

import React from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import { AddCircleOutline, RemoveCircleOutline, FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';

const DistractorsSection = ({ values, handleChange, handleBlur, setFieldValue }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" component="h3">Distractors:</Typography>
    <FieldArray name="distractors">
      {({ remove, push }) => (
        <>
          {values.distractors.map((distractor, index) => (
            <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Box key={index} sx={{ mb: 1, flex: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    name={`distractors[${index}].text`}
                    value={values.distractors[index].text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    placeholder="Distractor"
                    sx={{ direction: values.distractors[index].isTextRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue(`distractors[${index}].isTextRTL`, !values.distractors[index].isTextRTL)}>
                    {values.distractors[index].isTextRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    name={`distractors[${index}].explanation`}
                    value={values.distractors[index].explanation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    placeholder="Explanation"
                    sx={{ direction: values.distractors[index].isExplanationRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue(`distractors[${index}].isExplanationRTL`, !values.distractors[index].isExplanationRTL)}>
                    {values.distractors[index].isExplanationRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
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

export default DistractorsSection;
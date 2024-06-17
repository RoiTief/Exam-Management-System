import React from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import { AddCircleOutline, RemoveCircleOutline, FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';
import { CREATE_QUESTION } from '../../constants';

const KeysSection = ({ values, handleChange, handleBlur, setFieldValue }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" component="h3">{CREATE_QUESTION.KEY_TITLE}</Typography>
    <FieldArray name="keys">
      {({ remove, push }) => (
        <>
          {values.keys.map((answer, index) => (
            <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Box key={index} sx={{ mb: 1, flex: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    name={`keys[${index}].text`}
                    value={values.keys[index].text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    placeholder="Answer"
                    sx={{ direction: values.keys[index].isTextRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue(`keys[${index}].isTextRTL`, !values.keys[index].isTextRTL)}>
                    {values.keys[index].isTextRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    name={`keys[${index}].explanation`}
                    value={values.keys[index].explanation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    placeholder="Explanation"
                    sx={{ direction: values.keys[index].isExplanationRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue(`keys[${index}].isExplanationRTL`, !values.keys[index].isExplanationRTL)}>
                    {values.keys[index].isExplanationRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
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

export default KeysSection;

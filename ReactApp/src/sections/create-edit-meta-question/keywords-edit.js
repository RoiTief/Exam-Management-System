import React, { useEffect } from 'react';
import { Box, TextField, Chip, Typography } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { CREATE_QUESTION } from '../../constants';

const KeywordsSection = ({ values, handleChange, handleBlur, error, helperText }) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    console.log('Keywords:', values.keywords); // Log the keywords to debug
  }, [values.keywords]);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {CREATE_QUESTION.KEYWORDS_INSTRUCTION}
        </Typography>
      </Box>
      <FieldArray name="keywords">
        {({ push, remove }) => (
          <Box sx={{ mb: 1 }}>
            {values.keywords.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                onDelete={() => remove(index)}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
            <TextField
              error={error}
              helperText={helperText}
              label={CREATE_QUESTION.KEYWORDS_TITLE}
              placeholder="Add Keyword To Describe The Question"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim() !== '') {
                  push(e.target.value.trim());
                  setFieldValue('keywords', [...values.keywords, e.target.value.trim()]); // Ensure the keywords array is updated
                  e.target.value = '';
                }
              }}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>
        )}
      </FieldArray>
    </Box>
  );
};

export default KeywordsSection;

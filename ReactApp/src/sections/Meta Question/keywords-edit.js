import React from 'react';
import { Box, TextField, Chip, Typography } from '@mui/material';
import { FieldArray } from 'formik';

const KeywordsSection = ({ values, handleChange, handleBlur }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" component="h3">Keywords:</Typography>
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
            placeholder="Add Keyword To Describe The Question"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim() !== '') {
                push(e.target.value.trim());
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

export default KeywordsSection;

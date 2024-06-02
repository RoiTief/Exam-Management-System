import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';
import { CREATE_QUESTION } from '../../constants';

const StemSection = ({ values, handleChange, handleBlur, setFieldValue }) => (
  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
    <TextField
      label={CREATE_QUESTION.META_QUESTION_TITLE}
      name="stem"
      value={values.stem}
      onChange={handleChange}
      onBlur={handleBlur}
      multiline
      rows={4}
      fullWidth
      variant="outlined"
      sx={{ direction: values.isStemRTL ? 'rtl' : 'ltr', mr: 1 }}
    />
    <IconButton onClick={() => setFieldValue('isStemRTL', !values.isStemRTL)}>
      {values.isStemRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
    </IconButton>
  </Box>
);

export default StemSection;

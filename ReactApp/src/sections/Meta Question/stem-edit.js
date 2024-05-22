import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';

const StemSection = ({ values, handleChange, handleBlur, setFieldValue }) => (
  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
    <TextField
      label="Stem"
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

import React from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';

const AppendixSection = ({ values, handleChange, handleBlur, setFieldValue }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6" component="h3">Appendix:</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <TextField
        label="Title"
        name="appendix.title"
        value={values.appendix.title}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        variant="outlined"
        sx={{ direction: values.appendix.isTitleRTL ? 'rtl' : 'ltr', mr: 1 }}
      />
      <IconButton onClick={() => setFieldValue('appendix.isTitleRTL', !values.appendix.isTitleRTL)}>
        {values.appendix.isTitleRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
      </IconButton>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <TextField
        label="Tag"
        name="appendix.tag"
        value={values.appendix.tag}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        variant="outlined"
        sx={{ direction: values.appendix.isTagRTL ? 'rtl' : 'ltr', mr: 1 }}
      />
      <IconButton onClick={() => setFieldValue('appendix.isTagRTL', !values.appendix.isTagRTL)}>
        {values.appendix.isTagRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
      </IconButton>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <TextField
        label="Content"
        name="appendix.content"
        value={values.appendix.content}
        onChange={handleChange}
        onBlur={handleBlur}
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        sx={{ direction: values.appendix.isContentRTL ? 'rtl' : 'ltr', mr: 1 }}
      />
      <IconButton onClick={() => setFieldValue('appendix.isContentRTL', !values.appendix.isContentRTL)}>
        {values.appendix.isContentRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
      </IconButton>
    </Box>
  </Box>
);

export default AppendixSection;

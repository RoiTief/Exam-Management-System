import React, { useState } from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Stack } from '@mui/material';
import { EXAM } from '../../constants';

function KeySelection({ keys, onSelect }) {
  const [selectedKey, setSelectedKey] = useState(null);

  const handleSelectKey = (key) => {
    if (selectedKey === key) {
      setSelectedKey(null); // Deselect if clicking the selected key again
      onSelect(null); // Notify parent component of deselection
    } else {
      setSelectedKey(key);
      onSelect(key); // Notify parent component of selection
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" component="h2" mb={2}>
        {EXAM.SELECT_KEY_HEADING}
      </Typography>
      {keys.length !== 0 ? (
        <RadioGroup value={selectedKey ? selectedKey.text : ''}>
          {keys.map((key, index) => (
            <Box key={index}
                 sx={{
                   display: selectedKey === null || selectedKey === key ? 'flex' : 'none',
                   alignItems: 'center',
                   mb: 1
                 }}>
              <FormControlLabel
                value={key.text}
                control={<Radio />}
                label={key.text}
                onClick={() => handleSelectKey(key)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          ))}
        </RadioGroup>
      ) : (
        <Stack>
          <Typography variant="h6" component="h6" mb={2}>
            {EXAM.NO_KEYS_MESSAGE_1}
          </Typography>
          <Typography variant="h6" component="h6" mb={2}>
            {EXAM.NO_KEYS_MESSAGE_2}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export default KeySelection;

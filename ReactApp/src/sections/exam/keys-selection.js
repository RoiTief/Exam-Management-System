import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

function KeySelection({ keys, onSelect }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const handleSelectKey = (key) => {
    setSelectedKey(key);
    onSelect(key);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" component="h2" mb={2}>
        Select The Correct Key
      </Typography>
      {keys.length != 0 ? (
        <>
          {keys.map((key, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleSelectKey(key)}
              sx={{ mr: 1, mb: 1, backgroundColor: selectedKey === key ? '#59b61b' : 'inherit', color: selectedKey === key ? '#fff' : 'inherit' }}
            >
              {key.answer}
            </Button>
          ))}
        </>
      )  : (
        <Stack>
          <Typography variant="h10" component="h7" mb={2}>
            There are no available keys for this question!
          </Typography>
          <Typography variant="h10" component="h7" mb={2}>
            Please choose a different question
          </Typography>
        </Stack>
      )
      }
    </Box>
  );
}

export default KeySelection;

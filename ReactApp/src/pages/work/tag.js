import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { TAG_ANSWERS } from '../../constants';

const Page = () => {
  const [selectedTag, setSelectedTag] = useState('');

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the submit action here
    console.log(`Tagging answer as: ${selectedTag}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', padding: 2 }}>
      <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {TAG_ANSWERS.FOLLOWING_QUESTION}
        </Typography>
        {question.appendix && (
          <Typography variant="body1" component="div" gutterBottom>
            {question.appendix}
          </Typography>
        )}
        <Typography variant="body1" component="div" gutterBottom>
          {question.stem}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {TAG_ANSWERS.FOLLOWING_ANSWER}
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
          {question.answer}
        </Typography>
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend"></FormLabel>
          <RadioGroup
            aria-label="tag"
            name="tag"
            value={selectedTag}
            onChange={handleTagChange}
          >
            <FormControlLabel value="key" control={<Radio />} label="Key" />
            <FormControlLabel value="distractor" control={<Radio />} label="Distractor" />
          </RadioGroup>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// Example usage of the TagAnswers component
const question = {
  appendix: 'This is an example appendix.',
  stem: 'What is the capital of France?',
  answer: 'Paris'
};


Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

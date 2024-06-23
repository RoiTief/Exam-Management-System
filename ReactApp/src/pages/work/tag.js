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
  Button,
} from '@mui/material';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import { TAG_ANSWERS } from '../../constants';
import { CheckExplanationPopup } from '../../sections/ask-work/checkExplanationPopup';
import { ProvideExplanationPopup } from '../../sections/ask-work/provideExplanationPopup';

const TagAnswers = ({ question }) => {
  const [selectedTag, setSelectedTag] = useState('');
  const [isCheckExplanationOpen, setIsCheckExplanationOpen] = useState(false);
  const [isProvideExplanationOpen, setIsProvideExplanationOpen] = useState(false);

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedTag === question.tag) {
      setIsCheckExplanationOpen(true);
    } else {
      setIsProvideExplanationOpen(true);
    }
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
            <FormControlLabel value="key" control={<Radio />} label={TAG_ANSWERS.KEY} />
            <FormControlLabel value="distractor" control={<Radio />} label={TAG_ANSWERS.DISTRACTOR} />
          </RadioGroup>
        </FormControl>
        {selectedTag && <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {TAG_ANSWERS.SUBMIT}
          </Button>
        </Box>}
      </Container>

      <CheckExplanationPopup isOpen={isCheckExplanationOpen} closePopup={() => setIsCheckExplanationOpen(false)}/>
      <ProvideExplanationPopup isOpen={isProvideExplanationOpen} closePopup={() => setIsProvideExplanationOpen(false)}/>

    </Box>
  );
};

// Example usage of the TagAnswers component
const exampleQuestion = {
  appendix: 'This is an example appendix.',
  stem: 'What is the capital of France?',
  answer: 'Paris',
  tag: 'key' // Assuming the correct tag is 'key'
};

const Page = () => {
  return (
    <TagAnswers question={exampleQuestion} />
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

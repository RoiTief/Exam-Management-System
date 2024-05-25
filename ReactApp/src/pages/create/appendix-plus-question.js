import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Divider
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import KeywordsSection from 'src/sections/Meta Question/keywords-edit';
import StemSection from 'src/sections/Meta Question/stem-edit';
import CorrectAnswersSection from 'src/sections/Meta Question/correct-answer-edit';
import DistractorsSection from 'src/sections/Meta Question/distractors-edit';
import AppendixSection from 'src/sections/Meta Question/apendix-edit';

const validationSchema = Yup.object().shape({
  keywords: Yup.array().of(Yup.string()),
  stem: Yup.string().required('Stem is required'),
  correctAnswers: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required('Correct answer text is required'),
      explanation: Yup.string().required('Explanation is required'),
    })
  ),
  distractors: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required('Distractor text is required'),
      explanation: Yup.string().required('Explanation is required'),
    })
  ),
  appendix: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    tag: Yup.string().required('Tag is required'),
    content: Yup.string().required('Content is required'),
  }),
});

const Page = () => {
  const router = useRouter();
  const initialValues = {
    keywords: [],
    stem: '',
    isStemRTL: true,
    correctAnswers: [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
    distractors: [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
    appendix: { title: '', tag: '', content: '', isTitleRTL: true, isTagRTL: true, isContentRTL: true },
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const metaQuestion = {
      keywords: values.keywords,
      stem: values.stem,
      correctAnswers: values.correctAnswers.map((item) => ({ answer: item.text, explanation: item.explanation })),
      distractors: values.distractors.map((item) => ({ distractor: item.text, explanation: item.explanation })),
      appendix: { title: values.appendix.title, tag: values.appendix.tag, content: values.appendix.content },
    };
    console.log(metaQuestion);
    router.push('/');
    setSubmitting(false);
    // Submit the metaQuestion object to your backend or API
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
        <Form>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              padding: 2,
            }}
          >
            <Container maxWidth="sm" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Create Simple Meta-Question
              </Typography>
              <AppendixSection
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
              />
              <Divider sx={{ borderColor: 'neutral.700' }} />
              <Box
                sx={{
                  flexGrow: 1,
                  px: 2,
                  py: 3
                }}
              >
                <KeywordsSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <StemSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
                <CorrectAnswersSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
                <DistractorsSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
              </Box>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Container>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
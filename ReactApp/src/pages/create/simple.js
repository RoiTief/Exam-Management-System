import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import KeywordsSection from 'src/sections/Meta Question/keywords-edit';
import StemSection from 'src/sections/Meta Question/stem-edit';
import KeysSection from 'src/sections/Meta Question/correct-answer-edit';
import DistractorsSection from 'src/sections/Meta Question/distractors-edit';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';

const validationSchema = Yup.object().shape({
  stem: Yup.string().required('Stem is required'),
  keys: Yup.array().of(
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
  keywords: Yup.array().of(Yup.string()),
});

const Page = () => {
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting }) => {
    const metaQuestion = {
      keywords: values.keywords,
      stem: values.stem,
      keys: values.keys.map((item) => ({
        answer: item.text,
        explanation: item.explanation
      })),
      distractors: values.distractors.map((item) => ({
        distractor: item.text,
        explanation: item.explanation
      })),
    };
    console.log(metaQuestion);
    await requestServer(serverPath.ADD_META_QUESTION, httpsMethod.POST, metaQuestion);
    await router.push('/');
  };

  return (
    <Formik
      initialValues={{
        keywords: [],
        stem: '',
        isStemRTL: true,
        keys: [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
        distractors: [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
      }}
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
                <KeysSection
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

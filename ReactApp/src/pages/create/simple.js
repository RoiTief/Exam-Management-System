import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import KeywordsSection from 'src/sections/Meta Question/keywords-edit';
import StemSection from 'src/sections/Meta Question/stem-edit';
import KeysSection from 'src/sections/Meta Question/correct-key-edit';
import DistractorsSection from 'src/sections/Meta Question/distractors-edit';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION, EDIT_QUESTION } from '../../constants';

const validationSchema = Yup.object().shape({
  stem: Yup.string().required(CREATE_QUESTION.STEM_REQUIRED),
  keys: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required(CREATE_QUESTION.CORRECT_ANSWER_REQUIRED),
      explanation: Yup.string().required(CREATE_QUESTION.EXPLANATION_REQUIRED),
    })
  ),
  distractors: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required(CREATE_QUESTION.DISTRACTOR_REQUIRED),
      explanation: Yup.string().required(CREATE_QUESTION.EXPLANATION_REQUIRED),
    })
  ),
  keywords: Yup.array().of(Yup.string()),
});

const Page = () => {
  const router = useRouter();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    if (router.query.question) {
      setQuestion(JSON.parse(router.query.question));
    }
  }, [router.query.question]);

  console.log(question)

  const initialValues = {
    keywords: question?.keywords || [],
    stem: question?.stem || '',
    isStemRTL: true,
    keys: question?.keys.map((item) => ({
      text: item.text,
      explanation: item.explanation,
      isTextRTL: true,
      isExplanationRTL: true,
    })) || [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
    distractors: question?.distractors.map((item) => ({
      text: item.text,
      explanation: item.explanation,
      isTextRTL: true,
      isExplanationRTL: true,
    })) || [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
  };

  const handleSubmit = async (values) => {
    const metaQuestion = {
      id: question?.id || null,
      keywords: values.keywords,
      stem: values.stem,
      keys: values.keys.map((item) => ({
        text: item.text,
        explanation: item.explanation
      })),
      distractors: values.distractors.map((item) => ({
        text: item.text,
        explanation: item.explanation
      })),
    };

    let request =  question? serverPath.EDIT_META_QUESTION : serverPath.ADD_META_QUESTION
    console.log(`${request} ${metaQuestion}`);
    await requestServer(request, httpsMethod.POST, metaQuestion);
    await router.push('/');
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
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
                {question? EDIT_QUESTION : CREATE_QUESTION.CREATE_SIMPLE_TITLE}
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
                {CREATE_QUESTION.SUBMIT_BUTTON}
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

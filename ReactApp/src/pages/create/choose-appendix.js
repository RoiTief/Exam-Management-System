import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import KeywordsSection from 'src/sections/Meta Question/keywords-edit';
import StemSection from 'src/sections/Meta Question/stem-edit';
import KeysSection from 'src/sections/Meta Question/correct-key-edit';
import DistractorsSection from 'src/sections/Meta Question/distractors-edit';
import AppendixList from 'src/sections/Meta Question/choose-appendix';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION } from '../../constants';

const validationSchema = Yup.object().shape({
  keywords: Yup.array().of(Yup.string()),
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
  appendix: Yup.object().shape({
    title: Yup.string().required(CREATE_QUESTION.APPENDIX_TITLE_REQUIRED),
    tag: Yup.string().required(CREATE_QUESTION.APPENDIX_TAG_REQUIRED),
    content: Yup.string().required(CREATE_QUESTION.APPENDIX_CONTENT_REQUIRED),
  }),
});

const Page = () => {
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting }) => {
    const metaQuestion = {
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
      appendix: values.appendix,
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
        appendix: { title: '', tag: '', content: '' },
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
        <Form>
          <Stack
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              padding: 2,
              flexDirection: "column",
              spacing: 4
            }}
          >
            <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, mb: 2, width: "100%" }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {CREATE_QUESTION.CREATE_APPENDIX_TITLE}
              </Typography>
            </Container>
            <Stack display='flex' spacing={4} direction="row" width="80%">
              <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, width: "50%" }}>
                <AppendixList onSelectAppendix={(appendix) => setFieldValue('appendix', appendix)} />
              </Container>
              <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, width: "50%" }}>
                <Box sx={{ flexGrow: 1, px: 2, py: 3 }}>
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
              </Container>
            </Stack>
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {CREATE_QUESTION.SUBMIT_BUTTON}
            </Button>
          </Stack>
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

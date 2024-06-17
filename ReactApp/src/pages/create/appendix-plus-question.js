import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Divider, Stack
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import KeywordsSection from 'src/sections/create-edit-meta-question/keywords-edit';
import StemSection from 'src/sections/create-edit-meta-question/stem-edit';
import KeysSection from 'src/sections/create-edit-meta-question/correct-key-edit';
import DistractorsSection from 'src/sections/create-edit-meta-question/distractors-edit';
import AppendixSection from 'src/sections/create-edit-meta-question/apendix-edit';
import { httpsMethod, latexServerPath, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION } from '../../constants';
import { PdfLatexPopup } from '../../sections/popUps/QuestionPdfView';

const validationSchema = Yup.object().shape({
  keywords: Yup.array().of(Yup.string()),
  stem: Yup.string().required(CREATE_QUESTION.STEM_REQUIRED),
  keys: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required(CREATE_QUESTION.CORRECT_ANSWER_REQUIRED),
      explanation: Yup.string(),
    })
  ),
  distractors: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required(CREATE_QUESTION.DISTRACTOR_REQUIRED),
      explanation: Yup.string(),
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
  const [showPdfView, setShowPdfView] = useState(false);
  const [showQuestionView, setShowQuestionView] = useState(false);

  const initialValues = {
    keywords: [],
    stem: '',
    isStemRTL: true,
    keys: [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
    distractors: [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
    appendix: { title: '', tag: '', content: '', isTitleRTL: true, isTagRTL: true, isContentRTL: true },
  };

  const closePopup = () => {
    setShowPdfView(false)
  };

  const createMetaQuestion = (values) => {
    return {
      id: null,
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
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const metaQuestion = createMetaQuestion(values)
    console.log(metaQuestion);
    await requestServer(serverPath.ADD_META_QUESTION, httpsMethod.POST, metaQuestion);
    await router.push('/');
  };

  const handlePdfButtonClick = (event, values) => {
    event.stopPropagation();
    const metaQuestion = createMetaQuestion(values)
    setShowQuestionView(metaQuestion)
    setShowPdfView(true); // Show PDF view when button is clicked
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
                {CREATE_QUESTION.CREATE_APPENDIX_PLUS_TITLE}
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
              <Stack direction="row" justifyContent="center" spacing={5}>
                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  {CREATE_QUESTION.SUBMIT_BUTTON}
                </Button>
                <Button variant="outlined" onClick={(event) => handlePdfButtonClick(event, values)}>
                  {CREATE_QUESTION.VIEW_PDF_BUTTON}
                </Button>
              </Stack>
            </Container>
          </Box>
          {showPdfView && (
            <PdfLatexPopup isOpen={showPdfView}
                           closePopup={closePopup}
                           content={showQuestionView}
                           type={latexServerPath.COMPILE_MQ}/>
          )}
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

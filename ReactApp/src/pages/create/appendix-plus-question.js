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
import ErrorMessage from '../../components/errorMessage';

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
  const [errorMessage, setErrorMessage] = useState('');

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
      appendix: {
        ...values.appendix,
        keywords: [],
      },
    };
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const metaQuestion = createMetaQuestion(values)
      console.log(metaQuestion);
      await requestServer(serverPath.ADD_META_QUESTION, httpsMethod.POST, metaQuestion);
      await router.push('/');
    } catch (err){
      setErrorMessage(err)
    }
  };

  const handlePdfButtonClick = (event, values) => {
    try {
      event.stopPropagation();
      const metaQuestion = createMetaQuestion(values)
      setShowQuestionView(metaQuestion)
      setShowPdfView(true); // Show PDF view when button is clicked
    } catch (err) {
      setErrorMessage(err)
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, isSubmitting, setFieldValue, touched, errors }) => (
        <Form onKeyDown={handleKeyDown}>
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
                touched = {touched.appendix}
                errors={errors.appendix}
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
                  error = {!!touched.keywords && errors.keywords}
                  helperText={touched.keywords && errors.keywords}
                />
                <StemSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  error = {!!touched.stem && errors.stem}
                  helperText={touched.stem && errors.stem}
                />
                <KeysSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  touched = {touched.keys}
                  error={errors.keys}
                />
                <DistractorsSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  touched = {touched.distractors}
                  error={errors.distractors}
                />
              </Box>
              <Stack direction="column" padding={1}>
                <Stack direction="row" justifyContent="center" spacing={5}>
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    {CREATE_QUESTION.SUBMIT_BUTTON}
                  </Button>
                  <Button variant="outlined"
                          sx={{
                            backgroundColor: 'rgba(255, 165, 0, 0.3)', // Tinted background
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 165, 0, 0.08)', // Darker tint on hover
                            },
                          }}
                          onClick={(event) => handlePdfButtonClick(event, values)}>
                    {CREATE_QUESTION.VIEW_PDF_BUTTON}
                  </Button>
                </Stack>
                <ErrorMessage message={errorMessage} />
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

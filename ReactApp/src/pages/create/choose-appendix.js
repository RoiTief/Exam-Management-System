import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import KeywordsSection from 'src/sections/create-edit-meta-question/keywords-edit';
import StemSection from 'src/sections/create-edit-meta-question/stem-edit';
import KeysSection from 'src/sections/create-edit-meta-question/correct-key-edit';
import DistractorsSection from 'src/sections/create-edit-meta-question/distractors-edit';
import AppendixList from 'src/sections/create-edit-meta-question/choose-appendix';
import { httpsMethod, latexServerPath, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION, EDIT_QUESTION } from '../../constants';
import { PdfLatexPopup } from '../../sections/popUps/QuestionPdfView';
import ErrorMessage from '../../components/errorMessage';
import useRouterOveride from '../../hooks/use-router';

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
    title: Yup.string(),
    tag: Yup.string(),
    content: Yup.string(),
  }),
});

const Page = () => {
  const router = useRouterOveride();
  const [question, setQuestion] = useState(null);
  const [showPdfView, setShowPdfView] = useState(false);
  const [showQuestionView, setShowQuestionView] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (router.query.question) {
      setQuestion(JSON.parse(router.query.question));
    }
    else{
      setQuestion(null)
    }
  }, [router.query.question]);

  const closePopup = () => {
    setShowPdfView(false)
  };

  const initialValues= {
    keywords: question?.keywords || [],
    stem: question?.stem || '',
    isStemRTL: question ? question.isStemRTL : true,
    keys: structuredClone(question?.keys || [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }]),
    distractors: structuredClone(question?.distractors || [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }]),
    appendix: question?.appendix || { title: '', tag: '', content: '' },
  }

  const createMetaQuestion = (values) => {
    return {
      id: question?.id || null,
      keywords: values.keywords,
      stem: values.stem,
      isStemRTL: values.isStemRTL,
      keys: structuredClone(values.keys),
      distractors: structuredClone(values.distractors),
      ...(values.appendix.tag !== '' && { appendixTag: values.appendix.tag })
    };
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const metaQuestion = createMetaQuestion(values)

      let request =  question? serverPath.EDIT_META_QUESTION : serverPath.ADD_META_QUESTION
      console.log(`${request} ${metaQuestion}`);
      await requestServer(request, httpsMethod.POST, metaQuestion);
      await router.back();
    } catch (err){
      setErrorMessage(err.message)
    }
  };

  const handlePdfButtonClick = (event, values) => {
    try {
      event.stopPropagation();
      const metaQuestion = createMetaQuestion(values)
      setShowQuestionView(metaQuestion)
      setShowPdfView(true); // Show PDF view when button is clicked
    } catch (err){
      setErrorMessage(err.message)
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
      enableReinitialize
    >
      {({ values, handleChange, handleBlur, isSubmitting, setFieldValue, touched, errors }) => (
        <Form onKeyDown={handleKeyDown}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, mb: 2, width: "100%" }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {question? EDIT_QUESTION : CREATE_QUESTION.CREATE_SIMPLE_TITLE}
              </Typography>
            </Container>
            </Box>
            <Stack display='flex' spacing={4} direction="row" width="80%">
              <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, width: "50%" }}>
                <AppendixList
                  values={values}
                  onSelectAppendix={(appendix) => setFieldValue('appendix', appendix)}
                />
              </Container>
              <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, width: "50%" }}>
                <Box sx={{ flexGrow: 1, px: 2, py: 3 }}>
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
              </Container>
            </Stack>
            <Stack direction="column" padding={1}>
              <Stack direction="row" justifyContent="center" spacing={5} padding={2}>
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
          </Stack>
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

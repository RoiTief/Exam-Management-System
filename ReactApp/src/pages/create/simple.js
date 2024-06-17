import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import KeywordsSection from 'src/sections/create-edit-meta-question/keywords-edit';
import StemSection from 'src/sections/create-edit-meta-question/stem-edit';
import KeysSection from 'src/sections/create-edit-meta-question/correct-key-edit';
import DistractorsSection from 'src/sections/create-edit-meta-question/distractors-edit';
import { httpsMethod, latexServerPath, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION, EDIT_QUESTION, QUESTIONS_CATALOG } from '../../constants';
import { PdfLatexPopup } from '../../sections/popUps/QuestionPdfView';

const validationSchema = Yup.object().shape({
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
  keywords: Yup.array().of(Yup.string()),
});

const Page = () => {
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [showPdfView, setShowPdfView] = useState(false);
  const [showQuestionView, setShowQuestionView] = useState(false);

  useEffect(() => {
    if (router.query.question) {
      setQuestion(JSON.parse(router.query.question));
    }
  }, [router.query.question]);

  const closePopup = () => {
    setShowPdfView(false)
  };

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

  const createMetaQuestion = (values) => {
    return {
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
  }

  const handleSubmit = async (values) => {
    const metaQuestion = createMetaQuestion(values)

    let request =  question? serverPath.EDIT_META_QUESTION : serverPath.ADD_META_QUESTION
    console.log(`${request} ${JSON.stringify(metaQuestion)}`);
    await requestServer(request, httpsMethod.POST, metaQuestion);
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
              <Stack direction="row" justifyContent="space-between" width="100%">
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

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { httpsMethod, latexServerPath, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION, EDIT_APPENDIX, EDIT_QUESTION } from '../../constants';
import { PdfLatexPopup } from '../../sections/popUps/QuestionPdfView';
import ErrorMessage from '../../components/errorMessage';
import AppendixSection from '../../sections/create-edit-meta-question/apendix-edit';

const validationSchema = Yup.object().shape({
  appendix: Yup.object().shape({
    title: Yup.string().required(CREATE_QUESTION.APPENDIX_TITLE_REQUIRED),
    tag: Yup.string().required(CREATE_QUESTION.APPENDIX_TAG_REQUIRED),
    content: Yup.string().required(CREATE_QUESTION.APPENDIX_CONTENT_REQUIRED),
  })
});

const Page = () => {
  const router = useRouter();
  const [appendix, setAppendix] = useState(null);
  const [showPdfView, setShowPdfView] = useState(false);
  const [showAppendixView, setShowAppendixView] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (router.query.question) {
      setAppendix(JSON.parse(router.query.appendix));
    }
  }, [router.query.appendix]);

  const closePopup = () => {
    setShowPdfView(false)
  };

  const initialValues = {
    appendix: {
      title: '',
      tag: '',
      content: '',
      isTitleRTL: true,
      isTagRTL: true,
      isContentRTL: true
    },
  };

  const createAppendix = (values) => {
    return {
      title: values.appendix.title,
      tag: values.appendix.tag,
      content: values.appendix.content
    }
  }

  const handleSubmit = async (values) => {
    try {
      const newAppendix = createAppendix(values)

      console.log(newAppendix)

      let request = appendix ? serverPath.EDIT_APPENDIX : serverPath.ADD_APPENDIX
      await requestServer(request, httpsMethod.POST, newAppendix);
      await router.push('/');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handlePdfButtonClick = (event, values) => {
    try {
      event.stopPropagation();
      const newAppendix = createAppendix(values)
      setShowAppendixView(newAppendix)
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
      enableReinitialize
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
                {appendix? EDIT_APPENDIX : CREATE_QUESTION.CREATE_APPENDIX_TITLE}
              </Typography>
              <AppendixSection
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                touched = {touched.appendix}
                errors={errors.appendix}
              />
              <Stack direction="column" padding={1}>
                <Stack direction="row" justifyContent="space-between" width="100%">
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
                    {CREATE_QUESTION.VIEW_APPENDIX_PDF_BUTTON}
                  </Button>
                </Stack>
                <ErrorMessage message={errorMessage} />
              </Stack>
            </Container>
          </Box>
          {showPdfView && (
            <PdfLatexPopup isOpen={showPdfView}
                           closePopup={closePopup}
                           content={showAppendixView}
                           type={latexServerPath.APPENDIX}/>
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

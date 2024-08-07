import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog, DialogActions,
  DialogContent, DialogContentText,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { httpsMethod, latexServerPath, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION, EDIT_APPENDIX, EDIT_QUESTION } from '../../constants';
import { PdfLatexPopup } from '../../sections/popUps/QuestionPdfView';
import ErrorMessage from '../../components/errorMessage';
import AppendixSection from '../../sections/create-edit-meta-question/apendix-edit';
import { MetaQuestionTable } from '../../sections/view-questions/question-table';
import useRouterOverride from '../../hooks/use-router';

const validationSchema = Yup.object().shape({
  appendix: Yup.object().shape({
    title: Yup.string().required(CREATE_QUESTION.APPENDIX_TITLE_REQUIRED),
    tag: Yup.string().required(CREATE_QUESTION.APPENDIX_TAG_REQUIRED),
    content: Yup.string().required(CREATE_QUESTION.APPENDIX_CONTENT_REQUIRED),
  })
});

const Page = () => {
  const router = useRouterOverride();
  const [appendix, setAppendix] = useState(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [showPdfView, setShowPdfView] = useState(false);
  const [showAppendixView, setShowAppendixView] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const fetchRelatedQuestions = async () => {
    try {
      const { metaQuestions } = await requestServer(serverPath.GET_META_QUESTIONS_FOR_APPENDIX, httpsMethod.POST, appendix);
      setRelatedQuestions(metaQuestions);
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(`Error fetching related questions: ${error.message}`);
    }
  }

  useEffect(() => {
    if (router.query.appendix) {
      let editAppendix = JSON.parse(router.query.appendix)
      setAppendix(editAppendix);
    }
    else{
      setAppendix(null)
      setRelatedQuestions([])
    }
  }, [router.query.appendix]);

  useEffect(() => {
    appendix &&
    fetchRelatedQuestions()
  }, [appendix]);

  const closePopup = () => {
    setShowPdfView(false)
  };

  const initialValues = {
    appendix: {
      title: appendix?.title || '',
      tag: appendix?.tag || '',
      content: appendix?.content || '',
      isTitleRTL: true,
      isTagRTL: true,
      isContentRTL: true
    },
  };

  const createAppendix = (values) => {
    return {
      title: values.appendix.title,
      tag: values.appendix.tag,
      content: values.appendix.content,
      keywords: []
    }
  }

  const handleSubmit = async (values) => {
    if (appendix) {
      setFormValues(values);
      setIsConfirmDialogOpen(true);
    } else {
      submitForm(values);
    }
  };

  const submitForm = async (values) => {
    try {
      const newAppendix = createAppendix(values);
      let request = appendix ? serverPath.EDIT_APPENDIX : serverPath.ADD_APPENDIX
      await requestServer(request, httpsMethod.POST, {appendix : newAppendix});
      await router.back();
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
      setErrorMessage(err.message)
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <>
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
            <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 2, mb: 2, width: "100%" }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {appendix? EDIT_APPENDIX.EDIT_APPENDIX_TITLE : CREATE_QUESTION.CREATE_APPENDIX_TITLE}
              </Typography>
            </Container>
            </Box>
            <Stack justifyContent="center" display='flex' spacing={4} direction="row" width="80%">
              {appendix && (
                <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, width: "50%" }}>
                  <MetaQuestionTable data={relatedQuestions}
                                     setErrorMessage={setErrorMessage}
                                     fetchMetaQuestions={fetchRelatedQuestions}/>
                </Container>
              )}
              <Container maxWidth="md" sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3, p: 4, width: "50%" }}>
                <Box sx={{ flexGrow: 1, px: 2, py: 3 }}>
                  <AppendixSection
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  touched = {touched.appendix}
                  errors={errors.appendix}
                  isEditMode={appendix!==null}
                  />
                </Box>
              </Container>
            </Stack>
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
                {CREATE_QUESTION.VIEW_APPENDIX_PDF_BUTTON}
              </Button>
            </Stack>
            <ErrorMessage message={errorMessage} />
          </Stack>
        {showPdfView && (
          <PdfLatexPopup isOpen={showPdfView}
                         closePopup={closePopup}
                         content={showAppendixView}
                         type={latexServerPath.APPENDIX}/>
        )}
      </Form>
      )}
    </Formik>
    <Dialog
      open={isConfirmDialogOpen}
      onClose={() => setIsConfirmDialogOpen(false)}
    >
      <DialogTitle>{EDIT_APPENDIX.CONFIRM_EDIT_TITLE}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {EDIT_APPENDIX.CONFIRM_EDIT_BODY}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsConfirmDialogOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setIsConfirmDialogOpen(false);
            submitForm(formValues);
          }}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

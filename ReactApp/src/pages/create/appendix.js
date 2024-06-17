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

import KeywordsSection from 'src/sections/create-edit-meta-question/keywords-edit';
import StemSection from 'src/sections/create-edit-meta-question/stem-edit';
import KeysSection from 'src/sections/create-edit-meta-question/correct-key-edit';
import DistractorsSection from 'src/sections/create-edit-meta-question/distractors-edit';
import AppendixSection from 'src/sections/create-edit-meta-question/apendix-edit';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION } from '../../constants';

const validationSchema = Yup.object().shape({
    title: Yup.string().required(CREATE_QUESTION.APPENDIX_TITLE_REQUIRED),
    tag: Yup.string().required(CREATE_QUESTION.APPENDIX_TAG_REQUIRED),
    content: Yup.string().required(CREATE_QUESTION.APPENDIX_CONTENT_REQUIRED),
});

const Page = () => {
  const router = useRouter();
  const initialValues = {
    title: '',
    tag: '',
    content: '',
    isTitleRTL: true,
    isTagRTL: true,
    isContentRTL: true
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const appendix = {
        title: values.appendix.title,
        tag: values.appendix.tag,
        content: values.appendix.content
    };
    console.log(appendix);
    // await requestServer(serverPath.ADD_APPENDIX, httpsMethod.POST, appendix);
    await router.push('/');
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
                {CREATE_QUESTION.CREATE_ONLY_APPENDIX_TITLE}
              </Typography>
              <AppendixSection
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
              />
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

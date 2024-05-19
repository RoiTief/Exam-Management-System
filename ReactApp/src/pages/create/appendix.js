import React from 'react';
import { Box, Button, Container, TextField, Typography, IconButton, Divider } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  stem: Yup.string().required('Stem is required'),
  correctAnswers: Yup.array().of(Yup.string().required('Correct answer is required')),
  distractors: Yup.array().of(Yup.string().required('Distractor is required')),
  appendix: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    tag: Yup.string().required('Tag is required'),
    content: Yup.string().required('Content is required'),
  }),
});

const Page = () => {
  const router = useRouter();
  const initialValues = {
    stem: '',
    isStemRTL: true,
    correctAnswers: [{ text: '', isRTL: true }],
    distractors: [{ text: '', isRTL: true }],
    appendix: { title: '', tag: '', content: '', isTitleRTL: true, isTagRTL: true, isContentRTL: true },
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const metaQuestion = {
      stem: values.stem,
      correctAnswers: values.correctAnswers.map((item) => item.text),
      distractors: values.distractors.map((item) => item.text),
      appendix: { title: values.appendix.title, tag: values.appendix.tag, content: values.appendix.content },
    };
    console.log(metaQuestion);
    router.push('/');
    setSubmitting(false);
    // Submit the metaQuestion object to your backend or API
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
                Create Simple Meta-Question
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h3">
                  Appendix:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Title"
                    name="appendix.title"
                    value={values.appendix.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    sx={{ direction: values.appendix.isTitleRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue('appendix.isTitleRTL', !values.appendix.isTitleRTL)}>
                    {values.appendix.isTitleRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Tag"
                    name="appendix.tag"
                    value={values.appendix.tag}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="outlined"
                    sx={{ direction: values.appendix.isTagRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue('appendix.isTagRTL', !values.appendix.isTagRTL)}>
                    {values.appendix.isTagRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Content"
                    name="appendix.content"
                    value={values.appendix.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    sx={{ direction: values.appendix.isContentRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue('appendix.isContentRTL', !values.appendix.isContentRTL)}>
                    {values.appendix.isContentRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ borderColor: 'neutral.700' }} />
              <Box
                sx={{
                  flexGrow: 1,
                  px: 2,
                  py: 3
                }}
              >
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Stem"
                    name="stem"
                    value={values.stem}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    sx={{ direction: values.isStemRTL ? 'rtl' : 'ltr', mr: 1 }}
                  />
                  <IconButton onClick={() => setFieldValue('isStemRTL', !values.isStemRTL)}>
                    {values.isStemRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                  </IconButton>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    Correct Answers:
                  </Typography>
                  <FieldArray name="correctAnswers">
                    {({ remove, push }) => (
                      <>
                        {values.correctAnswers.map((answer, index) => (
                          <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <TextField
                              name={`correctAnswers[${index}].text`}
                              value={values.correctAnswers[index].text}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              multiline
                              rows={2}
                              fullWidth
                              variant="outlined"
                              sx={{ direction: answer.isRTL ? 'rtl' : 'ltr', mr: 1 }}
                            />
                            <IconButton onClick={() => setFieldValue(`correctAnswers[${index}].isRTL`, !values.correctAnswers[index].isRTL)}>
                              {answer.isRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                            </IconButton>
                            <IconButton onClick={() => remove(index)}>
                              <RemoveCircleOutline />
                            </IconButton>
                          </Box>
                        ))}
                        <IconButton onClick={() => push({ text: '', isRTL: true })}>
                          <AddCircleOutline />
                        </IconButton>
                      </>
                    )}
                  </FieldArray>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    Distractors:
                  </Typography>
                  <FieldArray name="distractors">
                    {({ remove, push }) => (
                      <>
                        {values.distractors.map((distractor, index) => (
                          <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                            <TextField
                              name={`distractors[${index}].text`}
                              value={values.distractors[index].text}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              multiline
                              rows={2}
                              fullWidth
                              variant="outlined"
                              sx={{ direction: distractor.isRTL ? 'rtl' : 'ltr', mr: 1 }}
                            />
                            <IconButton onClick={() => setFieldValue(`distractors[${index}].isRTL`, !values.distractors[index].isRTL)}>
                              {distractor.isRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                            </IconButton>
                            <IconButton onClick={() => remove(index)}>
                              <RemoveCircleOutline />
                            </IconButton>
                          </Box>
                        ))}
                        <IconButton onClick={() => push({ text: '', isRTL: true })}>
                          <AddCircleOutline />
                        </IconButton>
                      </>
                    )}
                  </FieldArray>
                </Box>
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

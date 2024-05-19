import React from 'react';
import { Box, Button, Container, TextField, Typography, IconButton, Chip } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, FormatTextdirectionLToR, FormatTextdirectionRToL } from '@mui/icons-material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  stem: Yup.string().required('Stem is required'),
  correctAnswers: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required('Correct answer text is required'),
      explanation: Yup.string().required('Explanation is required'),
    })
  ),
  distractors: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required('Distractor text is required'),
      explanation: Yup.string().required('Explanation is required'),
    })
  ),
  keywords: Yup.array().of(Yup.string()),
});

const Page = () => {
  const router = useRouter();

  const handleSubmit = (values, { setSubmitting }) => {
    const metaQuestion = {
      keywords: values.keywords,
      stem: values.stem,
      correctAnswers: values.correctAnswers.map((item) => ({ answer: item.text, explanation: item.explanation })),
      distractors: values.distractors.map((item) => ({ distractor: item.text, explanation: item.explanation })),
    };
    console.log(metaQuestion);
    router.push('/');
    setSubmitting(false);
    // Submit the metaQuestion object to your backend or API
  };

  return (
    <Formik
      initialValues={{
        keywords: [],
        stem: '',
        isStemRTL: true,
        correctAnswers: [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
        distractors: [{ text: '', explanation: '', isTextRTL: true, isExplanationRTL: true }],
      }}
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
                  Keywords:
                </Typography>
                <FieldArray name="keywords">
                  {({ push, remove }) => (
                    <Box sx={{ mb: 1 }}>
                      {values.keywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          onDelete={() => remove(index)}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                      <TextField
                        placeholder="Add Keyword"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim() !== '') {
                            push(e.target.value.trim());
                            e.target.value = '';
                          }
                        }}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}
                </FieldArray>
              </Box>
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
                          <Box key={index} sx={{ mb: 1, flex: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <TextField
                                name={`correctAnswers[${index}].text`}
                                value={values.correctAnswers[index].text}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                variant="outlined"
                                placeholder="Answer"
                                sx={{ direction: values.correctAnswers[index].isTextRTL ? 'rtl' : 'ltr', mr: 1 }}
                              />
                              <IconButton onClick={() => setFieldValue(`correctAnswers[${index}].isTextRTL`, !values.correctAnswers[index].isTextRTL)}>
                                {values.correctAnswers[index].isTextRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <TextField
                                name={`correctAnswers[${index}].explanation`}
                                value={values.correctAnswers[index].explanation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                variant="outlined"
                                placeholder="Explanation"
                                sx={{ direction: values.correctAnswers[index].isExplanationRTL ? 'rtl' : 'ltr', mr: 1 }}
                              />
                              <IconButton onClick={() => setFieldValue(`correctAnswers[${index}].isExplanationRTL`, !values.correctAnswers[index].isExplanationRTL)}>
                                {values.correctAnswers[index].isExplanationRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                              </IconButton>
                            </Box>
                          </Box>
                          <IconButton onClick={() => remove(index)}>
                            <RemoveCircleOutline />
                          </IconButton>
                        </Box>
                      ))}
                      <IconButton onClick={() => push({ text: '', explanation: '' })}>
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
                          <Box key={index} sx={{ mb: 1, flex: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                              name={`distractors[${index}].text`}
                              value={values.distractors[index].text}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              fullWidth
                              variant="outlined"
                              placeholder="Distractor"
                              sx={{ direction: values.distractors[index].isTextRTL ? 'rtl' : 'ltr', mr: 1 }}
                            />
                              <IconButton onClick={() => setFieldValue(`distractors[${index}].isTextRTL`, !values.distractors[index].isTextRTL)}>
                                {values.distractors[index].isTextRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                              name={`distractors[${index}].explanation`}
                              value={values.distractors[index].explanation}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              fullWidth
                              variant="outlined"
                              placeholder="Explanation"
                              sx={{ direction: values.distractors[index].isExplanationRTL ? 'rtl' : 'ltr', mr: 1 }}
                            />
                              <IconButton onClick={() => setFieldValue(`distractors[${index}].isExplanationRTL`, !values.distractors[index].isExplanationRTL)}>
                                {values.distractors[index].isExplanationRTL ? <FormatTextdirectionRToL /> : <FormatTextdirectionLToR />}
                              </IconButton>
                            </Box>
                          </Box>
                          <IconButton onClick={() => remove(index)}>
                            <RemoveCircleOutline />
                          </IconButton>
                        </Box>
                      ))}
                      <IconButton onClick={() => push({ text: '', explanation: '' })}>
                        <AddCircleOutline />
                      </IconButton>
                    </>
                  )}
                </FieldArray>
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

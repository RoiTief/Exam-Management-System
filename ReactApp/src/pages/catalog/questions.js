import { Box, Button, Stack, SvgIcon, Typography, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { MetaQuestionTable } from '../../sections/view-questions/question-table';
import { QuestionsSearch } from '../../sections/view-questions/question-search';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { QUESTIONS_CATALOG } from '../../constants';
import ErrorMessage from '../../components/errorMessage';
import useRouterOverride from '../../hooks/use-router';

const Page = () => {
  const router = useRouterOverride();
  const [metaQuestions, setMetaQuestions] = useState([]);
  const [filteredData, setFilteredData] = useState(metaQuestions);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMetaQuestions = async () => {
    try {
      const { metaQuestions } = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
      setMetaQuestions(metaQuestions);
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      console.error('Error fetching meta questions:', error);
      setErrorMessage(`Error fetching meta-questions: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchMetaQuestions();
  }, []);

  useEffect(() => {
    try {
      handleSearch("");
    } catch (err) {
      setErrorMessage( `An error occurred during search: ${err.message}`);
    }
  }, [metaQuestions]);

  const handleSearch = (text) => {
    const filteredQuestions = metaQuestions.filter(question =>
      question.stem.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredQuestions);
  };

  const handleKeySearch = (keys) => {
    const filteredQuestions = metaQuestions.filter(question =>
      keys.every(key =>
        question.keywords.some(keyword =>
          keyword.toLowerCase().includes(key.toString().toLowerCase())
        )
      )
    );
    setFilteredData(filteredQuestions);
  };

  return (
    <>
      <Head>
        <title>{QUESTIONS_CATALOG.PAGE_TITLE}</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">{QUESTIONS_CATALOG.HEADING}</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <Stack alignItems="center" direction="column" spacing={1}>
                <Button
                  color="inherit"
                  startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>}
                  variant="contained"
                  onClick={() => router.push('/create/choose-appendix')}
                >
                  {QUESTIONS_CATALOG.CREATE_SIMPLE_BUTTON}
                </Button>
                <Button
                  color="inherit"
                  startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>}
                  variant="contained"
                  onClick={() => router.push('/create/appendix-plus-question')}
                >
                  {QUESTIONS_CATALOG.CREATE_APPENDIX_BUTTON}
                </Button>
              </Stack>
            </Stack>
            <QuestionsSearch onSearch={handleKeySearch}
                             onTextSearch={handleSearch} />
            <MetaQuestionTable data={filteredData}
                               setErrorMessage={setErrorMessage}
                               fetchMetaQuestions={fetchMetaQuestions} />
            <ErrorMessage message={errorMessage} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

import { Box, Button, Stack, SvgIcon, Typography, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useRouter } from 'next/navigation';
import { MetaQuestionTable } from '../../sections/view questions/question-table';
import { QuestionsSearch } from '../../sections/view questions/question-search';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { QUESTIONS_CATALOG } from '../../constants';

const Page = () => {
  const router = useRouter();
  const [metaQuestions, setMetaQuestions] = useState([]);
  const [filteredData, setFilteredData] = useState(metaQuestions);

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        const { metaQuestions } = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
        setMetaQuestions(metaQuestions);
      } catch (error) {
        console.error('Error fetching meta questions:', error);
      }
    }

    fetchMetaQuestions();
  }, []);

  useEffect(() => {
    // Call handleSearch with an empty array once metaQuestions has been updated
    handleSearch([]);
  }, [metaQuestions]);

  const handleSearch = (keys) => {
    const filteredQuestions = metaQuestions.filter(question =>
      keys.every(key => question.keywords.includes(key))
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
                  onClick={() => router.push('/create/simple')}
                >
                  {QUESTIONS_CATALOG.CREATE_SIMPLE_BUTTON}
                </Button>
                <Button
                  color="inherit"
                  startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>}
                  variant="contained"
                  onClick={() => router.push('/create/choose-appendix')}
                >
                  {QUESTIONS_CATALOG.CREATE_APPENDIX_BUTTON}
                </Button>
              </Stack>
            </Stack>
            <QuestionsSearch onSearch={handleSearch} /> {/* Render QuestionsSearch */}
            <MetaQuestionTable data={filteredData} />
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

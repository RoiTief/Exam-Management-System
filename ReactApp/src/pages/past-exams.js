import { Box, Button, Stack, SvgIcon, Typography, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useRouter } from 'next/navigation';
import { ExamsTable } from '../sections/view-exams/exams-table';
import { ExamsSearch } from '../sections/view-exams/exams-search';
import { httpsMethod, requestServer, serverPath } from '../utils/rest-api-call';
import { EXAMS_CATALOG } from '../constants';
import ErrorMessage from '../components/errorMessage';


const ExamsPage = () => {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [filteredData, setFilteredData] = useState(exams);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchExams() {
      try {
        const { exams } = await requestServer(serverPath.GET_ALL_EXAMS, httpsMethod.GET);
        setExams(exams);
        setErrorMessage(''); // Clear any previous error message
      } catch (error) {
        console.error('Error fetching exams:', error);
        setErrorMessage(`Error fetching exams: ${error.message}`)
      }
    }

    fetchExams();
  }, []);

  useEffect(() => {
    try {
      handleSearch("");
    } catch (err) {
      setErrorMessage(`An error occurred during search: ${err.message}`);
    }
  }, [exams]);

  const handleSearch = (text) => {
    const filteredExams = exams.filter(exam =>
      exam.examReason.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredExams);
  };

  return (
    <>
      <Head>
        <title>{EXAMS_CATALOG.PAGE_TITLE}</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">{EXAMS_CATALOG.HEADING}</Typography>
              </Stack>
            </Stack>
            <ExamsSearch onSearch={handleSearch} /> {/* Render ExamsSearch */}
            <ExamsTable data={filteredData} setErrorMessage={setErrorMessage} />
            <ErrorMessage message={errorMessage} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ExamsPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ExamsPage;

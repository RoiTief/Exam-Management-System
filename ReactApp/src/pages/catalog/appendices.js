import { Box, Button, Stack, SvgIcon, Typography, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useRouter } from 'next/navigation';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { APPENDICES_CATALOG } from '../../constants';
import { AppendicesTable } from '../../sections/view-appendices/appendices-table';
import { AppendicesSearch } from '../../sections/view-appendices/appendices-search';
import ErrorMessage from '../../components/errorMessage';

const AppendicesPage = () => {
  const router = useRouter();
  const [appendices, setAppendices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchAppendices() {
      try {
        const { appendices } = await requestServer(serverPath.GET_ALL_APPENDICES, httpsMethod.GET);
        setAppendices(appendices);
        setFilteredData(appendices);
        setErrorMessage(''); // Clear any previous error message
      } catch (error) {
        console.error('Error fetching appendices:', error);
        setErrorMessage(`Error fetching appendices: ${error.message}`)
      }
    }

    fetchAppendices();
  }, []);

  useEffect(() => {
    try {
      handleSearch([], 'opentext');
    } catch (err) {
      setErrorMessage( `An error occurred during search: ${err.message}`);
    }
  }, [appendices]);

  const handleSearch = (keys, searchType) => {
    const filteredAppendices = appendices.filter((appendix) => {
      if (searchType === 'tag') {
        return keys.every((key) => appendix.tag.includes(key));
      } else {
        return keys.every((key) =>
          appendix.title.includes(key) || appendix.tag.includes(key) || appendix.content.includes(key)
        );
      }
    });
    setFilteredData(filteredAppendices);
  };

  return (
    <>
      <Head>
        <title>{APPENDICES_CATALOG.PAGE_TITLE}</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">{APPENDICES_CATALOG.HEADING}</Typography>
              </Stack>
              <Stack alignItems="center" direction="column" spacing={1}>
                <Button
                  color="inherit"
                  startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>}
                  variant="contained"
                  onClick={() => router.push('/create/appendix')}
                >
                  {APPENDICES_CATALOG.CREATE_APPENDIX_BUTTON}
                </Button>
              </Stack>
            </Stack>
            <AppendicesSearch onSearch={handleSearch} />
            <AppendicesTable appendices={filteredData} />
            <ErrorMessage message={errorMessage} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

AppendicesPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AppendicesPage;

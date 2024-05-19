import { formatDistanceToNow, subDays, subHours } from 'date-fns';
import PropTypes from 'prop-types';
import {httpsMethod, serverPath, requestServer,TOKEN_FIELD_NAME} from 'src/utils/rest-api-call';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import { Box, Button, Card, CardActions, Stack, IconButton, List, ListItem, ListItemText,
  SvgIcon, Typography, Container } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Question } from '../../sections/popUps/QuestionPopup';
import { Layout as DashboardLayout } from '../../layouts/dashboard/layout';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { CustomersSearch } from '../../sections/customer/customers-search';
import { useRouter } from 'next/navigation';
import { CustomersTable } from '../../sections/customer/customers-table';
import { applyPagination } from '../../utils/apply-pagination';
import { MetaQuestionTable } from '../../sections/Questions/question-catalog-by-stem';
import { QuestionsSearch } from '../../sections/Questions/question-search';

const data = [
  {
    stem: 'test stem',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
        {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key3']
  },
  {
    stem: 'long stem fdnsgifbsdfpgsnffgdvbpienefvuxcvipubguiehsfvidznvbiugunhdfvx uijggggndfxviujncvbszfxghsfghdfhnhjghdnmjhgdjhjmfhtjnmjfgvjhmnmjfghm,kfmjkfcykudyghdjfhfjbhfsyhsjtbhfxsbgifdsdfvbnfv',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key3', 'key1', 'key2', 'key3', 'key1', 'key2', 'key3', 'key1', 'key2', 'key3']
  }
]

const useMetaQuestions = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const metaquestions = useMetaQuestions(page, rowsPerPage);




  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>
          Meta-Questions Catalog
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Meta-Questions Catalog
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                </Stack>
              </Stack>
              <Stack
                alignItems="center"
                direction="column"
                spacing={1}
              >
                <Button
                  color="inherit"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={() => router.push('/create/simple')}
                >
                  Create Simple MetaQuestion
                </Button>
                <Button
                  color="inherit"
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={() => router.push('/create/appendix')}
                >
                  Create Appendix+MetaQuestion
                </Button>
              </Stack>
            </Stack>
            <QuestionsSearch />
            <MetaQuestionTable
              count={data.length}
              items={metaquestions}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
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

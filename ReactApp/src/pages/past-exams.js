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

const pastExams = {
  questions:
  [
    {
      "id": 1,
      "stem": "what did Idan listen to when he was a kid",
      "key": {
        "id": 1,
        "tag": "key",
        "text": "baby motzart",
        "explanation": "explanation1"
      },
      "distractors": [
        {
          "id": 5,
          "tag": "distractor",
          "text": "Begins \"tzachtzachim\" speach",
          "explanation": "explanation3"
        },
        {
          "id": 4,
          "tag": "distractor",
          "text": "zohar Argov",
          "explanation": "explanation2"
        }
      ]
    },
    {
      "id": 6,
      "stem": "What is Roi's nickname",
      "key": {
      "id": 32,
        "tag": "key",
        "text": "The Tief",
        "explanation": "explanation1"
    },
      "distractors": [
      {
        "id": 33,
        "tag": "distractor",
        "text": "Gali's soon to be husband",
        "explanation": "explanation2"
      },
      {
        "id": 34,
        "tag": "distractor",
        "text": "The Tief",
        "explanation": "explanation1"
      }
    ],
      "appendix": {
      "tag": "new tag ",
        "title": "just appendix",
        "content": "content",
        "keywords": []
    }
    },
    {
      "id": 16,
      "stem": "with a lot of key and distractors",
      "key": {
      "id": 46,
        "tag": "key",
        "text": "k2",
        "explanation": ""
    },
      "distractors": [
      {
        "id": 49,
        "tag": "distractor",
        "text": "d1",
        "explanation": ""
      },
      {
        "id": 52,
        "tag": "distractor",
        "text": "d4",
        "explanation": ""
      }
    ]
    },
    {
      "id": 16,
      "stem": "with a lot of key and distractors",
      "key": {
      "id": 48,
        "tag": "key",
        "text": "k4",
        "explanation": ""
    },
      "distractors": [
      {
        "id": 50,
        "tag": "distractor",
        "text": "d2",
        "explanation": ""
      },
      {
        "id": 51,
        "tag": "distractor",
        "text": "d3",
        "explanation": ""
      }
    ]
    },
    {
      "id": 16,
      "stem": "with a lot of key and distractors",
      "key": {
      "id": 45,
        "tag": "key",
        "text": "k1",
        "explanation": ""
    },
      "distractors": [
      {
        "id": 56,
        "tag": "distractor",
        "text": "d8",
        "explanation": ""
      },
      {
        "id": 55,
        "tag": "distractor",
        "text": "d7",
        "explanation": ""
      }
      ]
    }
  ],
  numVersions: "2",
  examReason: "2022 moed A"
}

const ExamsPage = () => {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [filteredData, setFilteredData] = useState(exams);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchExams() {
      try {
        const { exams } = await requestServer(serverPath.GET_ALL_EXAMS, httpsMethod.GET);
        setExams([pastExams]);
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
            <ExamsTable data={filteredData} />
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

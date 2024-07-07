import PropTypes from 'prop-types';
import { Box, Button, Card, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import React, { useState } from 'react';
import { ExamPopup } from '../popUps/ExamPopup';
import { EXAMS_CATALOG } from '../../constants';
import { PdfLatexPopup } from '../popUps/QuestionPdfView';
import { httpsMethod, latexServerPath, requestServer, serverPath } from '../../utils/rest-api-call';

export const ExamsTable = ({ data, setErrorMessage }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showExamView, setShowExamView] = useState(false);
  const [versionedExam, setVersionedExam] = useState(null);
  const [showPdfView, setShowPdfView] = useState(false);

  const showExamInPdf = async (version) => {
    try {
      const { versionExam } = await requestServer(serverPath.GET_VERSIONED_EXAM, httpsMethod.POST, { examId: selectedExam.examId, version });
      setVersionedExam(versionExam)
      setShowPdfView(true); // Show Exam view when row is clicked
    } catch (err) {
      setErrorMessage(err.message)
    }
  };

  const handleRowClick = (exam) => {
    setSelectedExam(exam);
    setShowExamView(true); // Show Exam view when row is clicked
  };

  const closePopup = () => {
    setSelectedExam(null);
    setShowExamView(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack>
      <Card>
        <Scrollbar>
          <Box sx={{ width: '100%' }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{EXAMS_CATALOG.REASON_HEADING}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((exam) => (
                  <TableRow
                    key={exam.examReason}
                    onClick={() => handleRowClick(exam)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{exam.examReason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={data.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      {showExamView && (
        <ExamPopup isOpen={showExamView} closePopup={closePopup} exam={selectedExam} setShowPdfView={showExamInPdf} />
      )}
      {showPdfView && (
        <PdfLatexPopup
          isOpen={showPdfView}
          closePopup={() => setShowPdfView(false)}
          content={versionedExam.questions}
          type={latexServerPath.COMPILE_EXAM_VERSION}
        />
      )}
    </Stack>
  );
};

ExamsTable.propTypes = {
  data: PropTypes.array.isRequired,
};

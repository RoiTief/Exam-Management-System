import PropTypes from 'prop-types';
import { Box, Button, Card, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import React, { useState } from 'react';
import { Question } from '../popUps/QuestionPopup';
import { PdfLatexPopup, QuestionPdfView } from '../popUps/QuestionPdfView';
import { latexServerPath } from '../../utils/rest-api-call';

export const MetaQuestionTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionView, setShowQuestionView] = useState(false);
  const [showPdfView, setShowPdfView] = useState(false);

  const handleRowClick = (question) => {
    setSelectedQuestion(question);
    setShowQuestionView(true); // Show Question view when row is clicked
  };

  const closePopup = () => {
    setSelectedQuestion(null);
    setShowQuestionView(false);
    setShowPdfView(false)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePdfButtonClick = (event, metaquestion) => {
    event.stopPropagation();
    setSelectedQuestion(metaquestion);
    setShowPdfView(true); // Show PDF view when button is clicked
  };

  return (
    <Stack>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Stem</TableCell>
                  <TableCell>Keywords</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((metaquestion) => (
                  <TableRow
                    key={metaquestion.stem}
                    onClick={() => handleRowClick(metaquestion)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell style={{ overflowWrap: 'break-word' }}>{metaquestion.stem}</TableCell>
                    <TableCell>{metaquestion.keywords.join(', ')}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={(event) => handlePdfButtonClick(event, metaquestion)}>View PDF</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={3} />
                  </TableRow>
                )}
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
      {showQuestionView && (
      <Question isOpen={showQuestionView}
                closePopup={closePopup}
                question={selectedQuestion}/>
      )}
      {showPdfView && (
        <PdfLatexPopup isOpen={showPdfView}
                     closePopup={closePopup}
                     content={selectedQuestion}
                     type={latexServerPath.COMPILE_MQ}/>
        )}
    </Stack>
  );
};

MetaQuestionTable.propTypes = {
  data: PropTypes.array.isRequired,
};

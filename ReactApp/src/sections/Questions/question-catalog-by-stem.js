import PropTypes from 'prop-types';
import { Box, Card, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import React, { useState } from 'react';
import { Question } from '../popUps/QuestionPopup';

export const MetaQuestionTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleRowClick = (question) => {
    setSelectedQuestion(question);
  };

  const closePopup = () => {
    setSelectedQuestion(null);
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
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={2} />
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
      <Question isOpen={selectedQuestion !== null} closePopup={closePopup} question={selectedQuestion} />
    </Stack>
  );
};

MetaQuestionTable.propTypes = {
  data: PropTypes.array.isRequired,
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Collapse,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { PdfLatexPopup } from '../popUps/QuestionPdfView';
import { httpsMethod, latexServerPath, requestServer, serverPath } from '../../utils/rest-api-call';
import { APPENDICES_CATALOG } from '../../constants';
import { MetaQuestionTable } from '../view-questions/question-table';
import ErrorMessage from '../../components/errorMessage';

export const AppendicesTable = ({ appendices }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedAppendix, setExpandedAppendix] = useState(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showPdfView, setShowPdfView] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleExpandAppendix = async (appendix) => {
    if (expandedAppendix === appendix) {
      setExpandedAppendix(null);
      return;
    }
    try {
      const { metaQuestions } = await requestServer(serverPath.GET_META_QUESTIONS_FOR_APPENDIX, httpsMethod.POST, appendix);
      setRelatedQuestions(metaQuestions);
      setErrorMessage(metaQuestions.length === 0 ? 'No related questions found.' : '');
      setExpandedAppendix(appendix);
    } catch (error) {
      console.error('Error fetching related questions:', error);
      setErrorMessage(`Error fetching related questions: ${error.message}`);
      setExpandedAppendix(appendix);
    }
  };

  const handlePdfButtonClick = (event, question) => {
    event.stopPropagation();
    setSelectedQuestion(question);
    setShowPdfView(true);
  };

  const closePdfView = () => {
    setSelectedQuestion(null);
    setShowPdfView(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAppendices = appendices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{APPENDICES_CATALOG.TITLE_HEADING}</TableCell>
                <TableCell>{APPENDICES_CATALOG.TAG_HEADING}</TableCell>
                <TableCell>{APPENDICES_CATALOG.CONTENT_HEADING}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAppendices.map((appendix) => (
                <React.Fragment key={appendix.tag}>
                  <TableRow onClick={() => handleExpandAppendix(appendix)} style={{ cursor: 'pointer' }}>
                    <TableCell>{appendix.title}</TableCell>
                    <TableCell>{appendix.tag}</TableCell>
                    <TableCell>{appendix.content}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedAppendix === appendix}>
                        <Box margin={1} bgcolor="rgba(255, 165, 0, 0.5)" borderRadius={4} p={2}>
                          {errorMessage==='' && relatedQuestions.length>0 && (
                            <Stack>
                              <Typography variant="h6" padding={2}>{APPENDICES_CATALOG.RELATED_QUESION}</Typography>
                              <MetaQuestionTable data={relatedQuestions} />
                            </Stack>
                          )}
                          {errorMessage==='' && relatedQuestions.length===0 &&(
                            <Typography variant="b2" padding={2}>{APPENDICES_CATALOG.NO_RELATED_QUESTIONS}</Typography>
                          )}
                          {errorMessage!=='' && (
                            <ErrorMessage message={errorMessage} />
                            )}

                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={appendices.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {showPdfView && (
        <PdfLatexPopup isOpen={showPdfView}
                       closePopup={closePdfView}
                       content={selectedQuestion}
                       type={latexServerPath.COMPILE_MQ}/>
      )}
    </Card>
  );
};

AppendicesTable.propTypes = {
  appendices: PropTypes.array.isRequired,
};

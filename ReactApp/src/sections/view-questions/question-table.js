import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import React, { useState } from 'react';
import { Question } from '../popUps/QuestionPopup';
import { PdfLatexPopup } from '../popUps/QuestionPdfView';
import { httpsMethod, latexServerPath, requestServer, serverPath } from '../../utils/rest-api-call';
import { QUESTIONS_CATALOG } from '../../constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useRouter } from 'next/router';

export const MetaQuestionTable = ({ data, setErrorMessage, fetchMetaQuestions }) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionView, setShowQuestionView] = useState(false);
  const [showPdfView, setShowPdfView] = useState(false);
  const [deleteAppendixDialog, setDeleteAppendixDialog] = useState(false)

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

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePdfButtonClick = (event, metaquestion) => {
    event.stopPropagation();
    setSelectedQuestion(metaquestion);
    setShowPdfView(true); // Show PDF view when button is clicked
  };

  const handleEdit = (event, metaquestion) => {
    event.stopPropagation();
    const pathname = '/create/choose-appendix';
    const query = {
      question: JSON.stringify(metaquestion)
    };
    router.push({ pathname, query });
  }

  const handleDelete = async (event, metaquestion) => {
    event.stopPropagation();
    setSelectedQuestion(metaquestion)
    try {
      await requestServer(serverPath.DELETE_QUESTION, httpsMethod.POST, { id: metaquestion.id });
      if (metaquestion.appendix && metaquestion.appendix.tag !== '') {
        const { metaQuestions } = await requestServer(serverPath.GET_META_QUESTIONS_FOR_APPENDIX, httpsMethod.POST, metaquestion.appendix);
        console.log(metaQuestions)
        if (metaQuestions.length===0 || (metaQuestions.length===1 && metaQuestions[0].id===metaquestion.id)){
          setDeleteAppendixDialog(true)
        }
      }
      fetchMetaQuestions()
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  const handleDeleteAppendix = () => {
    try{
      requestServer(serverPath.DELETE_APPENDIX, httpsMethod.POST, { tag: selectedQuestion.appendix.tag } );
      setDeleteAppendixDialog(false);
    } catch (err){
      setErrorMessage(err.message)
    }
  }

  return (
    <Stack>
      <Card>
        <Scrollbar>
          <Box sx={{ width: '100%' }}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{QUESTIONS_CATALOG.STEM_HEADING}</TableCell>
                  <TableCell>{QUESTIONS_CATALOG.KEYWORDS_HEADING}</TableCell>
                  <TableCell/>
                  <TableCell/>
                  <TableCell/>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((metaquestion) => (
                  <TableRow
                    key={metaquestion.stem}
                    onClick={() => handleRowClick(metaquestion)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell style={{ overflowWrap: 'break-word', maxWidth: '300px' }}>{metaquestion.stem}</TableCell>
                    <TableCell>{metaquestion.keywords.join(', ')}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={(event) => handlePdfButtonClick(event, metaquestion)}
                        sx={{ textTransform: 'none', whiteSpace: 'nowrap' }} // Ensures text stays on one line
                      >
                        {QUESTIONS_CATALOG.VIEW_PDF_BUTTON}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleEdit(event, metaquestion)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleDelete(event, metaquestion)}>
                        <DeleteOutlineIcon/>
                      </IconButton>
                    </TableCell>
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
      <Dialog
        open={deleteAppendixDialog}
        onClose={() => setDeleteAppendixDialog(false)}
      >
        <DialogTitle>{QUESTIONS_CATALOG.DELETE_APPENDIX_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {QUESTIONS_CATALOG.DELETE_APPENDIX_BODY}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAppendixDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteAppendix();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

MetaQuestionTable.propTypes = {
  data: PropTypes.array.isRequired,
};

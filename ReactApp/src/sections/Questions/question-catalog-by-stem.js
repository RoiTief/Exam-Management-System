import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import React, { useEffect, useState } from 'react';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { Question } from '../popUps/QuestionPopup';

export const MetaQuestionTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 5,
  } = props;

  const [questions, setList] = useState([])
  const [questionToView, setQuestion] = useState(null);

  const handleRowClick = (question) => {
    setQuestion(question)
  };

  const closePopup = () => {
    setQuestion(null)
  };

  useEffect( (question) => {handleRowClick(question)}, [])
  useEffect( () => {closePopup()}, [])

  useEffect(() => {
    const fetchList = async () => {
      try {
        const {questions} = await requestServer(serverPath.VIEW_QUESTIONS, httpsMethod.GET);
        setList(questions);
      }
      catch(err){
        console.error('Error fetching question list:', err)
      }
    }

    fetchList();
  }, [])

  const handleClick = () => {}

  return (
    <Stack>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Stem
                  </TableCell>
                  <TableCell>
                    Keywords
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((metaquestion) => (
                  <TableRow
                    key={metaquestion.stem}
                    onClick={() => handleRowClick(metaquestion)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell style={{ overflowWrap: 'break-word' }}>
                      {metaquestion.stem}
                    </TableCell>
                    <TableCell>
                      {metaquestion.keywords.join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <div>
        <Question
          isOpen={questionToView != null}
          closePopup={() => closePopup()}
          question={questionToView}/>
      </div>
    </Stack>
  );
};

MetaQuestionTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
import {
  Box,
  Button,
  Card,
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
import { USERS } from '../../constants';
import { useUser } from '../../hooks/use-user';
import { Delete, Edit } from '@mui/icons-material';

export const UsersTable = ({setEditMode, setUserToDelete, setUserToReset}) => {
  const {state} = useUser()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = state.users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  return (
    <Stack>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{USERS.USERNAME}</TableCell>
                  <TableCell>{USERS.FIRST_NAME}</TableCell>
                  <TableCell>{USERS.LAST_NAME}</TableCell>
                  <TableCell>{USERS.EMAIL}</TableCell>
                  <TableCell>{USERS.TYPE}</TableCell>
                  <TableCell>{USERS.ACTIONS}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => {setEditMode(user)}}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => setUserToDelete(user)}>
                        <Delete />
                      </IconButton>
                      <Button onClick={() => setUserToReset(user)}>
                        {USERS.RESET_PASSWORD}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={state.users.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </Stack>
  );
};


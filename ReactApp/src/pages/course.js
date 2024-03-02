import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';

const now = new Date();

const MetaQuestionTable = () => <h1>Meta questions will be add in the future</h1>

const UserTable = (userType, userData) => {
  return (
    <>
      <h1>{userType}</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              {/* <TableCell align="right">Username</TableCell> */}
              {/* <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData?.map((row) => (
              <TableRow
                key={row.username}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                {/* <TableCell align="right">{row.username}</TableCell> */}
                {/* <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
            <TableCell align="right">{row.protein}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
const Page = () => {
  const [course, setCourse] = useState({})


  const getCourse = async () => {
    let { course } = await requestServer(serverPath.VIEW_COURSE, httpsMethod.GET)
    setCourse(course)
  }

  useEffect(() => {
    getCourse()
  }, []);

  return (
    <>
      <h1>{course.properties?.courseName ? course.properties.courseName : "Loading"}</h1>
      {UserTable("Course Admins", course.personal?.["CourseAdmins"])}
      {UserTable("TAs", course.personal?.["TAs"])}
      {UserTable("Graders", course.personal?.["Graders"])}
      {MetaQuestionTable(course.personal?.["Metaquestions"])}
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

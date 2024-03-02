import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';

const MetaQuestionTable = () => (
  <div style={{ marginTop: '20px', color: 'orange' }}>
    <h1>Meta questions will be added in the future</h1>
  </div>
);

const UserTable = (userType, userData) => (
  <div style={{ marginTop: '20px' }}>
    <h1 style={{ color: 'black' }}>{userType}</h1>
    <TableContainer component={Paper} style={{ background: 'orange' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ color: 'blue' }}>Username</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

const Page = () => {
  const [course, setCourse] = useState({});

  const getCourse = async () => {
    let { course } = await requestServer(serverPath.VIEW_COURSE, httpsMethod.GET);
    setCourse(course);
  };

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', color: 'black', textAlign: 'center' }}>
      <h1>{`Course : ${course.properties?.courseName || 'Loading'}`}</h1>
      {UserTable('Course Admins', course.personal?.['CourseAdmins'])}
      {UserTable('TAs', course.personal?.['TAs'])}
      {UserTable('Graders', course.personal?.['Graders'])}
      {MetaQuestionTable(course.personal?.['Metaquestions'])}
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

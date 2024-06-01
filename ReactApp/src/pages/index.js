import { Box, Stack, Container, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewFAQ } from 'src/sections/overview/overview-FAQ';
import { OverviewAssignedTasks } from 'src/sections/overview/overview-my-tasks';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewQuestionTips } from 'src/sections/overview/overview-question-tips';
import {OverviewCalander} from "../sections/overview/overview-calender";
import {HELLO_USER } from '../constants';


const Page = () => (
  <>
    <Box
      component="main"
    >
      <Container maxWidth="xl">
        <Stack spacing={4} direction="row" justifyContent="space-between">

          <Stack item> 
          {/*left section*/}
            <Stack container item spacing={4}>
              <Typography variant="h4">
                {HELLO_USER(JSON.parse(localStorage.getItem("user"))["username"])}
              </Typography>
              <OverviewAssignedTasks/>
            </Stack>
          </Stack>

          <Stack container item xs={8} direction="column" justifyContent="flex-end" spacing={4} >
          {/*right section*/}

            <Stack container item spacing={1} direction="row" > 
            {/*upper section*/}
              <Grid item xs={12} sm={10} lg={2} height='100%'>
                <OverviewTasksProgress/>
              </Grid>
              <Grid item xs={12} sm={10} lg={2} height='100%'>
                <OverviewQuestionTips/>
              </Grid>
              <Grid item xs={12} sm={10} lg={2} height='100%'>
                <OverviewFAQ/>
              </Grid>
            </Stack>
            <Stack container item spacing={4} direction="row" maxWidth={600} >
              {/*lower section*/}
              <Grid item xs={12} md={6} lg={4}>
                <OverviewCalander/>
              </Grid>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

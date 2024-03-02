import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Stack, Typography, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewFAQ } from 'src/sections/overview/overview-FAQ';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewAssignedTasks } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewQuestionTips } from 'src/sections/overview/overview-question-tips';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';

const now = new Date();

const Page = () => (
  <>
    <Head>
      <title>
        Overview | Devias Kit
      </title>
    </Head>
    <Box
      component="main"
    >
      <Container maxWidth="xl">
        <Stack spacing={10} direction="row" justifyContent="space-between">

          <Stack item> 
          {/*left section*/}
                  hello
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
            <Stack container item spacing={4} direction="row" >
              {/*lower section*/}
              <Grid item xs={12} md={6} lg={4}>
                <OverviewAssignedTasks/>
              </Grid>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  </>
);

{/* <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalProfit
              sx={{ height: '100%' }}
              value="$15k"
            />
          </Grid>
          <Grid
            xs={12}
            lg={8}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'This year',
                  data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                },
                {
                  name: 'Last year',
                  data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={[63, 15, 22]}
              labels={['Desktop', 'Tablet', 'Phone']}
              sx={{ height: '100%' }}
            />
          </Grid>
          
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={8}
          >
            <OverviewLatestOrders
              orders={[
                {
                  id: 'f69f88012978187a6c12897f',
                  ref: 'DEV1049',
                  amount: 30.5,
                  customer: {
                    name: 'Ekaterina Tankova'
                  },
                  createdAt: 1555016400000,
                  status: 'pending'
                },
                {
                  id: '9eaa1c7dd4433f413c308ce2',
                  ref: 'DEV1048',
                  amount: 25.1,
                  customer: {
                    name: 'Cao Yu'
                  },
                  createdAt: 1555016400000,
                  status: 'delivered'
                },
                {
                  id: '01a5230c811bd04996ce7c13',
                  ref: 'DEV1047',
                  amount: 10.99,
                  customer: {
                    name: 'Alexa Richardson'
                  },
                  createdAt: 1554930000000,
                  status: 'refunded'
                },
                {
                  id: '1f4e1bd0a87cea23cdb83d18',
                  ref: 'DEV1046',
                  amount: 96.43,
                  customer: {
                    name: 'Anje Keizer'
                  },
                  createdAt: 1554757200000,
                  status: 'pending'
                },
                {
                  id: '9f974f239d29ede969367103',
                  ref: 'DEV1045',
                  amount: 32.54,
                  customer: {
                    name: 'Clarke Gillebert'
                  },
                  createdAt: 1554670800000,
                  status: 'delivered'
                },
                {
                  id: 'ffc83c1560ec2f66a1c05596',
                  ref: 'DEV1044',
                  amount: 16.76,
                  customer: {
                    name: 'Adam Denisov'
                  },
                  createdAt: 1554670800000,
                  status: 'delivered'
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid> */}
          {/* </Grid>
          <Grid item xs = {0}/> */}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

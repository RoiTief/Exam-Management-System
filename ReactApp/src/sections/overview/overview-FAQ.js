import PropTypes from 'prop-types';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { FAQ } from '../../constants';

export const OverviewFAQ = (props) => {
  return (
    <Card>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="column"
          justifyContent="space-between"
          spacing={1}
        >
        <div
          style={{
            width: '120px',  
            height: '100px',
            overflow: 'hidden', 
            backgroundImage: 'url("https://img.freepik.com/premium-vector/coming-soon-logo_551032-890.jpg")',
            backgroundSize: '200%', 
            backgroundPosition: 'center',
          }}
        ></div> 
        <Typography
          color="text.secondary"
          fontWeight= "bold"
          fontSize={20}
          alignContent="center"
        >
          {FAQ.FAQ}
        </Typography>    
        </Stack>
      </CardContent>
    </Card>
  );
};


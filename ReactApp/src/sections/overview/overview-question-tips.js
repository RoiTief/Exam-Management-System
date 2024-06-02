import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { QUESTIONS_TIPS } from '../../constants';

export const OverviewQuestionTips = (props) => {
  const { difference, positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="column"
          justifyContent="space-between"
          spacing={1}
          alignContent="center"
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
          fontSize={20}
          fontWeight= "bold"
          align= "center"
        >
          {QUESTIONS_TIPS.QUESTIONS_TIPS}
        </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};



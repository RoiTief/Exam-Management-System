import PropTypes from 'prop-types';
import {
    Card,
    CardActions,
    CardHeader,
    Stack,
} from '@mui/material';
import { CALENDAR } from '../../constants';

export const OverviewCalander = () => {

    return (
        <Stack>
            <Card>
                <CardHeader title={CALENDAR.CALENDAR} />

                <CardActions sx={{ justifyContent: 'flex-end' }}>
                </CardActions>
            </Card>
        </Stack>
    );
};

OverviewCalander.propTypes = {
    products: PropTypes.array,
    sx: PropTypes.object
};

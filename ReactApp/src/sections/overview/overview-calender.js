import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import {httpsMethod, serverPath, requestServer,TOKEN_FIELD_NAME} from 'src/utils/rest-api-call';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Stack,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    SvgIcon
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Task } from '../popUps/TaskPopup';


export const OverviewCalander = () => {

    return (
        <Stack>
            <Card>
                <CardHeader title="Calander" />

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

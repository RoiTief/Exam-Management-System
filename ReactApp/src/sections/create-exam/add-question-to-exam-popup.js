import PropTypes from 'prop-types';
import { overlayStyle, popupStyle } from './popup-style';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import {
  Button,
  Stack,
  TextField,
  Typography,
  Autocomplete
} from '@mui/material';
import { useEffect, useState } from 'react';
import { COURSE_STAFF } from '../../constants';

export const AddQuestionToExamPopup = ({isOpen, closePopup}) => {
  return (
    isOpen ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={{ ...popupStyle, width: '30%' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {COURSE_STAFF.ADD_PERSONAL_TITLE}
          </Typography>
        </div>
      </div>
    ) : null
  );
};

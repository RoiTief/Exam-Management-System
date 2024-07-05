import PropTypes from 'prop-types';
import { Box, TextField } from '@mui/material';
import React, { useState } from 'react';

export const ExamsSearch = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <Box>
      <TextField
        fullWidth
        value={searchText}
        onChange={handleSearchChange}
        placeholder="Search exams by reason"
        variant="outlined"
      />
    </Box>
  );
};

ExamsSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

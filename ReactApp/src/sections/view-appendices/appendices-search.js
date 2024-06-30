import { Card, InputAdornment, OutlinedInput, SvgIcon, Stack, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { APPENDICES_CATALOG } from '../../constants';

export const AppendicesSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('opentext');

  const handleSearchTermChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm.trim(), searchType);
  };

  const handleSearchTypeChange = (event) => {
    const newSearchType = event.target.value;
    setSearchType(newSearchType);
    onSearch(searchTerm.trim(), newSearchType);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>{APPENDICES_CATALOG.SEARCH_TYPE_LABEL}</InputLabel>
          <Select
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <MenuItem value="opentext">{APPENDICES_CATALOG.OPEN_TEXT}</MenuItem>
            <MenuItem value="tag">{APPENDICES_CATALOG.TAG}</MenuItem>
          </Select>
        </FormControl>
        <OutlinedInput
          value={searchTerm}
          placeholder={APPENDICES_CATALOG.SEARCH_PLACEHOLDER}
          onChange={handleSearchTermChange}
          sx={{ width: '100%' }} // Set width to 100% of the original size
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
        />
      </Stack>
    </Card>
  );
};

import { Card, Chip, InputAdornment, OutlinedInput, SvgIcon, Stack, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { APPENDICES_CATALOG } from '../../constants';

export const AppendicesSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchType, setSearchType] = useState('opentext');

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      if (!selectedKeys.includes(searchTerm)) {
        const newKeys = [...selectedKeys, searchTerm];
        setSelectedKeys(newKeys);
        onSearch(newKeys, searchType);
      }
      setSearchTerm('');
    }
  };

  const handleDelete = (keyToDelete) => {
    const updatedKeys = selectedKeys.filter((key) => key !== keyToDelete);
    setSelectedKeys(updatedKeys);
    onSearch(updatedKeys, searchType);
  };

  const handleSearchTypeChange = (event) => {
    const newSearchType = event.target.value;
    setSearchType(newSearchType);
    onSearch(selectedKeys, newSearchType);
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
          onKeyDown={handleKeyPress}
          sx={{ width: '75%' }}  // Set width to 75% of the original size
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" mt={1}>
        {selectedKeys.map((key) => (
          <Chip
            key={key}
            label={key}
            onDelete={() => handleDelete(key)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Stack>
    </Card>
  );
};

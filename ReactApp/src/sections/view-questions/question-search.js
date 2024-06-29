import {
  Card,
  Chip,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { QUESTIONS_CATALOG, APPENDICES_CATALOG } from '../../constants';

export const QuestionsSearch = ({ onSearch, onTextSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchType, setSearchType] = useState(QUESTIONS_CATALOG.STEM_HEADING);

  const handleSearchTermChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (searchType === QUESTIONS_CATALOG.STEM_HEADING) {
      onTextSearch(newSearchTerm);
    }
  };

  const handleKeyPress = (event) => {
    if (searchType === QUESTIONS_CATALOG.KEYWORDS_HEADING && event.key === 'Enter' && searchTerm.trim() !== '') {
      if (!selectedKeys.includes(searchTerm)) {
        const newSelectedKeys = [...selectedKeys, searchTerm];
        setSelectedKeys(newSelectedKeys);
        onSearch(newSelectedKeys);
      }
      setSearchTerm('');
    }
  };

  const handleDelete = (keyToDelete) => {
    const updatedKeys = selectedKeys.filter((key) => key !== keyToDelete);
    setSelectedKeys(updatedKeys);
    onSearch(updatedKeys);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    // Reset search term and selected keys when changing search type
    setSearchTerm('');
    setSelectedKeys([]);
    onSearch([]);
    onTextSearch('');
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Select
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <MenuItem value={QUESTIONS_CATALOG.STEM_HEADING}>{QUESTIONS_CATALOG.STEM_HEADING}</MenuItem>
            <MenuItem value={QUESTIONS_CATALOG.KEYWORDS_HEADING}>{QUESTIONS_CATALOG.KEYWORDS_HEADING}</MenuItem>
          </Select>
          <OutlinedInput
            value={searchTerm}
            placeholder={QUESTIONS_CATALOG.SEARCH_PLACEHOLDER(searchType)}
            onChange={handleSearchTermChange}
            onKeyDown={handleKeyPress}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
            sx={{ width: '50%' }}
          />
        </Stack>
        {searchType === QUESTIONS_CATALOG.KEYWORDS_HEADING && (
          <>
            <Typography variant="body2">
              {QUESTIONS_CATALOG.SEARCH_BY_KEYWORDS}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
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
          </>
        )}
      </Stack>
    </Card>
  );
};

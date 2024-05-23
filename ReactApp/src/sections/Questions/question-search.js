import { Card, Chip, InputAdornment, OutlinedInput, SvgIcon, Stack } from '@mui/material';
import { useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';

export const QuestionsSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      if (!selectedKeys.includes(searchTerm)) {
        setSelectedKeys([...selectedKeys, searchTerm]);
        onSearch([...selectedKeys, searchTerm]);
      }
      setSearchTerm('');
    }
  };

  const handleDelete = (keyToDelete) => {
    const updatedKeys = selectedKeys.filter((key) => key !== keyToDelete);
    setSelectedKeys(updatedKeys);
    onSearch(updatedKeys);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <OutlinedInput
          value={searchTerm}
          placeholder="Search question by keyword"
          onChange={handleSearchTermChange}
          onKeyDown={handleKeyPress}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
        />
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

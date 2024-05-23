import React, { useState } from 'react';
import { RadioGroup, Radio, Paper, OutlinedInput, InputAdornment, SvgIcon } from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';

const appendices = [
  { title: 'Appendix A', tag: 'General', content: 'Content of Appendix A' },
  { title: 'Appendix B', tag: 'Specific', content: 'Content of Appendix B' },
  // Add more appendices as needed
];

const AppendixList = ({ onSelectAppendix }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [selectedAppendix, setSelectedAppendix] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  const handleAppendixClick = (appendix) => {
    setSelectedAppendix(appendix);
    onSelectAppendix(appendix);
  };

  const filteredAppendices = appendices.filter((appendix) =>
    appendix[searchBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ marginLeft: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <OutlinedInput
          fullWidth
          placeholder={`Search by ${searchBy}`}
          value={searchTerm}
          onChange={handleSearchChange}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          endAdornment={
            selectedAppendix && (
              <InputAdornment position="end">
                <SvgIcon color="primary" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }
        />
        <select value={searchBy} onChange={handleSearchByChange} style={{ marginLeft: '10px' }}>
          <option value="title">Title</option>
          <option value="tag">Tag</option>
        </select>
      </div>
      <RadioGroup>
        {filteredAppendices.map((appendix, index) => (
          <Paper
            key={index}
            style={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              cursor: 'pointer', // Add cursor style to indicate clickability
              display: 'flex', // Add flex display to control item positioning
              alignItems: 'center', // Center align items vertically
            }}
            onClick={() => handleAppendixClick(appendix)}
          >
            <Radio checked={selectedAppendix === appendix} />
            <div style={{ marginLeft: '10px' }}>
              <h3>{appendix.title}</h3>
              <p>Tag: {appendix.tag}</p>
              <p>{appendix.content}</p>
            </div>
          </Paper>
        ))}
      </RadioGroup>
    </div>
  );
};

export default AppendixList;

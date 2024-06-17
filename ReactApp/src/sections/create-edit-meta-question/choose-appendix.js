import React, { useEffect, useState } from 'react';
import { RadioGroup, Radio, Paper, OutlinedInput, InputAdornment, SvgIcon } from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION } from '../../constants';
import { useFormikContext } from 'formik';

const deepEqualAppendix = (a, b) => (
  a.title === b.title && a.tag === b.tag && a.content === b.content
);

const AppendixList = ({ values, onSelectAppendix }) => {
  const { setFieldValue } = useFormikContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [appendices, setAppendices] = useState([])

  useEffect(() => {
    async function fetchAppendices() {
      try {
        const { appendices } = await requestServer(serverPath.GET_ALL_APPENDICES, httpsMethod.GET);
        setAppendices(appendices);
      } catch (error) {
        console.error('Error fetching appendices:', error);
      }
    }

    fetchAppendices();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  const handleAppendixClick = (appendix) => {
    setFieldValue('appendix', appendix);
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
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => handleAppendixClick(appendix)}
          >
            <Radio checked={values.appendix && deepEqualAppendix(values.appendix, appendix)} />
            <div style={{ marginLeft: '10px' }}>
              <h3>{CREATE_QUESTION.APPENDIX_TITLE}{appendix.title}</h3>
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

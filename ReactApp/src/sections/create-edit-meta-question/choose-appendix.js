import React, { useEffect, useState } from 'react';
import { RadioGroup, Radio, Paper, OutlinedInput, InputAdornment, SvgIcon } from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION } from '../../constants';
import { useFormikContext } from 'formik';
import ErrorMessage from '../../components/errorMessage';


const AppendixList = ({ values, onSelectAppendix }) => {
  const { setFieldValue } = useFormikContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [appendices, setAppendices] = useState([]);
  const [selectedAppendix, setSelectedAppendix] = useState(values.appendix || null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchAppendices() {
      try {
        const { appendices } = await requestServer(serverPath.GET_ALL_APPENDICES, httpsMethod.GET);
        setAppendices(appendices);
      } catch (error) {
        console.error('Error fetching appendices:', error);
        setErrorMessage(`Error fetching appendices: ${error.message}`);
      }
    }

    fetchAppendices();
  }, [setErrorMessage]);

  useEffect(() => {
    // Set initial selected appendix based on values.appendix
    if (values.appendix) {
      const initialAppendix = appendices.find(
        (appendix) => appendix.tag === values.appendix.tag
      );
      if (initialAppendix) {
        setSelectedAppendix(initialAppendix);
      }
    }
  }, [values.appendix, appendices]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  const handleAppendixClick = (appendix) => {
    if (selectedAppendix && selectedAppendix.tag===appendix.tag) {
      setSelectedAppendix(null);
      setFieldValue('appendix', null);
      onSelectAppendix(null);
    } else {
      setSelectedAppendix(appendix);
      setFieldValue('appendix', appendix);
      onSelectAppendix(appendix);
    }
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
            <Radio checked={selectedAppendix && selectedAppendix.tag===appendix.tag} />
            <div style={{ marginLeft: '10px' }}>
              <h3>{CREATE_QUESTION.APPENDIX_TITLE}{appendix.title}</h3>
              <p>Tag: {appendix.tag}</p>
              <p>{appendix.content}</p>
            </div>
          </Paper>
        ))}
      </RadioGroup>
      <ErrorMessage message={errorMessage} />
    </div>
  );
};

export default AppendixList;

import React, { useEffect, useState } from 'react';
import { RadioGroup, Radio, Paper, OutlinedInput, InputAdornment, SvgIcon } from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { httpsMethod, requestServer, serverPath } from '../../utils/rest-api-call';
import { CREATE_QUESTION } from '../../constants';
import { useFormikContext } from 'formik';
import ErrorMessage from '../../components/errorMessage';
import { AppendicesSearch } from '../view-appendices/appendices-search';


const AppendixList = ({ values, onSelectAppendix }) => {
  const { setFieldValue } = useFormikContext();
  const [appendices, setAppendices] = useState([]);
  const [selectedAppendix, setSelectedAppendix] = useState(values.appendix || null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    async function fetchAppendices() {
      try {
        const { appendices } = await requestServer(serverPath.GET_ALL_APPENDICES, httpsMethod.GET);
        setAppendices(appendices);
        setFilteredData(appendices)
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

  const handleSearch = (text, searchType) => {
    const filteredAppendices = appendices.filter((appendix) => {
      if (searchType === 'tag')
        return appendix.tag.includes(text);
      return appendix.title.includes(text) || appendix.tag.includes(text) || appendix.content.includes(text)
    });
    setFilteredData(filteredAppendices);
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <AppendicesSearch onSearch={handleSearch} />
      <RadioGroup>
        {filteredData.map((appendix, index) => (
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

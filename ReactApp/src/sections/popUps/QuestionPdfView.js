import PropTypes from 'prop-types';
import {overlayStyle, popupStyle} from './popup-style'
import React, { useEffect, useState } from 'react';
import { requestLatexServer} from '../../utils/rest-api-call';

export const PdfLatexPopup = (props) => {
  const { isOpen, closePopup, content, type } = props;

  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch PDF URL from server
    fetchPdfUrlFromServer();
  }, []);

  const fetchPdfUrlFromServer = async () => {
    try {
      const response= await requestLatexServer(type, {content});
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching PDF:', error.message);
      setLoading(false);
      if (error.message === 'Failed to fetch') {
        setError('Server unreachable');
      }
      // Handle error
    }
  };

  return (
    (isOpen) ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={{...popupStyle, width: '40%', height: '80'
            + ''
            + '%'}}>
          { loading ? (
            <p>Loading PDF...</p>
          ) : (
            error ? (
              <p>Error: {error}</p>
            ) : (
            <div style={{width: '100%', height: '100%'}}>
              <embed
                src={pdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
              />
            </div>
          ))}
        </div>
      </div>
    ) : ""
  );
};

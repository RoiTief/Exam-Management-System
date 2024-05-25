import PropTypes from 'prop-types';
import {overlayStyle, popupStyle} from './popup-style'
import React, { useEffect, useState } from 'react';
import { httpsMethod } from '../../utils/rest-api-call';

export const PdfLatexPopup = (props) => {
  const { isOpen, closePopup, content, type } = props;

  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch PDF URL from server
    fetchPdfUrlFromServer();
  }, []);

  const fetchPdfUrlFromServer = async () => {
    try {
      const latexCode = 'My name is:'
        + '    \\begin{equation*}\n'
        + '        \\frac{Slim}{Shady}\n'
        + '    \\end{equation*}\n'
        + '\\end{document}';
      const body = {latexCode};
      // const body = {question};
      //TODO
      const method = httpsMethod.POST
      const response= await fetch( "http://localhost:3001/compile",
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Origin': '*',
          },
          body: JSON.stringify(body)
        });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      // Handle error
    }
  };

  return (
    (isOpen) ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={popupStyle}>
          { loading ? (
            <p>Loading PDF...</p>
          ) : (
            <div>
              <embed
                src={pdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
              />
            </div>
          )
          }
        </div>
      </div>
    ) : ""
  );
};

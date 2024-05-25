import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer, TOKEN_FIELD_NAME } from 'src/utils/rest-api-call';
import Cookies from 'js-cookie';

const PdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch PDF URL from server
    fetchPdfUrlFromServer();
  }, []);

  const fetchPdfUrlFromServer = async () => {
    try {
      const filename = 'orimi.pdf';
      const body = {filename};
      const method = httpsMethod.POST
      var response;
      if (Cookies.get(TOKEN_FIELD_NAME)) {
        response = await fetch("http://localhost:8080/getPdf",
          {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Origin': '*',
              'Authorization': `JWT ${Cookies.get(TOKEN_FIELD_NAME)}`
            },
            body: JSON.stringify(body)
          })
      }
      else{
        response = await fetch( "http://localhost:8080/getPdf",
          {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Origin': '*',
            },
            body: JSON.stringify(body)
          })
      }
      response = await response.json();
      console.log(`response: ${JSON.stringify(response)}`);
      // const blob = await response.blob();
      // const url = URL.createObjectURL(blob);
      const url = response.data;
      setPdfUrl(url);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      // Handle error
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      {loading ? (
        <p>Loading PDF...</p>
      ) : (
        <embed
          src={pdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
};

export default PdfViewer;
import React, { useState, useEffect } from 'react';
import { httpsMethod } from 'src/utils/rest-api-call';

const PdfViewer = () => {
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
    <div>
    { loading ? (
        <p>Loading PDF...</p>
      ) : (
        <div style={{ height: '100vh' }}>
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
  );
};

export default PdfViewer;
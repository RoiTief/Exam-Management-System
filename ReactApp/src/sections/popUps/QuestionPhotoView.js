import React, { useEffect, useState } from 'react';
import { requestLatexServer } from '../../utils/rest-api-call';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs';
import { Typography } from '@mui/material';
import ErrorMessage from '../../components/errorMessage';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  pdfWorker,
  import.meta.url,
).toString();

const QuestionPhotoView = ({ content, type }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState(null);
  const [retries, setRetries] = useState(0);
  const MAX_RETRIES = 3;

  const retryMechanism = (message) => {
    if (retries < MAX_RETRIES) {
      setRetries(retries + 1);
    }
    else {
      setError(message);
    }
    console.error(message);
  };

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await requestLatexServer(type, { content });
        if (!response.ok) {
          retryMechanism("Failed to load PDF file");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        retryMechanism("Server Unreachable");
      }
    };
    fetchPDF();
  }, [content, type, retries]);

  return (
    <div style={{ width: '40%', height: '80%' }}>
      {error ? (
        <ErrorMessage message={JSON.stringify(content)}></ErrorMessage>
      ) : (
        <div style={{ width: '100%', height: '100%' }}>
          {pdfUrl ? (
            <Document file={pdfUrl}>
              <Page pageNumber={1} scale={2} />
            </Document>
          ) : (
            <Typography variant="body1" component="div">Loading...</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionPhotoView;

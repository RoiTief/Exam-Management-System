import React, { useEffect, useState } from 'react';
import { requestLatexServer } from '../../utils/rest-api-call';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs';
import { Typography } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  pdfWorker,
  import.meta.url,
).toString();

const QuestionPhotoView = ({ content, type }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await requestLatexServer(type, { content });
        if (!response.ok) {
          setError('Failed to load PDF file.');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF:', error.message);
        if (error.message === 'Failed to fetch') {
          setError('Server unreachable');
        }
        // Handle other errors
      }
    };
    fetchPDF();
  }, [content, type]);

  return (
    <div style={{ width: '40%', height: '80%' }}>
      {error ? (
        <Typography variant="body1" component="div">{JSON.stringify(content)}</Typography>
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

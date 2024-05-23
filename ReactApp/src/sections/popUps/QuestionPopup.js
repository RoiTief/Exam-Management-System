import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { overlayStyle, popupStyle } from './popup-style';
import { SvgIcon, Divider, Button, IconButton, Stack } from '@mui/material';
import ChevronDoubleDownIcon from '@heroicons/react/20/solid/esm/ChevronDoubleDownIcon';
import ChevronDoubleUpIcon from '@heroicons/react/20/solid/esm/ChevronDoubleUpIcon';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

export const Question = (props) => {
  const { isOpen, closePopup, question, onEdit } = props;
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [showAllDistractors, setShowAllDistractors] = useState(false);
  const [compiledContent, setCompiledContent] = useState({
    appendix: { title: null, tag: null, content: null },
    keywords: [],
    correctAnswers: [],
    distractors: [],
  });

  const toggleAnswers = () => {
    setShowAllAnswers(!showAllAnswers);
  };

  const toggleDistractors = () => {
    setShowAllDistractors(!showAllDistractors);
  };

  const handleLatex = async (latexCode) => {
    try {
      const response = await axios.post('http://localhost:3001/compile', { latexCode }, { responseType: 'blob' });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error('Error compiling LaTeX:', error);
      return null;
    }
  };

  useEffect(() => {
    const compileAllLatex = async () => {
      if (!question) return;

      const compiled = { appendix: {}, keywords: [], correctAnswers: [], distractors: [] };

      // Compile appendix fields
      if (question.appendix) {
        compiled.appendix.title = await handleLatex(question.appendix.title);
        compiled.appendix.tag = await handleLatex(question.appendix.tag);
        compiled.appendix.content = await handleLatex(question.appendix.content);
      }

      // Compile keywords
      if (question.keywords) {
        compiled.keywords = await Promise.all(question.keywords.map(keyword => handleLatex(keyword)));
      }

      // Compile correct answers
      if (question.correctAnswers) {
        compiled.correctAnswers = await Promise.all(question.correctAnswers.map(async answer => ({
          text: await handleLatex(answer.text),
          explanation: await handleLatex(answer.explanation),
        })));
      }

      // Compile distractors
      if (question.distractors) {
        compiled.distractors = await Promise.all(question.distractors.map(async distractor => ({
          text: await handleLatex(distractor.text),
          explanation: await handleLatex(distractor.explanation),
        })));
      }

      setCompiledContent(compiled);
    };

    compileAllLatex();
  }, [question]);

  const buttonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: 'orange',
    marginTop: '10px'
  };

  const editButtonStyle = {
    ...buttonStyle,
    position: 'absolute',
    top: '10px',
    right: '10px'
  };

  const headerStyle = {
    backgroundColor: '#f9cb9c',
    borderRadius: '20px',
    padding: '10px 20px',
    textAlign: 'center',
    color: 'inherit',
    margin: '20px 0'
  };

  if (!isOpen || !question) {
    return null;
  }

  return (
    <div className="popup">
      <div onClick={closePopup} style={overlayStyle}></div>
      <div className="popup-content" style={popupStyle}>
        <div style={{ position: 'relative' }}>
          <h1 style={{ textAlign: 'center' }}>Meta Question</h1>
          <IconButton onClick={onEdit} style={editButtonStyle}>
            <EditIcon />
          </IconButton>
        </div>
        {question.appendix && (
          <div className="appendix-section">
            <Divider />
            <h2 style={headerStyle}>Appendix</h2>
            <h3>Title:</h3>
            {compiledContent.appendix.title && (
              <Document file={compiledContent.appendix.title}>
                <Page pageNumber={1} />
              </Document>
            )}
            <h3>Tag:</h3>
            {compiledContent.appendix.tag && (
              <Document file={compiledContent.appendix.tag}>
                <Page pageNumber={1} />
              </Document>
            )}
            <h3>Content:</h3>
            {compiledContent.appendix.content && (
              <Document file={compiledContent.appendix.content}>
                <Page pageNumber={1} />
              </Document>
            )}
          </div>
        )}
        <Divider />
        <div className="question-section">
          <h2 style={headerStyle}>Stem</h2>
          <p>{question.stem}</p>
        </div>
        <Divider />
        <div className="keywords-section">
          <h2 style={headerStyle}>Keywords</h2>
          <Stack direction="row" spacing={1} style={{ flexWrap: 'wrap' }}>
            {compiledContent.keywords.map((keyword, index) => (
              <Document key={`keyword-${index}`} file={keyword}>
                <Page pageNumber={1} />
              </Document>
            ))}
          </Stack>
        </div>
        <Divider />
        <div className="answers-section">
          <h2 style={headerStyle}>Correct Answers</h2>
          <div>
            {compiledContent.correctAnswers.slice(0, showAllAnswers ? compiledContent.correctAnswers.length : 2).map((answer, index) => (
              <div key={`correct-${index}`}>
                <h3>Text:</h3>
                {answer.text && (
                  <Document file={answer.text}>
                    <Page pageNumber={1} />
                  </Document>
                )}
                <h3>Explanation:</h3>
                {answer.explanation && (
                  <Document file={answer.explanation}>
                    <Page pageNumber={1} />
                  </Document>
                )}
              </div>
            ))}
          </div>
          {compiledContent.correctAnswers.length > 2 && (
            <Button onClick={toggleAnswers} style={buttonStyle} startIcon={(
              <SvgIcon fontSize="small">
                {showAllAnswers ? <ChevronDoubleUpIcon /> : <ChevronDoubleDownIcon />}
              </SvgIcon>
            )}>
              {showAllAnswers ? 'Show less answers' : 'Show more answers'}
            </Button>
          )}
        </div>
        <Divider />
        <div className="distractors-section">
          <h2 style={headerStyle}>Distractors</h2>
          <div>
            {compiledContent.distractors.slice(0, showAllDistractors ? compiledContent.distractors.length : 2).map((distractor, index) => (
              <div key={`distractor-${index}`}>
                <h3>Text:</h3>
                {distractor.text && (
                  <Document file={distractor.text}>
                    <Page pageNumber={1} />
                  </Document>
                )}
                <h3>Explanation:</h3>
                {distractor.explanation && (
                  <Document file={distractor.explanation}>
                    <Page pageNumber={1} />
                  </Document>
                )}
              </div>
            ))}
          </div>
          {compiledContent.distractors.length > 2 && (
            <Button onClick={toggleDistractors} style={buttonStyle} startIcon={(
              <SvgIcon fontSize="small">
                {showAllDistractors ? <ChevronDoubleUpIcon /> : <ChevronDoubleDownIcon />}
              </SvgIcon>
            )}>
              {showAllDistractors ? 'Show less distractors' : 'Show more distractors'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

Question.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
};

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { overlayStyle, popupStyle } from './popup-style';
import { SvgIcon, ListItemText, ListItem, Divider, Button, IconButton, Chip, Stack } from '@mui/material';
import ChevronDoubleDownIcon from '@heroicons/react/20/solid/esm/ChevronDoubleDownIcon';
import ChevronDoubleUpIcon from '@heroicons/react/20/solid/esm/ChevronDoubleUpIcon';
import EditIcon from '@mui/icons-material/Edit';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';

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
  const [pdfTest, setPdfTest] = useState(null)

  const toggleAnswers = () => {
    setShowAllAnswers(!showAllAnswers);
  };

  const toggleDistractors = () => {
    setShowAllDistractors(!showAllDistractors);
  };

  // const PdfViewer = () => {
  //   const response = requestServer(serverPath.COMPILE, httpsMethod.POST, {});
  //   const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  //   const pdfUrl =  URL.createObjectURL(pdfBlob);
  //   return (
  //     <div style={{ height: '100vh' }}>
  //       <embed
  //         src={pdfUrl}
  //         type="application/pdf"
  //         width="100%"
  //         height="100%"
  //       />
  //     </div>
  //   );
  // };

  const handleLatex = async (latexCode) => {
    try {
      //    var response = await requestServer(serverPath.SIGN_UP, httpsMethod.POST, { username, password })
      const response = await requestServer(serverPath.COMPILE, httpsMethod.POST, { latexCode });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error('Error compiling LaTeX:', error);
      return null;
    }
  };

  useEffect(() => {
      const response = requestServer(serverPath.COMPILE, httpsMethod.POST, {});
      response.then((result) => {
        const pdfUrl = "https://www.orimi.com/pdf-test.pdf";
        console.log(`pdfUrl: ${pdfUrl}`);
        setPdfTest(pdfUrl);
      })
      //const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      //const pdfUrl =  URL.createObjectURL(pdfBlob);

    // const compileAllLatex = async () => {
    //   if (!question) return;
    //
    //   const compiled = { appendix: {}, keywords: [], correctAnswers: [], distractors: [] };
    //
    //   // Compile appendix fields
    //   if (question.appendix) {
    //     compiled.appendix.title = question.appendix.title;
    //     compiled.appendix.tag = question.appendix.tag;
    //     //compiled.appendix.content = await handleLatex(question.appendix.content);
    //   }
    //
    //   // Compile keywords
    //   if (question.keywords) {
    //     compiled.keywords = question.keywords;
    //   }
    //
    //   // Compile correct answers
    //   if (question.correctAnswers) {
    //     compiled.correctAnswers = await Promise.all(question.correctAnswers.map(async answer => ({
    //       text: answer.text,
    //       explanation: answer.explanation,
    //     })));
    //   }
    //
    //   // Compile distractors
    //   if (question.distractors) {
    //     compiled.distractors = await Promise.all(question.distractors.map(async distractor => ({
    //       text: distractor.text,
    //       explanation: distractor.explanation,
    //     })));
    //   }
    //
    //   setCompiledContent(compiled);
    // };
    //
    // compileAllLatex();
  }, []);

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
    isOpen && (
      <div className="popup">
        <div onClick={closePopup}
             style={overlayStyle}></div>
        <div className="popup-content"
             style={popupStyle}>
          <div style={{ position: 'relative' }}>
            <h1 style={{textAlign: 'center'}}>Meta Question</h1>
            <IconButton onClick={onEdit}
                        style={editButtonStyle}>
              <EditIcon />
            </IconButton>
          </div>
          {question.appendix && (
            <div className="appendix-section">
              <Divider />
              <h2 style={headerStyle}>Appendix</h2>
              <h3>Title: {question.appendix.title}</h3>
              <h3>Tag: {question.appendix.tag}</h3>
              <h3>Content:</h3>
              <div style={{ height: '100vh' }}>
                 <embed
                  src={pdfTest}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                />
              </div>
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
            <Stack direction="row"
                   spacing={1}
                   style={{ flexWrap: 'wrap' }}>
              {question.keywords.map((keyword, index) => (
                <Chip key={`keyword-${index}`}
                      label={keyword} />
              ))}
            </Stack>
          </div>
          <Divider />
          <div className="answers-section">
            <h2 style={headerStyle}>Correct Answers</h2>
            <div>
              {question.correctAnswers.slice(0, showAllAnswers ? question.correctAnswers.length : 2).map((answer, index) => (
                <ListItem key={`correct-${index}`}>
                  <ListItemText primary={answer.text}
                                secondary={answer.explanation} />
                </ListItem>
              ))}
            </div>
            {question.correctAnswers.length > 2 && (
              <Button onClick={toggleAnswers}
                      style={buttonStyle}
                      startIcon={(
                        <SvgIcon fontSize="small">
                          {showAllAnswers ? <ChevronDoubleUpIcon /> : <ChevronDoubleDownIcon />}
                        </SvgIcon>
                      )}
              >
                {showAllAnswers ? 'Show less answers' : 'Show more answers'}
              </Button>
            )}
          </div>
          <Divider />
          <div className="distractors-section">
            <h2 style={headerStyle}>Distractors</h2>
            <div>
              {question.distractors.slice(0, showAllDistractors ? question.distractors.length : 2).map((distractor, index) => (
                <ListItem key={`distractor-${index}`}>
                  <ListItemText primary={distractor.text}
                                secondary={distractor.explanation} />
                </ListItem>
              ))}
            </div>
            {question.distractors.length > 2 && (
              <Button onClick={toggleDistractors}
                      style={buttonStyle}
                      startIcon={(
                        <SvgIcon fontSize="small">
                          {showAllDistractors ? <ChevronDoubleUpIcon /> : <ChevronDoubleDownIcon />}
                        </SvgIcon>
                      )}
              >
                {showAllDistractors ? 'Show less distractors' : 'Show more distractors'}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

Question.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
};

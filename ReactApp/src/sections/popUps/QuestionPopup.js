import PropTypes from 'prop-types';
import { useState } from 'react';
import { overlayStyle, popupStyle } from './popup-style';
import { SvgIcon, ListItemText, ListItem, Divider, Button, IconButton, Chip, Stack } from '@mui/material';
import ChevronDoubleDownIcon from '@heroicons/react/20/solid/ChevronDoubleDownIcon';
import ChevronDoubleUpIcon from '@heroicons/react/20/solid/ChevronDoubleUpIcon';
import EditIcon from '@mui/icons-material/Edit';
import { QUESTIONS_CATALOG } from '../../constants';

export const Question = (props) => {
  const { isOpen, closePopup, question, onEdit } = props;
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [showAllDistractors, setShowAllDistractors] = useState(false);

  const toggleAnswers = () => {
    setShowAllAnswers(!showAllAnswers);
  };

  const toggleDistractors = () => {
    setShowAllDistractors(!showAllDistractors);
  };

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

  const headerContainerStyle = {
    display: 'flex',
    margin: '20px 0'
  };

  const headerStyle = {
    backgroundColor: '#f9cb9c',
    borderRadius: '20px',
    padding: '10px 20px',
    textAlign: 'center',
    color: 'inherit',
    display: 'inline-block'
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
            <h1 style={{ textAlign: 'center' }}>{QUESTIONS_CATALOG.META_QUESTION_TITLE}</h1>
            <IconButton onClick={onEdit}
                        style={editButtonStyle}>
              <EditIcon />
            </IconButton>
          </div>
          {question.appendix && (
            <div className="appendix-section">
              <Divider />
              <div style={headerContainerStyle}>
                <h2 style={headerStyle}>{QUESTIONS_CATALOG.APPENDIX_TITLE}</h2>
              </div>
              <h3>Title: {question.appendix.title}</h3>
              <h3>Tag: {question.appendix.tag}</h3>
              <h3>Content:</h3>
              <p>{question.appendix.content}</p>
            </div>
          )}
          <Divider />
          <div className="question-section">
            <div style={headerContainerStyle}>
              <h2 style={headerStyle}>{QUESTIONS_CATALOG.STEM_HEADING}</h2>
            </div>
            <p>{question.stem}</p>
          </div>
          <Divider />
          <div className="keywords-section">
            <div style={headerContainerStyle}>
              <h2 style={headerStyle}>{QUESTIONS_CATALOG.KEYWORDS_HEADING}</h2>
            </div>
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
            <div style={headerContainerStyle}>
              <h2 style={headerStyle}>{QUESTIONS_CATALOG.CORRECT_ANSWERS_HEADING}</h2>
            </div>
            <div>
              {question.keys.slice(0, showAllAnswers ? question.keys.length : 2).map((answer, index) => (
                <ListItem key={`correct-${index}`}>
                  <ListItemText primary={answer.text}
                                secondary={answer.explanation} />
                </ListItem>
              ))}
            </div>
            {question.keys.length > 2 && (
              <Button onClick={toggleAnswers}
                      style={buttonStyle}
                      startIcon={(
                        <SvgIcon fontSize="small">
                          {showAllAnswers ? <ChevronDoubleUpIcon /> : <ChevronDoubleDownIcon />}
                        </SvgIcon>
                      )}
              >
                {showAllAnswers ? QUESTIONS_CATALOG.SHOW_LESS_ANSWERS : QUESTIONS_CATALOG.SHOW_MORE_ANSWERS}
              </Button>
            )}
          </div>
          <Divider />
          <div className="distractors-section">
            <div style={headerContainerStyle}>
              <h2 style={headerStyle}>{QUESTIONS_CATALOG.DISTRACTORS_HEADING}</h2>
            </div>
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
                {showAllDistractors ? QUESTIONS_CATALOG.SHOW_LESS_DISTRACTORS : QUESTIONS_CATALOG.SHOW_MORE_DISTRACTORS}
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

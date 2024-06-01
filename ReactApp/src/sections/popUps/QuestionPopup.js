import PropTypes from 'prop-types';
import { overlayStyle, popupStyle } from './popup-style';
import { useState } from 'react';
import { SvgIcon, ListItemText, ListItem, Divider, Button, IconButton, Chip, Stack } from '@mui/material';
import ChevronDoubleDownIcon from '@heroicons/react/20/solid/esm/ChevronDoubleDownIcon';
import ChevronDoubleUpIcon from '@heroicons/react/20/solid/esm/ChevronDoubleUpIcon';
import EditIcon from '@mui/icons-material/Edit';

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

  return (
    isOpen && (
      <div className="popup">
        <div onClick={closePopup}
             style={overlayStyle}></div>
        <div className="popup-content"
             style={popupStyle}>
          <div style={{ position: 'relative' }}>
            <h1 style={{ textAlign: 'center' }}>Meta Question</h1>
            <IconButton onClick={onEdit}
                        style={editButtonStyle}>
              <EditIcon />
            </IconButton>
          </div>
          {question.appendix && (
            <div className="appendix-section">
              <Divider />
              <div style={headerContainerStyle}>
                <h2 style={headerStyle}>Appendix</h2>
              </div>
              <h3>Title: {question.appendix.title}</h3>
              <h3>Tag: {question.appendix.tag}</h3>
              <p>{question.appendix.content}</p>
            </div>
          )}
          <Divider />
          <div className="question-section">
            <div style={headerContainerStyle}>
              <h2 style={headerStyle}>Stem</h2>
            </div>
            <p>{question.stem}</p>
          </div>
          <Divider />
          <div className="keywords-section">
            <div style={headerContainerStyle}>
              <h2 style={headerStyle}>Keywords</h2>
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
              <h2 style={headerStyle}>Correct Answers</h2>
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
                {showAllAnswers ? 'Show less answers' : 'Show more answers'}
              </Button>
            )}
          </div>
          <Divider />
          <div className="distractors-section">
            <div style={headerContainerStyle}>
              <h2 style={headerStyle}>Distractors</h2>
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

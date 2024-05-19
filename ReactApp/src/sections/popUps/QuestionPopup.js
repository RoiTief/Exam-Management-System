import PropTypes from 'prop-types';
import { overlayStyle, popupStyle } from './popup-style';
import { useEffect, useState } from 'react';
import { httpsMethod, serverPath, requestServer, TOKEN_FIELD_NAME } from 'src/utils/rest-api-call';
import { SvgIcon, ListItemText, ListItem, Divider, Button } from '@mui/material';
import chevronDoubleDownIcon from '@heroicons/react/20/solid/esm/ChevronDoubleDownIcon';


export const Question = (props) => {
  const { isOpen, closePopup, question } = props;
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [showAllDistractors, setShowAllDistractors] = useState(false);

  const toggleAnswers = () => {
    setShowAllAnswers(!showAllAnswers);
  };

  const toggleDistractors = () => {
    setShowAllDistractors(!showAllDistractors);
  };

  return (
    isOpen && (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={popupStyle}>
          <button onClick={closePopup} className="close-button">X</button>
          <h1 className="popup-title">Meta Question</h1>
          <div className="question-section">
            <h2>Stem</h2>
            <p>{question.stem}</p>
          </div>
          <Divider />
          <div className="answers-section">
            <h2>Correct Answers</h2>
            <ul>
              {question.correctAnswers.slice(0, showAllAnswers ? question.correctAnswers.length : 2).map((answer, index) => (
                <li key={`correct-${index}`}>
                  <ListItem>
                    <ListItemText primary={answer.text} secondary={answer.explanation} />
                  </ListItem>
                </li>
              ))}
            </ul>
            {!showAllAnswers && question.correctAnswers.length > 2 && (
              <button onClick={toggleAnswers} className="show-more-button">Show more answers</button>
            )}
          </div>
          <Divider />
          <div className="distractors-section">
            <h2>Distractors</h2>
            <ul>
              {question.distractors.slice(0, showAllDistractors ? question.distractors.length : 2).map((distractor, index) => (
                <li key={`distractor-${index}`}>
                  <ListItem>
                    <ListItemText primary={distractor.text} secondary={distractor.explanation} />
                  </ListItem>
                </li>
              ))}
            </ul>
            {!showAllDistractors && question.distractors.length > 2 && (
              <Button onClick={toggleDistractors} className="show-more-button"
                      startIcon={(
                        <SvgIcon fontSize="small">
                          <chevronDoubleDownIcon />
                        </SvgIcon>
                      )}
              >Show more distractors</Button>
            )}
          </div>
          <Divider />
          <div className="keywords-section">
            <h2>Keywords</h2>
            <ul>
              {question.keywords.map((keyword, index) => (
                <li key={`keyword-${index}`}>{keyword}</li>
              ))}
            </ul>
          </div>
          {question.appendix && (
            <div className="appendix-section">
              <Divider />
              <h2>Appendix</h2>
              <h3>Title: {question.appendix.title}</h3>
              <h3>Tag: {question.appendix.tag}</h3>
              <p>{question.appendix.content}</p>
            </div>
          )}
        </div>
      </div>
    )
  );
};

Question.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

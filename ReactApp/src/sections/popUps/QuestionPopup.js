import PropTypes from 'prop-types';
import {overlayStyle, popupStyle} from './popup-style'
import { useEffect, useState } from 'react';
import {httpsMethod, serverPath, requestServer,TOKEN_FIELD_NAME} from 'src/utils/rest-api-call';



export const Question = (props) => {
  const { isOpen, closePopup, task } = props;
  const [showMore, setShowMore] = useState(false);
  const [answerValue, setAnswerValue] = useState('');
  const [error, setError] = useState('');

  const toggleShowAll = () => {
    setShowMore(!showMore);
  };

  const handleOptionChange = (event) => {
    setAnswerValue(event.target.value);
  };

  const handleTextInputChange = (event) => {
    setAnswerValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await requestServer(serverPath.FINISH_TASK, httpsMethod.POST,
        {"taskId": task.taskId,
          "response": answerValue});
      closePopup();
    } catch (err) {
      setError(err.message);
    }
  }



  return (
    (isOpen) ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={popupStyle}>
          {task.finished && (
            <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', textAlign: 'center', borderRadius: '5px', maxWidth: '300px', margin: '0 auto', marginBottom: '10px' }}>
              Task Finished!
            </div>
          )}
          <h1>{task.type}</h1>
          <div style={{ position: 'absolute', top: '10px', right: '50px', fontSize: 'smaller' }}>
            <h4>{`Task ID: ${task.taskId}`}</h4>
            <h4>{`Priority: ${task.priority}`}</h4>
          </div>
          <p>{task.description}</p>
          {!task.finished ? (
            <div>
              {task.options !== null ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {task.options.map((option, index) => (
                    <li key={index}>
                      <label>
                        <input type="radio" name="options" value={option} onChange={handleOptionChange}/>
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <input type="text"
                       style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                       value={answerValue} onChange={handleTextInputChange}
                       placeholder="Enter your answer..." />
              )}
              <ul></ul>
              <button onClick={handleSubmit}>Submit</button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          ): (
            <h4>{`your response was:  ${task.response}`}</h4>
          )}
          <p onClick={toggleShowAll}>{`need more information?`}</p>
          <ul>
            {Object.keys(task.properties).map((key) => (
              (showMore) ? (
                <li key={key}>
                  <strong>{key}:</strong> {task.properties[key]}
                </li>
              ) : "" ))}
          </ul>
        </div>
      </div>
    ) : ""
  );
};




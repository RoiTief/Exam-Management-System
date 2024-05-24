import React from 'react';

function AnswerSelection({ answers, onSelect }) {
  return (
    <div>
      <h3>Select an Answer</h3>
      {answers.map((answer, index) => (
        <button key={index} onClick={() => onSelect(answer)}>{answer.text}</button>
      ))}
    </div>
  );
}

export default AnswerSelection;

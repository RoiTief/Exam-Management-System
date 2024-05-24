import React from 'react';

function QuestionList({ questions }) {
  return (
    <div>
      <h2>Created Questions</h2>
      {questions.map((question, index) => (
        <div key={index}>
          <p>Stem: {question.stem}</p>
          {question.appendix && (
            <div>
              <h4>Appendix: {question.appendix.title}</h4>
              <p>{question.appendix.content}</p>
            </div>
          )}
          <p>Answer: {question.answer.text}</p>
          <p>Distractors: {question.distractors.map(d => d.text).join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default QuestionList;

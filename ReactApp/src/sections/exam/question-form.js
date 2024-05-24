import React, { useState } from 'react';
import StemSelection from './stem-selection';
import AnswerSelection from './answer-selection';
import DistractorSelection from './distractor-selection';

function QuestionForm({ metaQuestions, addQuestion, onClose }) {
  const [selectedMetaQuestion, setSelectedMetaQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedDistractors, setSelectedDistractors] = useState([]);

  const handleSaveQuestion = () => {
    addQuestion({
      stem: selectedMetaQuestion.stem,
      appendix: selectedMetaQuestion.appendix,
      answer: selectedAnswer,
      distractors: selectedDistractors
    });
    onClose();
  };

  return (
    <div>
      <h2>Create a Question</h2>
      <StemSelection metaQuestions={metaQuestions} onSelect={setSelectedMetaQuestion} />
      {selectedMetaQuestion && <AnswerSelection answers={selectedMetaQuestion.correctAnswers} onSelect={setSelectedAnswer} />}
      {selectedAnswer && <DistractorSelection distractors={selectedMetaQuestion.distractors} onSelect={setSelectedDistractors} />}
      <button onClick={handleSaveQuestion}>Save Question</button>
    </div>
  );
}

export default QuestionForm;

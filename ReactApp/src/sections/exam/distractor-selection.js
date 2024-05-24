import React, { useState } from 'react';

function DistractorSelection({ distractors, onSelect }) {
  const [selectedDistractors, setSelectedDistractors] = useState([]);

  const handleSelectDistractor = (distractor) => {
    const newSelectedDistractors = [...selectedDistractors, distractor];
    setSelectedDistractors(newSelectedDistractors);
    onSelect(newSelectedDistractors);
  };

  return (
    <div>
      <h3>Select Distractors</h3>
      {distractors.map((distractor, index) => (
        <button key={index} onClick={() => handleSelectDistractor(distractor)}>{distractor.text}</button>
      ))}
    </div>
  );
}

export default DistractorSelection;

import React from 'react';

function StemSelection({ metaQuestions, onSelect }) {
  const handleSelectStem = (metaQuestion) => {
    onSelect(metaQuestion);
  };

  const groupedStems = metaQuestions.reduce((acc, question) => {
    if (question.appendix) {
      const appendixIndex = acc.findIndex(item => item.title === question.appendix.title);
      if (appendixIndex !== -1) {
        acc[appendixIndex].stems.push(question);
      } else {
        acc.push({ ...question.appendix, stems: [question] });
      }
    } else {
      acc.push({ title: null, stems: [question] });
    }
    return acc;
  }, []);

  return (
    <div>
      <h3>Select a Stem</h3>
      {groupedStems.map((group, index) => (
        <div key={index}>
          {group.title ? (
            <>
              <h4>Appendix: {group.title}</h4>
              <p>{group.content}</p>
              {group.stems.map((metaQuestion, idx) => (
                <button key={idx} onClick={() => handleSelectStem(metaQuestion)}>{metaQuestion.stem}</button>
              ))}
            </>
          ) : (
            group.stems.map((metaQuestion, idx) => (
              <button key={idx} onClick={() => handleSelectStem(metaQuestion)}>{metaQuestion.stem}</button>
            ))
          )}
        </div>
      ))}
    </div>
  );
}

export default StemSelection;

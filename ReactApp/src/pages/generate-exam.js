import React, { useState, useEffect } from 'react';
import { httpsMethod, serverPath, requestServer } from 'src/utils/rest-api-call';
import QuestionForm from '/src/sections/exam/question-form';
import QuestionList from '/src/sections/exam/question-list';

const data = [
  {
    stem: 'S1',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key3']
  },
  {
    stem: 'S2',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "title1", tag: "tag", content: "appendix1 content"}
  },
  {
    stem: 'S3',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "title1", tag: "tag", content: "appendix2 content"}
  },
  {
    stem: 'S4',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key5'],
    appendix: {title: "title1", tag: "tag", content: "appendix1 content"}
  },
  {
    stem: 'S5',
    correctAnswers: [{text:'answer1', explanation: 'explanation1'},
      {text:'answer2', explanation: 'explanation2'}],
    distractors: [{text:'distractor1', explanation: 'explanation1'},
      {text:'distractor2', explanation: 'explanation2'}, {text:'distractor3', explanation: 'explanation3'}],
    keywords: ['key1', 'key2', 'key3']
  }
]

function App() {
  const [questions, setQuestions] = useState([]);
  const [metaQuestions, setMetaQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    async function fetchMetaQuestions() {
      try {
        // const response = await requestServer(serverPath.GET_ALL_META_QUESTIONS, httpsMethod.GET);
        // setMetaQuestions(response);
        setMetaQuestions(data)
      } catch (error) {
        console.error('Error fetching meta questions:', error);
      }
    }

    fetchMetaQuestions();
  }, []);

  const addQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  return (
    <div className="App">
      <button onClick={() => setCurrentQuestion({})}>+ Add Question</button>
      {currentQuestion && (
        <QuestionForm
          metaQuestions={metaQuestions}
          addQuestion={addQuestion}
          onClose={() => setCurrentQuestion(null)}
        />
      )}
      <QuestionList questions={questions} />
      <button onClick={() => console.log('Save Test')}>Save Test</button>
    </div>
  );
}

export default App;

// src/contexts/MetaQuestionContext.js
import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import BaseContext from 'src/contexts/base-context';

const HANDLERS = {
  ADD_META_QUESTION: 'ADD_META_QUESTION'
};

const initialState = {
  metaQuestions: []
};

const handlers = {
  [HANDLERS.ADD_META_QUESTION]: (state, action) => {
    const metaQuestion = action.payload;

    return {
      ...state,
      metaQuestions: [...state.metaQuestions, metaQuestion]
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const MetaQuestionContext = createContext({ undefined });

export const MetaQuestionProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const addSimpleMetaQuestion = async (stem, correctAnswers, distractors) => {
    const response = await BaseContext.request(serverPath.ADD_META_QUESTION, httpsMethod.POST, { stem, correctAnswers, distractors });
    dispatch({ type: HANDLERS.ADD_META_QUESTION, payload: response });
  };

  return (
    <MetaQuestionContext.Provider value={{ ...state, addSimpleMetaQuestion }}>
      {children}
    </MetaQuestionContext.Provider>
  );
};

MetaQuestionProvider.propTypes = {
  children: PropTypes.node
};

export const useMetaQuestionContext = () => useContext(MetaQuestionContext);

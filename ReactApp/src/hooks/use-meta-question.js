import { useContext } from 'react';
import { MetaQuestionContext } from 'src/contexts/questions-context';

export const useMetaQuestion = () => useContext(MetaQuestionContext);

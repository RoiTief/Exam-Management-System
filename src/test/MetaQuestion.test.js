const MetaQuestion = require("../main/business/MetaQuestions/MetaQuestion");

describe('Meta-Question tests', () => {
  let metaQuestion;

  beforeEach(() => {
    metaQuestion = new MetaQuestion({
      stem: 'What is the capital of France?',
      answers: [
        { id: 1, answer: 'Paris', explanation: 'Paris is the capital of France.' },
        { id: 2, answer: 'London', explanation: 'London is the capital of the United Kingdom.' },
      ],
      distractors: [
        { id: 1, distractor: 'Berlin', explanation: 'Berlin is the capital of Germany.' },
        { id: 2, distractor: 'Madrid', explanation: 'Madrid is the capital of Spain.' },
      ],
      appendix: 'This is an appendix for the meta-question.',
      keywords: ['geography', 'capital', 'france'],
    });
  });
  
  test('removeAnswer removes an answer', async () => {
    const answerId = metaQuestion.getAnswers()[0].id;
    await metaQuestion.removeAnswer(answerId);
    expect(metaQuestion.getAnswers()).not.toContainEqual(
      expect.objectContaining({ id: answerId })
    );
  });

  test('addDistractor adds a new distractor', async () => {
    await metaQuestion.addDistractor({ distractor: 'Tokyo', explanation: 'Tokyo is the capital of Japan.' });
    expect(metaQuestion.getDiversions()).toContainEqual({
      id: expect.any(Number),
      distractor: 'Tokyo',
      explanation: 'Tokyo is the capital of Japan.',
    });
  });

  test('removeDistractor removes a distractor', async () => {
    const distractorId = metaQuestion.getDiversions()[0].id;
    await metaQuestion.removeDistractor(distractorId);
    expect(metaQuestion.getDiversions()).not.toContainEqual(
      expect.objectContaining({ id: distractorId })
    );
  });

  test('addKeyword adds a new keyword', async () => {
    await metaQuestion.addKeyword('politics');
    expect(metaQuestion.keywords).toContain('politics');
  });

  test('removeKeyword removes a keyword', async () => {
    await metaQuestion.removeKeyword('geography');
    expect(metaQuestion.keywords).not.toContain('geography');
  });

  test('editAnswer updates an answer', async () => {
    const answerId = metaQuestion.getAnswers()[0].id;
    await metaQuestion.editAnswer({ id: answerId, answer: 'New Answer', explanation: 'New Explanation' });
    const updatedAnswer = metaQuestion.getAnswers().find(a => a.id === answerId);
    expect(updatedAnswer).toEqual({
      id: answerId,
      answer: 'New Answer',
      explanation: 'New Explanation',
    });
  });

  test('editDistractor updates a distractor', async () => {
    const distractorId = metaQuestion.getDiversions()[0].id;
    await metaQuestion.editDistractor({ id: distractorId, distractor: 'New Distractor', explanation: 'New Explanation' });
    const updatedDistractor = metaQuestion.getDiversions().find(d => d.id === distractorId);
    expect(updatedDistractor).toEqual({
      id: distractorId,
      distractor: 'New Distractor',
      explanation: 'New Explanation',
    });
  });

  
  test('addAnswer adds a new answer', async () => {
    await metaQuestion.addAnswer({ answer: 'Washington, D.C.', explanation: 'Washington, D.C. is the capital of the United States.' });
    expect(metaQuestion.getAnswers()).toContainEqual({
      id: expect.any(Number),
      answer: 'Washington, D.C.',
      explanation: 'Washington, D.C. is the capital of the United States.',
    });
  });

  
});
const initSequelize = require("../../main/DAL/Sequelize");
const { PK_NOT_EXISTS, PK_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS } = require("../../main/EMSError");
const testDbConfig = require("./TestConfig");
const MetaQuestionRepository = require("../../main/DAL/MetaQuestion/MetaQuestionRepository");
const {ANSWER_TYPES, META_QUESTION_TYPES} = require("../../main/Enums");

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

const testMQData ={
    metaQuestion: { stem: 'Test stem', questionType: META_QUESTION_TYPES.SIMPLE },
    answers: [
        {
            content: 'answer1 content',
            tag: ANSWER_TYPES.KEY,
            explanation: 'answer1 explanation',
        },
        {
            content: 'answer2 content',
            tag: ANSWER_TYPES.DISTRACTOR,
        }
    ],
    keywords: [ 'keyword1', 'keyword2'],
}

const moreKeywords = [ 'keyword2', 'keyword3', 'keyword4', 'keyword5' ];

describe('MetaQuestionRepository happy path tests', () => {
    let sequelize;
    let MetaQuestion;
    let Answer;
    let Keyword;
    let metaQuestionRepository;

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        metaQuestionRepository = await new MetaQuestionRepository(sequelize);
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('add a meta-question to the database', async () => {
        const addedQuestion = await metaQuestionRepository.addMetaQuestion(testMQData.metaQuestion, testMQData.answers, testMQData.keywords);

        // assert correctness of question
        expect(addedQuestion).not.toBeNull();
        expect(addedQuestion.id).toBe(1);
        expect(addedQuestion.stem).toBe(testMQData.metaQuestion.stem);

        // assert correctness of answers
        expect(addedQuestion.answers).not.toBeNull();
        expect(addedQuestion.answers.every(a => a.metaQuestionId === addedQuestion.id)).toBeTruthy();
        expect(addedQuestion.answers.map(answer => ({
            content: answer.content,
            tag: answer.tag,
            explanation: answer.explanation,
        })).sort((a, b) => a.content.localeCompare(b.content)))
            .toStrictEqual(
                testMQData.answers.map(answer => ({
                    content: answer.content,
                    tag: answer.tag,
                    explanation: answer.hasOwnProperty('explanation') ? answer.explanation : null,
                })).sort((a, b) => a.content.localeCompare(b.content))
            );

        // assert correctness of keywords
        expect(addedQuestion.keywords).not.toBeNull();
        expect(addedQuestion.keywords.every(k => k.MetaQuestionKeyword.MetaQuestionId === addedQuestion.id)).toBeTruthy();
        expect(addedQuestion.keywords.map(k => k.word).sort()).toStrictEqual(testMQData.keywords.sort());
    });

    test('add more keywords to the meta-question', async () => {
        const question = await metaQuestionRepository.addKeywordsToQuestion(1, moreKeywords);

        // assert
        expect(question).not.toBeNull();
        expect(question.keywords.map(k => k.word).sort()).toStrictEqual(testMQData.keywords.concat(moreKeywords).unique().sort());

    });
});

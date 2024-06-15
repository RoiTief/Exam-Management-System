const initSequelize = require("../../main/DAL/Sequelize");
const { EMSError, MQ_PROCESS_ERROR_CODES} = require("../../main/EMSError");
const testDbConfig = require("./TestConfig");
const MetaQuestionRepository = require("../../main/DAL/MetaQuestion/MetaQuestionRepository");
const {ANSWER_TYPES, META_QUESTION_TYPES} = require("../../main/Enums");
const defineAnswerModel = require("../../main/DAL/MetaQuestion/Answer");

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
    metaQuestion: { stem: 'Test stem' },
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

const testAppendixData = {
    appendix: {
        tag: 'tag1',
        title: 'title1',
        content: 'content1'
    },
    keywords: [ 'keyword1', 'keyword2'],
    metaQuestions: [
        { stem: 'stem1' },
        { stem: 'stem2' },
    ]
}

const moreKeywords = [ 'keyword2', 'keyword3', 'keyword4', 'keyword5' ];

const moreAnswers = [
    {
        content: 'answer3 content',
        tag: ANSWER_TYPES.DISTRACTOR,
        explanation: 'answer3 explanation',
    },
    {
        content: 'answer4 content',
        tag: ANSWER_TYPES.KEY,
    }
];

describe('MetaQuestionRepository happy path tests', () => {
    let sequelize;
    let metaQuestionRepository;
    let Answer;

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        metaQuestionRepository = await new MetaQuestionRepository(sequelize);
        await sequelize.sync({force: true});
        Answer = await defineAnswerModel(sequelize);
    });

    beforeEach(async () => {
       await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('add a meta-question to the database', async () => {
        const addedQuestion = await metaQuestionRepository.addMetaQuestion(testMQData.metaQuestion, structuredClone(testMQData.answers), testMQData.keywords);

        // assert correctness of question
        expect(addedQuestion).not.toBeNull();
        expect(addedQuestion.id).toBe(1);
        expect(addedQuestion.stem).toBe(testMQData.metaQuestion.stem);
        expect(addedQuestion.appendixTag).toBeNull();

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
        let addedQuestion = await metaQuestionRepository.addMetaQuestion(testMQData.metaQuestion, structuredClone(testMQData.answers), testMQData.keywords);
        addedQuestion = await metaQuestionRepository.addKeywordsToQuestion(addedQuestion.id, moreKeywords);

        // assert
        expect(addedQuestion).not.toBeNull();
        expect(addedQuestion.keywords.map(k => k.word).sort()).toStrictEqual(testMQData.keywords.concat(moreKeywords).unique().sort());

    });

    test('add more answers to the meta-question', async () => {
        let addedQuestion = await metaQuestionRepository.addMetaQuestion(testMQData.metaQuestion, structuredClone(testMQData.answers), testMQData.keywords);
        addedQuestion = await metaQuestionRepository.addAnswersToQuestion(addedQuestion.id, structuredClone(moreAnswers));

        // assert
        expect(addedQuestion).not.toBeNull();
        expect(addedQuestion.answers.map(a => ({
            content: a.content,
            tag: a.tag,
            ...(a.explanation && {explanation: a.explanation})
        })).sort((a, b) => a.content.localeCompare(b.content)))
            .toStrictEqual(testMQData.answers.concat(moreAnswers)
                .sort((a, b) =>
                    a.content.localeCompare(b.content)
                ));

    });

    test('add an appendix to the database', async () => {
        const addedAppendix = await metaQuestionRepository.addAppendix(structuredClone(testAppendixData.appendix), structuredClone(testAppendixData.keywords));

        // assert correctness of question
        expect(addedAppendix).not.toBeNull();
        expect(addedAppendix.tag).toBe(testAppendixData.appendix.tag);
        expect(addedAppendix.title).toBe(testAppendixData.appendix.title);
        expect(addedAppendix.content).toBe(testAppendixData.appendix.content);

        // assert correctness of keywords
        expect(addedAppendix.keywords).not.toBeNull();
        expect(addedAppendix.keywords.every(k => k.AppendixKeyword.AppendixTag === addedAppendix.tag)).toBeTruthy();
        expect(addedAppendix.keywords.map(k => k.word).sort()).toStrictEqual(testAppendixData.keywords.sort());
    });

    test('add more keywords to the appendix', async () => {
        let addedAppendix = await metaQuestionRepository.addAppendix(structuredClone(testAppendixData.appendix), structuredClone(testAppendixData.keywords));
        addedAppendix = await metaQuestionRepository.addKeywordsToAppendix(addedAppendix.tag, structuredClone(moreKeywords));

        // assert
        expect(addedAppendix).not.toBeNull();
        expect(addedAppendix.keywords.map(k => k.word).sort()).toStrictEqual(testMQData.keywords.concat(moreKeywords).unique().sort());
    });

    test('add more meta-questions to the appendix', async () => {
        const addedAppendix = await metaQuestionRepository.addAppendix(structuredClone(testAppendixData.appendix), []);

        expect(addedAppendix.metaQuestions).toStrictEqual([]);

        const metaQuestionsToAdd = structuredClone(testAppendixData.metaQuestions);
        metaQuestionsToAdd.forEach(q => q.appendixTag = addedAppendix.tag);
        await Promise.all(metaQuestionsToAdd.map(q => metaQuestionRepository.addMetaQuestion(q, [], [])));

        // update the appendix after
        await addedAppendix.reload();

        // assert
        expect(addedAppendix.metaQuestions
            .map(q => ({stem: q.stem, appendixTag: q.appendixTag}))
            .sort((a, b) => a.stem.localeCompare(b.stem))
        )
            .toStrictEqual(testAppendixData.metaQuestions
                .map(q => ({...q, appendixTag: addedAppendix.tag}))
                .sort((a, b) => a.stem.localeCompare(b.stem))
            );
    });

    test('connect between an already added MQ to Appendix', async () => {
        const addedQuestion = await metaQuestionRepository.addMetaQuestion(testMQData.metaQuestion, structuredClone(testMQData.answers), testMQData.keywords);
        const addedAppendix = await metaQuestionRepository.addAppendix(structuredClone(testAppendixData.appendix), []);

        addedQuestion.appendixTag = addedAppendix.tag;
        await addedQuestion.save();
        await addedAppendix.reload();

        expect(addedAppendix.metaQuestions.length).toBe(1);
        expect(addedAppendix.metaQuestions[0].stem).toBe(addedQuestion.stem);
    });

    test('delete appendix', async () => {
        const addedAppendix = await metaQuestionRepository.addAppendix(structuredClone(testAppendixData.appendix), []);

        // assert appendix exists
        try {
            await metaQuestionRepository.getAppendix(addedAppendix.tag);
        } catch (e) {
            expect(false).toBeTruthy();
        }

        await metaQuestionRepository.deleteAppendix(addedAppendix.tag);

        // assert appendix deleted
        try {
            await metaQuestionRepository.getAppendix(addedAppendix.tag);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(MQ_PROCESS_ERROR_CODES.APPENDIX_TAG_DOESNT_EXIST);
        }
    });

    test('delete meta-question', async () => {
        const addedQuestion = await metaQuestionRepository.addMetaQuestion(structuredClone(testMQData.metaQuestion), [], []);

        // assert appendix exists
        try {
            await metaQuestionRepository.getMetaQuestion(addedQuestion.id);
        } catch (e) {
            expect(false).toBeTruthy();
        }

        await metaQuestionRepository.deleteMetaQuestion(addedQuestion.id);

        // assert appendix deleted
        try {
            await metaQuestionRepository.getMetaQuestion(addedQuestion.id);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(MQ_PROCESS_ERROR_CODES.MQ_ID_DOESNT_EXIST);
        }
    });

    test('Make sure answers are deleted with MetaQuestions', async () => {
        const addedQuestion = await metaQuestionRepository.addMetaQuestion(structuredClone(testMQData.metaQuestion), structuredClone(testMQData.answers), []);
        let addedAnswers = await Answer.findAll();

        expect(addedAnswers.length).not.toBe(0);

        await metaQuestionRepository.deleteMetaQuestion(addedQuestion.id);
        addedAnswers = await Answer.findAll();

        expect(addedAnswers.length).toBe(0);
    });
});

describe('MetaQuestionRepository fail tests', () => {
    let sequelize;
    let metaQuestionRepository;

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        metaQuestionRepository = await new MetaQuestionRepository(sequelize);
        await sequelize.sync({force: true});
    });

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('Add MetaQuestion with invalid appendixTag', async () => {
       const mqToAdd = structuredClone(testMQData.metaQuestion);
       mqToAdd.appendixTag = 'someTag';

       try {
           await metaQuestionRepository.addMetaQuestion(mqToAdd, [], []);
           expect(false).toBeTruthy();
       } catch (e) {
           expect(e instanceof EMSError).toBeTruthy();
           expect(e.errorCode).toBe(MQ_PROCESS_ERROR_CODES.APPENDIX_TAG_DOESNT_EXIST);
       }
    });
});


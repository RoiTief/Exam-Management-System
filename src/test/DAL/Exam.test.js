const initSequelize = require("../../main/DAL/Sequelize");
const testDbConfig = require("./TestConfig");
const ExamRepository = require("../../main/DAL/Exam/ExamRepository");
const defineAnswerModel = require("../../main/DAL/MetaQuestion/Answer");
const defineMetaQuestionModel = require("../../main/DAL/MetaQuestion/MetaQuestion");
const { ANSWER_TYPES } = require("../../main/Enums");
const compDalObjs = (obj1, obj2) => obj1.id > obj2.id;

const TIMEOUT = 60000
const testExamData = {
    exam: {examReason: 'Exam title', numVersions:1 },
    metaQuestions: [
        { stem: 'Question 1?' },
        { stem: 'Question 2?' }
    ],
    answers: [
        {
            content: 'Answer 1',
            tag: ANSWER_TYPES.KEY,
            explanation: 'Explanation 1',
            version:0
        },
        {
            content: 'Answer 2',
            tag: ANSWER_TYPES.DISTRACTOR,
            explanation: 'Explanation 2',
            numVersion:0
        }
    ]
};

describe('ExamRepository happy path tests', () => {
    let sequelize;
    let examRepository;
    let metaQuestionM
    let answerM
    let questions
    let answers

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        examRepository = new ExamRepository(sequelize);
        await sequelize.sync({ force: true });
        metaQuestionM = await defineMetaQuestionModel(sequelize);
        answerM = await defineAnswerModel(sequelize);
    });

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        questions = await Promise.all(testExamData.metaQuestions.map(q => metaQuestionM.create(q)))
        answers = await Promise.all(testExamData.answers.map(a => answerM.create({...a, metaQuestionId: questions[0].id})))
        jest.setTimeout(TIMEOUT);
        
    })
    
        
    

    afterAll(async () => {
        await sequelize.close();
    });

    test('create a new exam', async () => {
        const exam = await examRepository.createExam(testExamData.exam);

        expect(exam).toBeDefined();
        expect(exam.id).toBeDefined()
    });

    test('add a question to the exam', async () => {
        const createdExam = await examRepository.createExam(testExamData.exam);
        const createdQuestion = await examRepository.addQuestionToExam(createdExam.id, questions[0].id,{ordinal:0}, answers.map((answer,index) => ({id:answer.id, ordinal: index, version: 0})));

        expect(createdQuestion).not.toBeNull();
        expect(createdQuestion.examId).toBe(createdExam.id);
        expect(createdQuestion.answers
            .sort(compDalObjs).
            map(a=> ({id:a.id, content: a.content, tag: a.tag, explanation: a.explanation, ordinal: a.QuestionAnswer.ordinal}))).
            toStrictEqual(answers.
                sort(compDalObjs).
                map((a,index)=>({id:a.id, content: a.content, tag: a.tag, explanation: a.explanation, ordinal:index})))
    });


    test('retrieve an exam by ID', async () => {
        const createdExam = await examRepository.createExam(testExamData.exam);
        const createdQuestion = await examRepository.addQuestionToExam(createdExam.id, questions[0].id,{ordinal:0}, answers.map((answer,index) => ({id:answer.id, ordinal: index, version: 0})));
        const retrievedExam = await examRepository.getExamById(createdExam.id);


        expect(retrievedExam).not.toBeNull();
        expect(retrievedExam.id).toBe(createdExam.id);
        expect(retrievedExam.questions).toBeDefined()
        expect(retrievedExam.questions.map(q=>q.metaQuestion)).toBeDefined();
        expect(retrievedExam.questions.map(q=>q.answers)).toBeDefined();
    });
});

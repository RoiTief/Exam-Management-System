const { USER_TYPES, ANSWER_TYPES } = require("../../main/Enums");
const initSequelize = require("../../main/DAL/Sequelize");
const testDbConfig = require("../DAL/TestConfig");
const ExamRepository = require("../../main/DAL/Exam/ExamRepository");
const MetaQuestionRepository = require("../../main/DAL/MetaQuestion/MetaQuestionRepository");
const ExamController = require("../../main/business/ExamManager/ExamController");
const MetaQuestion = require("../../main/business/MetaQuestions/MetaQuestion");
const { EXAM_CONSTANTS } = require("../../main/constants");
const MetaQuestionController = require("../../main/business/MetaQuestions/MetaQuestionController");

const EXAM_NUM = 10
const MQ_NUM = 10 
const ANSWERS_IN_META_QUESTION = 10

const callingUser = {
    username: 'name',
    type: USER_TYPES.LECTURER
}
const examDataArr = Array.from({ length: EXAM_NUM }, (_, i) => ({
    callingUser,
    examReason: `title ${i}`,
    numVersions: 1, 
    examReason: `reason ${i}`
}));
const mqDataArr = Array.from({ length: MQ_NUM }, (_, i) => ({
    stem: `stem ${i}`,
    answers: Array.from({ length: ANSWERS_IN_META_QUESTION }, (_, j) => ({ content: `content ${i}`, tag: j > 4 ? ANSWER_TYPES.DISTRACTOR : ANSWER_TYPES.KEY, explanation: `Explanation ${i}` }))
}));

const emptyArr = []

async function createExamWithQuestions(examController, examData, addQuestionToExamRawDataArr) {
    const exam = await examController.createExam(examData)
    const addQDataArr = addQuestionToExamRawDataArr.map(data => ({ ...data, examId: exam.getId() }))
    await Promise.all(addQDataArr.map(addQuestionData => examController.addQuestionToExam(addQuestionData)))
    return exam.getId()
}


describe('Happy-Path ExamController tests', () => {
    let examController;
    let sequelize;
    let examRepo;
    let mqRepo;
    let dalMq;
    let dalMqs;
    let addQData = {
        callingUser,
        examId: undefined, // will be set at runtime
        mqId: undefined, // will be set at runtime
        questionData: { ordinal: 5 },
        answersData: undefined // will be set at runtime

    }
    let addAutoQDataArr = mqDataArr.map(mqData => ({
        callingUser,
        examId: undefined, // will be set at runtime
        mqId: undefined // will be set at runtime
    }));

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        examRepo = new ExamRepository(sequelize);
        mqRepo = new MetaQuestionRepository(sequelize)
        await sequelize.sync({ force: true }); // cleans db
    });

    beforeEach(async () => {
        await sequelize.sync({ force: true }); // cleans db
        dalMqs = await (Promise.all(mqDataArr.map(mqData => mqRepo.addMetaQuestion(mqData, mqData.answers, emptyArr))))
        dalMq = dalMqs[0]
        addQData.mqId = dalMq.id
        addQData.answersData = [{ id: dalMq.answers[0].id, ordinal: 1, version: 1 }]
        addAutoQDataArr = addAutoQDataArr.map(data => ({ ...data, mqId: dalMq.id }))


        examController = new ExamController(new MetaQuestionController(mqRepo), examRepo);
    })

    test('create exam', async () => {
        try {
            const exam = await examController.createExam(examDataArr[0])
            expect(exam.getExamReason()).toBe(examDataArr[0].examReason);
        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy()
        }
    })

    test('add question to exam', async () => {
        try {
            const exam = await examController.createExam(examDataArr[0])
            addQData.examId = exam.getId()
            const question = await examController.addQuestionToExam(addQData)
            expect(question.getOrdinal()).toBe(addQData.questionData.ordinal);
            question.getAnswers().forEach((answer) => {
                expect(answer.getOrdinal()).toBe(addQData.answersData[0].ordinal);
            })
        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy()
        }
    })

    test('Get all exams', async () => {
        try {
            await createExamWithQuestions(examController, examDataArr[0], [addQData])
            const loadedExams = await examController.getAllExams({ callingUser })
            expect(loadedExams.length).toBeGreaterThan(0);


        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy()
        }
    })

    test('Add automatic question', async () => {
        try {
            let exam = await examController.createExam(examDataArr[0])
            addAutoQDataArr = addAutoQDataArr.map(data => ({ ...data, examId: exam.getId() }))
            exam = await examController.getExam({ callingUser, id: exam.getId() })
            expect(exam.getQuestions().length).toBe(0);
            
            await Promise.all(addAutoQDataArr.map(data => examController.addAutomaticQuestionToExam(data)))

            exam = await examController.getExam({ callingUser, id: exam.getId() })
            expect(exam.getQuestions().length).toBe(MQ_NUM);
            exam.getQuestions().forEach((question) => {
                expect(dalMqs.map(dmq=>dmq.id).includes(question.getMetaQuestion().getId()))
            })

            // check answer ordinal is 1-(EXAM_CONSTANTS.MAX_DISTRACTOR_NUMBER + 1)
            exam.getQuestions().forEach(q=>expect(q.getAnswers().map(a=>a.getOrdinal()).sort()).toEqual(Array.from({ length: EXAM_CONSTANTS.NUMBER_OF_QUESTIONS }, (_, i) => i + 1)))

            // check number of keys keys and distractors
            exam.getQuestions().forEach(q=>expect(q.getAnswers().map(a=>a.getTag()).filter(t=> t === ANSWER_TYPES.KEY).length).toBe(1))
            exam.getQuestions().forEach(q=>expect(q.getAnswers().map(a=>a.getTag()).filter(t=> t === ANSWER_TYPES.DISTRACTOR).length).toBe(EXAM_CONSTANTS.MAX_DISTRACTOR_NUMBER))
        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy()
        }
    })

});

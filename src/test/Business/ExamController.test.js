const { USER_TYPES, ANSWER_TYPES } = require("../../main/Enums");
const initSequelize = require("../../main/DAL/Sequelize");
const { EMSError, MQ_PROCESS_ERROR_CODES } = require("../../main/EMSError");
const testDbConfig = require("../DAL/TestConfig");
const ExamRepository = require("../../main/DAL/Exam/ExamRepository");
const MetaQuestionRepository = require("../../main/DAL/MetaQuestion/MetaQuestionRepository");
const ExamController = require("../../main/business/ExamManager/ExamController");

const callingUser = {
    username: 'name',
    type: USER_TYPES.LECTURER
}
const examDataArr = Array.from({ length: 10 }, (_, i) => ({
    callingUser,
    title: `title ${i}`
}));
const mqDataArr = Array.from({ length: 10 }, (_, i) => ({
    stem: `stem ${i}`,
     answers: [{ content: `content ${i}`, tag: i > 4 ? ANSWER_TYPES.DISTRACTOR :ANSWER_TYPES.KEY, explanation: `Explanation ${i}` }]
}));

const emptyArr = []

async function createExamWithQuestions(examController, examData, addQuestionToExamRawDataArr) {
    const exam = await examController.createExam(examData)
    const addQuestionToExamDataArr = addQuestionToExamRawDataArr.map(data=> ({...data, examId : exam.getId()}))
    await Promise.all(addQuestionToExamDataArr.map(addQuestionData => examController.addQuestionToExam(addQuestionData)))
    return exam.getId()
}

class MetaQuestionControllerMock {

}

describe('Happy-Path ExamController tests', () => {
    let examController;
    let sequelize;
    let examRepo;
    let mqRepo;
    let dalMq;
    let addQuestionToExamData = {
        callingUser,
        examId: undefined, // will be set at runtime
        mQId: undefined, // will be set at runtime
        questionData: { ordinal: 5 },
        answersData: undefined // will be set at runtime

    }

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        examRepo = new ExamRepository(sequelize);
        mqRepo = new MetaQuestionRepository(sequelize)
        await sequelize.sync({ force: true }); // cleans db
    });

    beforeEach(async () => {
        examController = new ExamController(new MetaQuestionControllerMock(), examRepo);
        await sequelize.sync({ force: true }); // cleans db
        dalMq = await mqRepo.addMetaQuestion(mqDataArr[0], mqDataArr[0].answers, emptyArr)
        addQuestionToExamData.mQId = dalMq.id
        addQuestionToExamData.answersData = [{ id: dalMq.answers[0].id, ordinal: 1, permutation: 1 }]
    })

    test('create exam', async () => {
        try {
            const exam = await examController.createExam(examDataArr[0])
            expect(exam.getTitle()).toBe(examDataArr[0].title);
        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy()
        }
    })

    test('add question to exam', async () => {
        try {
            const exam = await examController.createExam(examDataArr[0])
            addQuestionToExamData.examId = exam.getId()
            const question = await examController.addQuestionToExam(addQuestionToExamData)
            expect(question.getOrdinal()).toBe(addQuestionToExamData.questionData.ordinal);
            question.getAnswers().forEach((answer) => {
                expect(answer.getOrdinal()).toBe(addQuestionToExamData.answersData[0].ordinal);
            })
        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy()
        }
    })

    test('Get all exams', async () => {
        try {
            await createExamWithQuestions(examController, examDataArr[0], [addQuestionToExamData])
            // const exam = await examController.createExam(examDataArr[0])
            // addQuestionToExamData.examId = exam.getId()
            // await examController.addQuestionToExam(addQuestionToExamData)
            const loadedExams = await examController.getAllExams({ callingUser })
            console.log(loadedExams)
            console.log(loadedExams.length)
            expect(loadedExams.length).toBeGreaterThan(0);
            

        } catch (e) {
            console.log(e)
            expect(false).toBeTruthy()
        }
    })


    // test('edit appendix', async () => {
    //     await mqController.createAppendix({
    //         ...appendixData,
    //         callingUser: lecturerCallingDetails
    //     })

    //     // edit keywords only
    //     const editData = {
    //         callingUser: lecturerCallingDetails,
    //         tag: appendixData.tag,
    //         keywords: [],
    //     }
    //     await mqController.editAppendix(editData);
    //     let updatedAppendix = await mqController.getAppendix(editData.tag);
    //     expect(updatedAppendix.getTag()).toBe(appendixData.tag);
    //     expect(updatedAppendix.getTitle()).toBe(appendixData.title);
    //     expect(updatedAppendix.getContent()).toBe(appendixData.content);
    //     expect(updatedAppendix.getKeywords()).toStrictEqual(editData.keywords);

    //     // edit title
    //     editData.title = 'new title';
    //     await mqController.editAppendix(editData);
    //     updatedAppendix = await mqController.getAppendix(editData.tag);
    //     expect(updatedAppendix.getTag()).toBe(appendixData.tag);
    //     expect(updatedAppendix.getTitle()).toBe(editData.title);
    //     expect(updatedAppendix.getContent()).toBe(appendixData.content);
    //     expect(updatedAppendix.getKeywords()).toStrictEqual(editData.keywords);

    //     // edit content
    //     editData.content = 'new content';
    //     await mqController.editAppendix(editData);
    //     updatedAppendix = await mqController.getAppendix(editData.tag);
    //     expect(updatedAppendix.getTag()).toBe(appendixData.tag);
    //     expect(updatedAppendix.getTitle()).toBe(editData.title);
    //     expect(updatedAppendix.getContent()).toBe(editData.content);
    //     expect(updatedAppendix.getKeywords()).toStrictEqual(editData.keywords);
    // })

    // afterAll(async () => {
    //     await sequelize.close();
    // });

    // test('add simple MQ', async () => {
    //     try {
    //         await mqController.getMetaQuestion(1);
    //         expect(false).toBeTruthy();
    //     } catch (e) {
    //         expect(e instanceof EMSError).toBeTruthy();
    //         expect(e.errorCode).toBe(MQ_PROCESS_ERROR_CODES.MQ_ID_DOESNT_EXIST)
    //     }

    //     await mqController.createMetaQuestion({
    //         ...(structuredClone(simpleMQData)),
    //         callingUser: lecturerCallingDetails
    //     })
    //     let mq;
    //     try {
    //         mq = await mqController.getMetaQuestion(1);
    //     } catch (e) {
    //         expect(false).toBeTruthy();
    //     }
    //     expect(mq.getStem()).toBe(simpleMQData.stem);
    //     expect(mq.getKeywords().sort())
    //         .toStrictEqual(appendixData.keywords.sort());
    //     expect(mq.getAnswers()
    //         .map(a => ({content: a.getContent(), tag: a.getTag(), ...(a.getExplanation() && {explanation: a.getExplanation()})}))
    //         .sort((a,b) => a.content.localeCompare(b.content)))
    //         .toStrictEqual(simpleMQData.answers.sort((a, b) => a.content.localeCompare(b.content)));
    //     expect(mq.getKeys()
    //         .map(k => ({content: k.getContent(), tag: k.getTag(), ...(k.getExplanation() && {explanation: k.getExplanation()})}))
    //         .sort((a,b) => a.content.localeCompare(b.content)))
    //         .toStrictEqual(simpleMQData.answers
    //             .filter(a => a.tag === ANSWER_TYPES.KEY)
    //             .sort((a, b) => a.content.localeCompare(b.content)));
    //     expect(mq.getDistractors()
    //         .map(d => ({content: d.getContent(), tag: d.getTag(), ...(d.getExplanation() && {explanation: d.getExplanation()})}))
    //         .sort((a,b) => a.content.localeCompare(b.content)))
    //         .toStrictEqual(simpleMQData.answers
    //             .filter(a => a.tag === ANSWER_TYPES.DISTRACTOR)
    //             .sort((a, b) => a.content.localeCompare(b.content)));
    //     if (mq.getAppendixTag())
    //         expect(false).toBeTruthy();
    // })
});

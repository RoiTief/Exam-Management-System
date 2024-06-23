const {USER_TYPES, ANSWER_TYPES} = require("../../main/Enums");
const initSequelize = require("../../main/DAL/Sequelize");
const {EMSError, MQ_PROCESS_ERROR_CODES} = require("../../main/EMSError");
const MetaQuestionRepository = require("../../main/DAL/MetaQuestion/MetaQuestionRepository");
const MetaQuestionController = require("../../main/business/MetaQuestions/MetaQuestionController");

class UserControllerMock {
    getAllStaff(){
        return [];
    }
}

class TaskControllerMock {
    addTask(data){
    }
}

const dbConfig = {
    database: 'mq_controller_test',
    username: 'user_t',
    password: '123',
    host: '164.90.223.94',
    port: '5432',
    dialect: 'postgres',
    logging: false
}

const adminCallingDetails ={
    username : 'Admin',
    type : USER_TYPES.ADMIN
}

const lecturerCallingDetails ={
    username : 'lecturer',
    type : USER_TYPES.LECTURER
}

const taCallingDetails ={
    username : 'TA',
    type : USER_TYPES.TA
}

const appendixData = {
    keywords: ['w1', 'w2'],
    title: '',
    tag: 'tag1',
    content: 'content1'
}

const simpleMQData = {
    stem: 'stem',
    keywords: ['w1', 'w2'],
    answers: [
        {
            content: 'key1',
            tag: ANSWER_TYPES.KEY
        },
        {
            content: 'distractor1',
            tag: ANSWER_TYPES.DISTRACTOR
        }
    ],
}

describe('Happy-Path MetaQuestionController tests', () => {
    let mqController;
    let sequelize;
    let mqRepo;

    beforeAll(async () => {
        sequelize = initSequelize(dbConfig);
        await sequelize.authenticate();
        mqRepo = new MetaQuestionRepository(sequelize);
        await sequelize.sync({force: true}); // cleans the 'Users' table
    });

    beforeEach(async () => {
        mqController = await new MetaQuestionController(mqRepo, new TaskControllerMock(), new UserControllerMock());
        await sequelize.sync({force: true}); // cleans the 'Users' table
    })

    test('add appendix', async () => {
        try {
            await mqController.getAppendix(appendixData.tag);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(MQ_PROCESS_ERROR_CODES.APPENDIX_TAG_DOESNT_EXIST)
        }

        await mqController.createAppendix({
            ...appendixData,
            callingUser: lecturerCallingDetails
        })
        try {
            const appendix = await mqController.getAppendix(appendixData.tag);
            expect(appendix.getTag()).toBe(appendixData.tag);
            expect(appendix.getTitle()).toBe(appendixData.title);
            expect(appendix.getContent()).toBe(appendixData.content);
            expect(appendix.getKeywords().sort())
                .toStrictEqual(appendixData.keywords.sort());
        } catch (e) {
            expect(false).toBeTruthy();
        }
    })

    test('edit appendix', async () => {
        await mqController.createAppendix({
            ...appendixData,
            callingUser: lecturerCallingDetails
        })

        // edit keywords only
        const editData = {
            callingUser: lecturerCallingDetails,
            tag: appendixData.tag,
            keywords: [],
        }
        await mqController.editAppendix(editData);
        let updatedAppendix = await mqController.getAppendix(editData.tag);
        expect(updatedAppendix.getTag()).toBe(appendixData.tag);
        expect(updatedAppendix.getTitle()).toBe(appendixData.title);
        expect(updatedAppendix.getContent()).toBe(appendixData.content);
        expect(updatedAppendix.getKeywords()).toStrictEqual(editData.keywords);

        // edit title
        editData.title = 'new title';
        await mqController.editAppendix(editData);
        updatedAppendix = await mqController.getAppendix(editData.tag);
        expect(updatedAppendix.getTag()).toBe(appendixData.tag);
        expect(updatedAppendix.getTitle()).toBe(editData.title);
        expect(updatedAppendix.getContent()).toBe(appendixData.content);
        expect(updatedAppendix.getKeywords()).toStrictEqual(editData.keywords);

        // edit content
        editData.content = 'new content';
        await mqController.editAppendix(editData);
        updatedAppendix = await mqController.getAppendix(editData.tag);
        expect(updatedAppendix.getTag()).toBe(appendixData.tag);
        expect(updatedAppendix.getTitle()).toBe(editData.title);
        expect(updatedAppendix.getContent()).toBe(editData.content);
        expect(updatedAppendix.getKeywords()).toStrictEqual(editData.keywords);
    })

    afterAll(async () => {
        await sequelize.close();
    });

    test('add simple MQ', async () => {
        try {
            await mqController.getMetaQuestion(1);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(MQ_PROCESS_ERROR_CODES.MQ_ID_DOESNT_EXIST)
        }

        await mqController.createMetaQuestion({
            ...(structuredClone(simpleMQData)),
            callingUser: lecturerCallingDetails
        })
        let mq;
        try {
            mq = await mqController.getMetaQuestion(1);
        } catch (e) {
            expect(false).toBeTruthy();
        }
        expect(mq.getStem()).toBe(simpleMQData.stem);
        expect(mq.getKeywords().sort())
            .toStrictEqual(appendixData.keywords.sort());
        expect(mq.getAnswers()
            .map(a => ({content: a.getContent(), tag: a.getTag(), ...(a.getExplanation() && {explanation: a.getExplanation()})}))
            .sort((a,b) => a.content.localeCompare(b.content)))
            .toStrictEqual(simpleMQData.answers.sort((a, b) => a.content.localeCompare(b.content)));
        expect(mq.getKeys()
            .map(k => ({content: k.getContent(), tag: k.getTag(), ...(k.getExplanation() && {explanation: k.getExplanation()})}))
            .sort((a,b) => a.content.localeCompare(b.content)))
            .toStrictEqual(simpleMQData.answers
                .filter(a => a.tag === ANSWER_TYPES.KEY)
                .sort((a, b) => a.content.localeCompare(b.content)));
        expect(mq.getDistractors()
            .map(d => ({content: d.getContent(), tag: d.getTag(), ...(d.getExplanation() && {explanation: d.getExplanation()})}))
            .sort((a,b) => a.content.localeCompare(b.content)))
            .toStrictEqual(simpleMQData.answers
                .filter(a => a.tag === ANSWER_TYPES.DISTRACTOR)
                .sort((a, b) => a.content.localeCompare(b.content)));
        if (mq.getAppendixTag())
            expect(false).toBeTruthy();
    })
});
/*
describe('MetaQuestionController FAILURE tests', () => {
    let mqController;
    let sequelize;
    let mqRepo;

    beforeAll(async () => {
        sequelize = initSequelize(dbConfig);
        await sequelize.authenticate();
        mqRepo = new MetaQuestionRepository(sequelize);
        await sequelize.sync({force: true}); // cleans the 'Users' table
    });

    beforeEach(async () => {
        mqController = await new MetaQuestionController(mqRepo);
        await sequelize.sync({force: true}); // cleans the 'Users' table
    })

    afterAll(async () => {
        await sequelize.close();
    });
});
*/

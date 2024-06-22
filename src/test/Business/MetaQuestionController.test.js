const {USER_TYPES} = require("../../main/Enums");
const initSequelize = require("../../main/DAL/Sequelize");
const {EMSError, MQ_PROCESS_ERROR_CODES} = require("../../main/EMSError");
const Lecturer = require("../../main/business/UserManager/Lecturer");
const {DEFAULT_PASSWORD} = require("../../main/business/UserManager/User");
const MetaQuestionRepository = require("../../main/DAL/MetaQuestion/MetaQuestionRepository");
const MetaQuestionController = require("../../main/business/MetaQuestions/MetaQuestionController");

const dbConfig = {
    database: 'user_controller_test',
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
        mqController = await new MetaQuestionController(mqRepo);
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


const initSequelize = require("../../main/DAL/Sequelize");
const testDbConfig = require("./TestConfig");
const {USER_TYPES, ANSWER_TYPES} = require("../../main/Enums");
const {DEFAULT_PASSWORD} = require("../../main/business/UserManager/User");
const defineUserModel = require("../../main/DAL/User/User");
const defineAnswerModel = require("../../main/DAL/MetaQuestion/Answer");
const defineUserTagAnswerModel = require("../../main/DAL/Tasks/UserTagAnswer");
const TaskRepository = require("../../main/DAL/Tasks/TaskRepository");

const testUserData = {
    username: 'testUsername',
    firstName: 'testFirstname',
    lastName: 'testLastName',
    email: 'testEmail',
    password: 'testPassword',
    userType: USER_TYPES.LECTURER,
    callingUser: {username:"Admin", type: USER_TYPES.ADMIN}
};

const testAnswersData = [
    {
        content: 'ans1',
        tag: ANSWER_TYPES.KEY,
        explanation: ''
    },
    {
        content: 'ans2',
        tag: ANSWER_TYPES.DISTRACTOR,
        explanation: ''
    },
]

describe('TaskRepository happy path tests', () => {
    let sequelize;
    let User;
    let Answer;
    let UserTagAnswer;
    let taskRepo;
    let dbUser;
    let dbAnswers;

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        User = defineUserModel(sequelize);
        Answer = defineAnswerModel(sequelize);
        UserTagAnswer = defineUserTagAnswerModel(sequelize);
        taskRepo = new TaskRepository(sequelize);
    });

    beforeEach(async () => {
        await sequelize.sync({force: true}); // cleans the 'Users' table
        dbUser = await User.create(testUserData);
        dbAnswers = await Promise.all(testAnswersData.map(async testAnswer => Answer.create(testAnswer)));
    })

    afterAll(async () => {
        await sequelize.close();
    });

    test('tagAnswer', async () =>{
        await taskRepo.tagAnswer(dbUser.username, dbAnswers[0].id, ANSWER_TYPES.DISTRACTOR);

        const usersAnswers = await Answer.findAll({
            include: [{
                model: User,
                as: 'users',
                where: { username: dbUser.username },
                through: { attributes: ['tag'] }
            }]
        });

        expect(usersAnswers.length).toBe(1);
        const userAnswer = usersAnswers[0];
        expect(userAnswer.content).toEqual(testAnswersData[0].content);
        expect(userAnswer.tag).toEqual(testAnswersData[0].tag);
        expect(userAnswer.explanation).toEqual(testAnswersData[0].explanation);
        const userTag = userAnswer.users[0].UserTagAnswer;
        expect(userTag.tag).toEqual(ANSWER_TYPES.DISTRACTOR);
    })

    test('getTaggedAnswersOf', async () => {
        await taskRepo.tagAnswer(dbUser.username, dbAnswers[0].id, ANSWER_TYPES.DISTRACTOR);
        const taggedAnswers = await taskRepo.getTaggedAnswersOf(dbUser.username);

        expect(taggedAnswers.length).toBe(1);
        const userAnswer = taggedAnswers[0].answer;
        expect(userAnswer.content).toEqual(testAnswersData[0].content);
        expect(userAnswer.tag).toEqual(testAnswersData[0].tag);
        expect(userAnswer.explanation).toEqual(testAnswersData[0].explanation);
        const userTag = taggedAnswers[0].userTag;
        expect(userTag.tag).toEqual(ANSWER_TYPES.DISTRACTOR);
    });

    test('getUntaggedAnswersOf', async () => {
        await taskRepo.tagAnswer(dbUser.username, dbAnswers[0].id, ANSWER_TYPES.DISTRACTOR);
        const untaggedAnswers = await taskRepo.getUntaggedAnswersOf(dbUser.username);

        expect(untaggedAnswers.length).toBe(1);
        const answer = untaggedAnswers[0];
        expect(answer.content).toEqual(testAnswersData[1].content);
        expect(answer.tag).toEqual(testAnswersData[1].tag);
        expect(answer.explanation).toEqual(testAnswersData[1].explanation);
    });

    test('change tag of an already tagged answer', async () => {
        await taskRepo.tagAnswer(dbUser.username, dbAnswers[0].id, ANSWER_TYPES.DISTRACTOR);
        await taskRepo.tagAnswer(dbUser.username, dbAnswers[0].id, ANSWER_TYPES.KEY);

        const taggedAnswers = await taskRepo.getTaggedAnswersOf(dbUser.username);
        expect(taggedAnswers.length).toBe(1);
        const userAnswer = taggedAnswers[0].answer;
        expect(userAnswer.content).toEqual(testAnswersData[0].content);
        expect(userAnswer.tag).toEqual(testAnswersData[0].tag);
        expect(userAnswer.explanation).toEqual(testAnswersData[0].explanation);
        const userTag = taggedAnswers[0].userTag;
        expect(userTag.tag).toEqual(ANSWER_TYPES.KEY);
    })
});

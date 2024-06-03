const initSequelize = require("../main/DAL/Sequelize");
const {presentationDbConfig} = require("../main/DAL/Configurations");
const UserRepository = require("../main/DAL/User/UserRepository");
const defineUserModel = require("../main/DAL/User/User");
const {USER_TYPES} = require("../main/Enums");
const Admin = require("../main/business/UserManager/Admin");
const Lecturer = require("../main/business/UserManager/Lecturer");
const {DEFAULT_PASSWORD} = require("../main/business/UserManager/User");
const TA = require("../main/business/UserManager/TA");

const usersToAdd = [
    {
        username: 'Admin',
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'Admin',
        password: 'Aa123456',
        userType: USER_TYPES.ADMIN,
    },
    {
        username: 'Lecturer',
        firstName: 'Lecturer',
        lastName: 'Lecturer',
        email: 'Lecturer',
        password: DEFAULT_PASSWORD,
        userType: USER_TYPES.LECTURER,
    },
    {
        username: 'TA',
        firstName: 'TA',
        lastName: 'TA',
        email: 'TA',
        password: DEFAULT_PASSWORD,
        userType: USER_TYPES.TA,
    },
    {
        username: 'TA1',
        firstName: 'TA1',
        lastName: 'TA1',
        email: 'TA1',
        password: DEFAULT_PASSWORD,
        userType: USER_TYPES.TA,
    },
    {
        username: 'TA2',
        firstName: 'TA2',
        lastName: 'TA2',
        email: 'TA2',
        password: DEFAULT_PASSWORD,
        userType: USER_TYPES.TA,
    },
    {
        username: 'TA3',
        firstName: 'TA3',
        lastName: 'TA3',
        email: 'TA3',
        password: DEFAULT_PASSWORD,
        userType: USER_TYPES.TA,
    },
];

describe('Resets "Users" table with "usersToAdd"', () => {
    let sequelize;
    let User;
    let userRepository;

    beforeAll(async () => {
        sequelize = initSequelize(presentationDbConfig);
        await sequelize.authenticate();
        userRepository = new UserRepository(sequelize);
        User = defineUserModel(sequelize);
        await User.sync({force: true}); // cleans the 'Users' table

    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('adds a user to the database', async () => {
        await usersToAdd.forEach(async userdata => await userRepository.addUser(userdata))
    });
});
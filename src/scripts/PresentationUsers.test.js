const initSequelize = require("../main/DAL/Sequelize");
const {presentationDbConfig} = require("../main/DAL/Configurations");
const UserRepository = require("../main/DAL/User/UserRepository");
const defineUserModel = require("../main/DAL/User/User");
const {USER_TYPES} = require("../main/Enums");

const usersToAdd = [
    {
        username: 'Admin',
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'Admin',
        password: 'Admin',
        userType: USER_TYPES.ADMIN,
    },
    {
        username: 'Lecturer',
        firstName: 'Lecturer',
        lastName: 'Lecturer',
        email: 'Lecturer',
        password: 'Lecturer',
        userType: USER_TYPES.LECTURER,
    }
];

describe('UserRepository happy path tests', () => {
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
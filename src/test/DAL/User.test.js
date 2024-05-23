
const initSequelize = require("../../main/DAL/Sequelize");
const defineUserModel = require("../../main/DAL/User/User");
const UserRepository = require("../../main/DAL/User/UserRepository");
const { PK_NOT_EXISTS, PK_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS } = require("../../main/EMSError");
const testDbConfig = require("./TestConfig");
const {USER_TYPES} = require("../../main/Enums");

const testUserData = {
username: 'testUsername',
firstName: 'testFirstname',
lastName: 'testLastName',
email: 'testEmail',
password: 'testPassword',
userType: USER_TYPES.ADMIN,
};


describe('UserRepository happy path tests', () => {
    let sequelize;
    let User;
    let userRepository;

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        userRepository = new UserRepository(sequelize);
        User = defineUserModel(sequelize);
        await User.sync({force: true}); // cleans the 'Users' table

    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('adds a user to the database', async () => {
        const addedUser = await userRepository.addUser(testUserData);

        expect(addedUser).not.toBeNull();
        expect(addedUser.username).toBe(testUserData.username);
        expect(addedUser.firstName).toBe(testUserData.firstName);
        expect(addedUser.lastName).toBe(testUserData.lastName);
        expect(addedUser.email).toBe(testUserData.email);
        expect(addedUser.password).toBe(testUserData.password);
    });

    test('retrieves added user to the database', async () => { 
        const foundUser = await userRepository.getUser(testUserData.username);

        expect(foundUser).not.toBeNull();
        expect(foundUser.username).toBe(testUserData.username);
        expect(foundUser.firstName).toBe(testUserData.firstName);
        expect(foundUser.lastName).toBe(testUserData.lastName);
        expect(foundUser.email).toBe(testUserData.email);
        expect(foundUser.password).toBe(testUserData.password);
    })

    test('updates retrieved user and checks database is updated', async () => {
        const newFirstName = 'aNewFirstName';
        const foundUser = await userRepository.getUser(testUserData.username);

        foundUser.firstName = newFirstName;
        await foundUser.save();

        const updatedUser = await userRepository.getUser(testUserData.username);

        expect(updatedUser).not.toBeNull();
        expect(updatedUser.username).toBe(testUserData.username);
        expect(updatedUser.firstName).not.toBe(testUserData.firstName);
        expect(updatedUser.firstName).toBe(newFirstName);
        expect(updatedUser.lastName).toBe(testUserData.lastName);
        expect(updatedUser.email).toBe(testUserData.email);
        expect(updatedUser.password).toBe(testUserData.password);
    })

    test('tries to retrieve a non existant user', async () => {
        const nonExistantUsername = 'nonExistantUser';
        try {
            await userRepository.getUser(nonExistantUsername);
            throw new Error('Should not succeed');
        } catch (err) {
            expect(err.errorCode).toBe(PK_NOT_EXISTS);
        }
    })
});

describe('UserRepository duplication data tests', () => {
    let sequelize;
    let User;
    let userRepository;

    beforeAll(async () => {
        sequelize = initSequelize(testDbConfig);
        await sequelize.authenticate();
        userRepository = new UserRepository(sequelize);
        User = defineUserModel(sequelize);
        await User.sync({force: true});
        await userRepository.addUser(testUserData);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('tries to add user with an already existing username', async () => {
        try {
            await userRepository.addUser(testUserData);
            throw new Error('Should not succeed');
        } catch (err) {
            expect(err.errorCode).toBe(PK_ALREADY_EXISTS);
        }
    })

    test('tries to add user with an already existing email', async () => {
        const nonExistantUsername = 'nonExistantUser';
        const userData = testUserData;
        userData.username = nonExistantUsername; 
        try {
            await userRepository.addUser(userData);
            throw new Error('Should not succeed');
        } catch (err) {
            expect(err.errorCode).toBe(EMAIL_ALREADY_EXISTS);
        }
    })
});
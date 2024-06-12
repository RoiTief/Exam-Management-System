
const initSequelize = require("../../main/DAL/Sequelize");
const defineUserModel = require("../../main/DAL/User/User");
const UserRepository = require("../../main/DAL/User/UserRepository");
const { USER_PROC_ERROR_CODES, EMSError} = require("../../main/EMSError");
const testDbConfig = require("./TestConfig");
const {USER_TYPES} = require("../../main/Enums");
const {DEFAULT_PASSWORD} = require("../../main/business/UserManager/User");

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
            expect(err.errorCode).toBe(USER_PROC_ERROR_CODES.USERNAME_DOESNT_EXIST);
        }
    })

    test('getAllUsers', async () => {
        const usersToAdd = [
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

        await Promise.all(usersToAdd.map(async userDetails => await userRepository.addUser(userDetails)));
        const retrievedUsers = await userRepository.getAllUsers();
    })

    test('Delete user', async () => {
        const userToAdd = {
            username: 'ToBeDestroyed',
            firstName: 'ToBeDestroyed',
            lastName: 'ToBeDestroyed',
            email: 'ToBeDestroyed',
            password: DEFAULT_PASSWORD,
            userType: USER_TYPES.TA,
        };
        // assert user doesn't exist
        try {
            await userRepository.getUser(userToAdd.username);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROC_ERROR_CODES.USERNAME_DOESNT_EXIST);
        }

        // add user
        await userRepository.addUser(userToAdd);

        // assert user exists
        try {
            const toBeDestroyed = await userRepository.getUser(userToAdd.username);
            expect(toBeDestroyed.username).toBe(userToAdd.username);
            expect(toBeDestroyed.password).toBe(userToAdd.password);
        } catch (e) {
            expect(false).toBeTruthy();
        }

        // delete
        await userRepository.deleteUser(userToAdd.username);

        // assert user doesn't exist
        try {
            await userRepository.getUser(userToAdd.username);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROC_ERROR_CODES.USERNAME_DOESNT_EXIST);
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


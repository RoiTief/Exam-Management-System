const initSequelize = require("../../main/DAL/Sequelize");
const UserRepository = require("../../main/DAL/User/UserRepository");
const defineUserModel = require("../../main/DAL/User/User");
const {USER_TYPES} = require("../../main/Enums");
const UserController = require("../../main/business/UserManager/UserController");
const Admin = require("../../main/business/UserManager/Admin");
const {EMSError, USER_PROCESS: USER_PROCESS_ERROR_CODES} = require("../../main/EMSError");
const Lecturer = require("../../main/business/UserManager/Lecturer");
const {DEFAULT_PASSWORD} = require("../../main/business/UserManager/User");
const {SessionManager} = require("../../main/business/SessionManager/SessionManager");

const dbConfig = {
    database: 'user_controller_test',
    username: 'user_t',
    password: '123',
    host: '164.90.223.94',
    port: '5432',
    dialect: 'postgres',
    logging: false
}

const adminDetails = {
    username: 'Admin',
    firstName: 'Admin',
    lastName: 'Admin',
    email: 'Admin',
    password: 'Aa123456',
    userType: USER_TYPES.ADMIN,
}

const registerDetails = {
    username: 'User123',
    firstName: 'Fname123',
    lastName: 'Lname123',
    email: 'user123@bgu.ac.il',
    userType: USER_TYPES.LECTURER,
};

describe('Tests UserController component', () => {
    let sessionManager;
    let userController;
    let pid;
    let sequelize;
    let userRepository;
    let UserModel;

    beforeAll(async () => {
        sequelize = initSequelize(dbConfig);
        await sequelize.authenticate();
        userRepository = new UserRepository(sequelize);
        UserModel = defineUserModel(sequelize);
        await UserModel.sync({force: true}); // cleans the 'Users' table
        pid = 'pid1'
    });

    beforeEach(async () => {
        sessionManager = await new SessionManager();
        userController = await new UserController(userRepository, sessionManager);
        await UserModel.sync({force: true}); // cleans the 'Users' table
        await userRepository.addUser(adminDetails);
    })


    afterAll(async () => {
        await sequelize.close();
    });

    test('Log in - SUCCESS', async () => {
        const admin = await userController.signIn(pid, adminDetails.username, adminDetails.password);

        expect(admin instanceof Admin).toBeTruthy();
        expect(admin.getUserType()).toBe(USER_TYPES.ADMIN);
        expect(admin.getUsername()).toBe(adminDetails.username);
        expect(admin.getFirstName()).toBe(adminDetails.firstName);
        expect(admin.getLastName()).toBe(adminDetails.lastName);
        expect(admin.getEmail()).toBe(adminDetails.email);
        admin.verifyPassword(adminDetails.password);
    });

    test('Log in - FAILURE', async () => {
        // log in with wrong password
        try {
            await userController.signIn(pid, adminDetails.username, "faultyPass");
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.FAILED_LOGIN);
        }

        // log in with wrong username
        try {
            await userController.signIn(pid, "faultyUsername", adminDetails.password);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.FAILED_LOGIN);
        }
    });

    test('Verify registered', async () => {
        try {
            await userController.getUser(adminDetails.username);
        } catch (e) {
            expect(false).toBeTruthy();
        }
        try {
            await userController.getUser("something");
            expect(false).toBeTruthy(); // fail the test as we expect an error throw
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.USERNAME_DOESNT_EXIST);
        }
    })

    test('Verify logged in', async () => {
        // assert error is thrown when admin is not logged in
        try {
            await sessionManager.verifyLoggedIn(adminDetails.username);
            expect(false).toBeTruthy(); // fail the test as we expect an error throw
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.USERNAME_NOT_LOGGED_IN);
        }

        // log in to admin
        await userController.signIn(pid, adminDetails.username, adminDetails.password);

        // assert error is not thrown after logging in
        try {
            await sessionManager.verifyLoggedIn(adminDetails.username);
        } catch (e) {
            expect(false).toBeTruthy();
        }

        // log out
        sessionManager.logout(pid);

        // assert error is thrown when admin is not logged in
        try {
            await sessionManager.verifyLoggedIn(adminDetails.username);
            expect(false).toBeTruthy(); // fail the test as we expect an error throw
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.USERNAME_NOT_LOGGED_IN);
        }
    })

    test('Registering user - SUCCESS', async () => {
        await userController.signIn(pid, adminDetails.username, adminDetails.password);

        // assert user is not already registered
        try {
            await userController.getUser(registerDetails.username);
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.USERNAME_DOESNT_EXIST);
        }

        // register
        await userController.register(pid, structuredClone(registerDetails));

        // assert user is registered
        try {
            const user = await userController.getUser(registerDetails.username);
            expect(user instanceof Lecturer).toBeTruthy();
            expect(user.getUsername()).toBe(registerDetails.username);
            expect(user.getFirstName()).toBe(registerDetails.firstName);
            expect(user.getLastName()).toBe(registerDetails.lastName);
            expect(user.getEmail()).toBe(registerDetails.email);
            user.verifyPassword(DEFAULT_PASSWORD);
            user.verifyType(USER_TYPES.LECTURER);
        } catch (e) {
            expect(false).toBeTruthy();
        }
    })

    test('Registering user with faulty details - FAILURE', async () => {
        await userController.signIn(pid, adminDetails.username, adminDetails.password);

        // assert user is not already registered
        try {
            await userController.getUser(registerDetails.username);
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.USERNAME_DOESNT_EXIST);
        }

        // register
        let userDetails = null;
        try {
            await userController.register(pid, userDetails);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.USER_DETAILS_NULL);
        }

        userDetails = {};
        try {
            await userController.register(pid, userDetails);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            const possibleErrors = [
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_USERNAME,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_FNAME,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_LNAME,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_EMAIL,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_TYPE,
            ]
            expect(possibleErrors).toContain(e.errorCode);
        }

        userDetails.username = registerDetails.username;
        try {
            await userController.register(pid, userDetails);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            const possibleErrors = [
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_FNAME,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_LNAME,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_EMAIL,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_TYPE,
            ]
            expect(possibleErrors).toContain(e.errorCode);
        }

        userDetails.firstName = registerDetails.firstName;
        try {
            await userController.register(pid, userDetails);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            const possibleErrors = [
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_LNAME,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_EMAIL,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_TYPE,
            ]
            expect(possibleErrors).toContain(e.errorCode);
        }

        userDetails.lastName = registerDetails.lastName;
        try {
            await userController.register(pid, userDetails);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            const possibleErrors = [
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_EMAIL,
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_TYPE,
            ]
            expect(possibleErrors).toContain(e.errorCode);
        }

        userDetails.email = registerDetails.email;
        try {
            await userController.register(pid, userDetails);
            expect(false).toBeTruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            const possibleErrors = [
                USER_PROCESS_ERROR_CODES.USER_DETAILS_MISSING_TYPE,
            ]
            expect(possibleErrors).toContain(e.errorCode);
        }

        // if we add this last field and we reach state of registerDetails
        // then now registering is possible based on previous test
        userDetails.userType = registerDetails.userType;
        expect(userDetails).toStrictEqual(registerDetails);

        // assert user is not already registered
        try {
            await userController.getUser(registerDetails.username);
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.USERNAME_DOESNT_EXIST);
        }
    })

    test('Register with already used username/email - FAILURE', async () => {
        await userController.signIn(pid, adminDetails.username, adminDetails.password);
        await userController.register(pid, structuredClone(registerDetails));

        const userDetails = structuredClone(registerDetails);

        // registering with used username
        userDetails.email = "unused@example.com";
        try {
            await userController.register(pid, userDetails);
            expect(false).toBeThruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.USERNAME_ALREADY_EXIST);
        }

        // registering with used email
        userDetails.email = registerDetails.email;
        userDetails.username = 'unused'
        try {
            await userController.register(pid, userDetails);
            expect(false).toBeThruthy();
        } catch (e) {
            expect(e instanceof EMSError).toBeTruthy();
            expect(e.errorCode).toBe(USER_PROCESS_ERROR_CODES.EMAIL_ALREADY_EXIST);
        }
    })
});

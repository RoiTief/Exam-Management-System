// test/UserController.test.mjs

import { expect } from 'chai';
import UserController from '../main/business/UserManager/UserController.js';
import User from '../main/business/UserManager/User.js';
import SystemAdmin from '../main/business/UserManager/Admin.js';
import Lecturer from '../main/business/UserManager/Lecturer.js';
import TA from '../main/business/UserManager/TA.js';

describe('UserController', function () {
    let userController;
    let pid;

    beforeEach(function () {
        userController = new UserController();
        pid = 'pid1';
    });

    it('should register a new user', function () {
        const username = 'testUser';
        const password = 'testPassword';
        const user = userController.register(pid, username, password);
        expect(user.username).to.equal(username);
        expect(user.password).to.equal(password);
    });

    it('should not allow registering a user if already logged in', function () {
        userController.signIn(pid, 'Admin', 'Aa123456');
        expect(() => userController.register(pid, 'newUser', 'password')).to.throw('you are already logged in');
    });

    it('should sign in an existing user', function () {
        const username = 'testUser';
        const password = 'testPassword';
        userController.register(pid, username, password);
        const user = userController.signIn(pid, username, password);
        expect(user.username).to.equal(username);
        expect(userController.getLoggedInName(pid)).to.equal(username);
    });

    it('should not allow signing in with incorrect password', function () {
        const username = 'testUser';
        const password = 'testPassword';
        userController.register(pid, username, password);
        expect(() => userController.signIn(pid, username, 'wrongPassword')).to.throw('incorrect password');
    });

    it('should log out a user', function () {
        const username = 'testUser';
        const password = 'testPassword';
        userController.register(pid, username, password);
        userController.signIn(pid, username, password);
        userController.logout(pid);
        expect(() => userController.getLoggedInName(pid)).to.throw('the user is not logged in');
    });

    it('should verify user is system admin', function () {
        const adminPid = 'adminPid';
        userController.signIn(adminPid, 'Admin', 'Aa123456');
        expect(() => userController.verifySystemAdmin(adminPid)).to.not.throw();
    });

    it('should get user type', function () {
        const username = 'testUser';
        const password = 'testPassword';
        userController.register(pid, username, password);
        userController.signIn(pid, username, password);
        const userType = userController.getType(pid);
        expect(userType).to.equal('User');
    });
});

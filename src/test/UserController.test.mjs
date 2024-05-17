// test/UserController.test.mjs

import { expect } from 'chai';
import UserController from '../main/business/UserManager/UserController.js';
import User from '../main/business/UserManager/User.js';
import SystemAdmin from '../main/business/UserManager/SystemAdmin.js';
import CourseAdmin from '../main/business/UserManager/CourseAdmin.js';
import TA from '../main/business/UserManager/TA.js';
import Grader from '../main/business/UserManager/Grader.js';

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

    it('should set user as CourseAdmin', function () {
        const username = 'courseAdmin';
        const password = 'password';
        const course = { setUserAsCourseAdmin: () => {} };
        userController.register(pid, username, password);
        userController.setUserAsCourseAdmin(username, course);
        const user = userController.getUser(username);
        expect(user).to.be.instanceOf(CourseAdmin);
    });

    it('should set user as TA', function () {
        const username = 'taUser';
        const password = 'password';
        const course = { setUserAsTA: () => {} };
        userController.register(pid, username, password);
        userController.setUserAsTA(username, course);
        const user = userController.getUser(username);
        expect(user).to.be.instanceOf(TA);
    });

    it('should set user as Grader', function () {
        const username = 'graderUser';
        const password = 'password';
        const course = { setUserAsGrader: () => {} };
        userController.register(pid, username, password);
        userController.setUserAsGrader(username, course);
        const user = userController.getUser(username);
        expect(user).to.be.instanceOf(Grader);
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

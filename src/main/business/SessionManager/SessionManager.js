const {EMSError, SESSION_PROCESS: ERROR_CODES} = require("../../EMSError");
const {SESSION_PROCESS: ERROR_MSGS} = require("../../ErrorMessages");

class SessionManager {
    #sessionToUser
    #usernameToSession

    constructor() {
        this.#sessionToUser = new Map();
        this.#usernameToSession = new Map();
    }

    /**
     * Checks whether given user is logged in or not.
     * @param username user to test.
     * @returns true iff user is logged in
     */
    #isLoggedIn(username){
        if (!this.#usernameToSession.has(username)) return false;

        const session = this.#usernameToSession.get(username);
        if (this.#isSessionStale(session)) {
            this.#sessionToUser.delete(session);
            this.#usernameToSession.delete(username);
            return false;
        }
        return true;
    }

    /**
     * Throws an error if given user is not logged in already.
     * @param username username to verify
     * @throws EMSError iff user is not logged in
     */
    verifyLoggedIn(username){
        if(! this.#isLoggedIn(username))
            throw new EMSError(ERROR_MSGS.USERNAME_NOT_LOGGED_IN(username), ERROR_CODES.USERNAME_NOT_LOGGED_IN);
    }

    /**
     * Returns whether the session is logged into a certain user or not.
     * @param session session to check.
     * @return true iff session is logged into a user.
     */
    #isSessionInUse(session) {
        return this.#sessionToUser.has(session);
    }

    verifySessionInUse(session) {
        if(!this.#isSessionInUse(session))
            throw new EMSError(ERROR_MSGS.SESSION_NOT_IN_USE, ERROR_CODES.SESSION_NOT_IN_USE);
    }

    verifySessionNotInUse(session) {
        if(this.#isSessionInUse(session))
            throw new EMSError(ERROR_MSGS.SESSION_IN_USE, ERROR_CODES.SESSION_IN_USE);
    }

    /**
     * Attaches a user to a session.
     * @param session session to attach the user to.
     * @param user user to attach to the session.
     * @throws EMSError if session already has a user attached to it.
     */
    login(session, user) {
        this.verifySessionNotInUse(session);
        this.#sessionToUser.set(session, user);
        this.#usernameToSession.set(user.getUsername(), session);
    }

    /**
     * Removes session and the user attached to it from the Manager.
     * @param session session to remove.
     * @throws EMSError if session doesn't exist or has no user attached to it.
     */
    logout(session){
        this.verifySessionInUse(session);
        this.#usernameToSession.delete(this.#sessionToUser.get(session).getUsername());
        this.#sessionToUser.delete(session);
    }

    /**
     * Returns the user attached to the given session.
     */
    getUser(session) {
        this.verifySessionInUse(session);
        return this.#sessionToUser.get(session);
    }

    /**
     * Predicate on given session's relevancy.
     * @param session session to check
     * @note If a session is irrelevant the user pointing to it in loggedUsers should be removed.
     */
    #isSessionStale(session) {
        return !this.#sessionToUser.has(session);
    }
}

module.exports = {SessionManager};
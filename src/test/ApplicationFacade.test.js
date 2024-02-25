
const ApplicationFacade  = require( '../main/business/applicationFacade' );

const localStorageMock = (() => {
    let store = {};

    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock
});


test('register sanity check', () => {
    let applicationFacade = new ApplicationFacade();
    applicationFacade.register("username", "password");
    expect(applicationFacade.userController._isRegistered("username")).toBe("true");
})
// import {action , computed, makeObservable, observable, autorun, runInAction, makeAutoObservable } from "mobx";
import { makeAutoObservable } from "mobx";

class UserStore {
    rootStore;
    email;
    passwordHas ;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.email = '';
        this.passwordHas = '';
        makeAutoObservable(this);
    }

    // getters :
    getEmail() {
        return this.email
    }
    getPasswordHas() {
        return this.passHas
    }

    // setters :
    setEmail(email) {
        this.email = email
    }

    setPasswordHas(passHas) {
        this.passHas = passHas
    }

}

export default UserStore;
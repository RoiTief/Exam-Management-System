const {ANSWER_TYPES} = require("../../Enums");
const Answer = require("./Answer");

class MetaQuestion {
    #dalMQ
    /**@type {Answer[]} */
    #Answers 

    constructor(dalMQ) {
        this.#dalMQ = dalMQ;
        this.#Answers = dalMQ.answers.map(answer => new Answer(answer));
    }

    // getters setters
    getId() {
        return this.#dalMQ.id
    }

    getStem() {
        return this.#dalMQ.stem
    }

    isStemRTL() {
        return this.#dalMQ.isStemRTL;
    }

    getAnswers() {
        return this.#Answers;
    }

    /**
     * 
     * @returns {Answer[]}
     */
    getKeys() {
        return this.#Answers
            .filter(a => a.getTag() === ANSWER_TYPES.KEY)
    }
    
    getDistractors() {
        return this.#Answers
            .filter(a => a.getTag() === ANSWER_TYPES.DISTRACTOR)
    }
    /**
     * 
     * @returns {string?}
     */
    getAppendixTag() {
        return this.#dalMQ.appendixTag;
    }

    getKeywords() {
        return this.#dalMQ.keywords.map(dalKeyword => dalKeyword.word);
    }
    
    async setStem(stem) {
        this.#dalMQ.stem = stem;
        await this.#dalMQ.save();
    }

    async setAppendix(appendixTag) {
        this.#dalMQ.appendixTag = appendixTag;
        await this.#dalMQ.save();
    }

    async setStemOrientation(isStemRTL) {
        this.#dalMQ.isStemRTL = isStemRTL;
        await this.#dalMQ.save();
    }
}
module.exports = MetaQuestion
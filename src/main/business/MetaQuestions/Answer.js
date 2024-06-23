
class Answer {
    #dalAnswer

    constructor(dalAnswer) {
        this.#dalAnswer = dalAnswer;
    }

    getId() {
        return this.#dalAnswer.id;
    }

    getTag() {
        return this.#dalAnswer.tag;
    }

    getContent() {
        return this.#dalAnswer.content;
    }

    getExplanation() {
        return this.#dalAnswer.explanation;
    }
}

module.exports = Answer;
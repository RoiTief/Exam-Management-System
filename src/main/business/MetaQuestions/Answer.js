
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

    async setTag(tag) {
        this.#dalAnswer.tag = tag;
        await this.#dalAnswer.save();
    }

    getContent() {
        return this.#dalAnswer.content;
    }

    getExplanation() {
        return this.#dalAnswer.explanation;
    }

    async setExplanation(explanation) {
        this.#dalAnswer.explanation = explanation;
        await this.#dalAnswer.save();
    }

    getMetaQuestionId() {
        return this.#dalAnswer.metaQuestionId;
    }
}

module.exports = Answer;
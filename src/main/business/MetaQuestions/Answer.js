
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

    async setContentOrientation(isRTL) {
        this.#dalAnswer.isContentRTL = isRTL;
        await this.#dalAnswer.save();
    }

    isContentRTL() {
        return this.#dalAnswer.isContentRTL;
    }

    async setExplanationOrientation(isRTL) {
        this.#dalAnswer.isExplanationRTL = isRTL;
        await this.#dalAnswer.save();
    }

    isExplanationRTL() {
        return this.#dalAnswer.isExplanationRTL;
    }
}

module.exports = Answer;
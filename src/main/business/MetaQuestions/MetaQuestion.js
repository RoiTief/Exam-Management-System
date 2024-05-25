const metaQuestionDbMock = {
    addAnswer: async (metaQuestion, answer) => {
        const answerId = Math.floor(Math.random() * 10000)
        return answerId
    },
    removeAnswer: async (answerId) => {
        return
    },
    addDistractor: async (metaQuestion, distractor) => {
        const distractorId = Math.floor(Math.random() * 10000)
        return distractorId
    },
    removeDistractor: async (distractorId) => {
        return
    },
    setStem: async (metaQuestion) => {
        return
    },
    setAppendix: async (metaQuestion) => {
        return
    }
}
class MetaQuestion {

    constructor(metaQuestionProperties) {
        this.stem = metaQuestionProperties.stem
        this.answers = metaQuestionProperties.answers ?? [] // {id, answer, explanation}
        this.distractors = metaQuestionProperties.distractors ?? [] // {id, distractor, explanation}
        this.appendix = metaQuestionProperties.appendix ?? null
        this.keywords = metaQuestionProperties.keywords ?? []
        this.db = metaQuestionProperties.metaQuestionDb ?? metaQuestionDbMock

    }

    // getters setters 
    getStem() {
        return this.stem
    }

    getAnswers() {
        return this.answers
    }
    
    getDiversions() {
        return this.diversions
    }
    
    getAppendix() {
        return this.appendix
    }
    
    async setStem(stem) {
        await this.db.setStem(this)
        this.stem = stem
    }
    async setAppendix(appendix) {
        await this.db.setAppendix(this)
        this.appendix = appendix
    }


    // Add and Remove
    async addAnswer(answer) {
        if (this.answers.includes(answer)) throw new Error(`"${answer}" already exists`)
        const answerId = await this.db.addAnswer(this, answer)
        answer = { ...answer, id: answerId }
        this.answers.push(answer)
    }

    async removeAnswer(answerId) {
        if (!this.answers.includes(answer)) throw new Error(`"${answer}" does not exist`)
        await this.db.removeAnswer(answerId)
        this.answers = this.answers.filter(a => a.id !== answerId)
    }

    async addDistractor(distractor) {
        if (this.distractors.includes(distractor)) throw new Error(`"${distractor}" already exists`)
        const distractorId = await await this.db.addDistractor(this, distractor)
        distractor = { ...distractor, id: distractorId }
        this.distractors.push(distractor)
    }

    async removeDistractor(distractorId) {
        if (!this.distractors.includes(distractor)) throw new Error(`"${distractor}" does not exist`)
        await this.db.removeDistractor(distractorId)
        this.distractors = this.distractors.filter(d => d.id !== distractorId)
    }

    async addKeyword(keyword) {
        if (this.keywords.includes(keyword)) throw new Error(`"${keyword}" already exists`)
        await this.db.addKeyword(this, keyword)
        this.keywords.push(keyword)
    }
    async removeKeyword(keyword) {
        if (!this.keywords.includes(keyword)) throw new Error(`"${keyword}" does not exist`)
        await this.db.removeKeyword(this, keyword)
        this.keywords = this.keywords.filter(k => k !== keyword)
    }

    // edit
    async editAnswer(newAnswer) { // newAnswer = {id, answer, explanation}
        await this.db.editAnswer(answerId, newAnswer)
        const answer = this.answers.find(answer => answer.id === answerId);
        answer.answer = newAnswer.answer;
        answer.explanation = newAnswer.explanation;
    }
    async editDistractor(newDistractor) { // newDistractor = {id, distractor, explanation}
        await this.db.editDistractor(distractorId, newDistractor)
        const distractor = this.distractors.find(distractor => distractor.id === distractorId);
        distractor.distractor = newDistractor.distractor;
        distractor.explanation = newDistractor.explanation;
    }

}
module.exports = MetaQuestion
const MetaQuestion = require('./MetaQuestion')

class MetaQuestionController{
    #metaQuestions;

    constructor(){
        this.#metaQuestions = new Map();
    }

    createMetaQuestion(metaQuestionId) {
        return 0
    }

    #saveMetaQuestions(){
        //save to session storage
        let metaQuestionsArray = Array.from(this.#metaQuestions)
        sessionStorage.setItem('metaQuestions', JSON.stringify(metaQuestionsArray))
    }

    getCourse(metaQuestionId){
        if(!this.#metaQuestions.has(metaQuestionId)){
            throw Error("No meta questions found")
        }
        return this.#metaQuestions.get(metaQuestionId);
    }
}

module.exports = MetaQuestionController;


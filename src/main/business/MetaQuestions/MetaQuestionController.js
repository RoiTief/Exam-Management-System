const MetaQuestion = require('./MetaQuestion')

class MetaQuestionController{

    constructor(){
        this._metaQuestions = new Map();
    }

    createMetaQuestion(metaQuestionId) {
        if(this._metaQuestions.has(metaQuestionId)){
            throw Error("there already exist a meta question with this ID")
        }
        let metaQuestion = new MetaQuestion(metaQuestionId);
        this._metaQuestions.set(metaQuestionId, metaQuestion);
        // this._saveMetaQuestions()
        return metaQuestion;
    }

    _saveMetaQuestions(){
        //save to session storage
        let metaQuestionsArray = Array.from(this._metaQuestions)
        sessionStorage.setItem('metaQuestions', JSON.stringify(metaQuestionsArray))
    }

    getCourse(metaQuestionId){
        if(!this._metaQuestions.has(metaQuestionId)){
            throw Error("No meta questions found")
        }
        return this._metaQuestions.get(metaQuestionId);
    }
}

module.exports = MetaQuestionController;


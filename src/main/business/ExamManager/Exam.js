class Exam {
    constructor(examProperties) {
        if (!examProperties.questions) throw new Exception('questions is required')
        this.questions = examProperties.questions
    }
}

module.exports = Exam
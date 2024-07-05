const defineMetaQuestionModel = require("../MetaQuestion/MetaQuestion")
const defineAnswerModel = require("../MetaQuestion/Answer")
const defineExamModel = require("./Exam")
const defineQuestionModel = require("./Question");
const defineQuestionAnswerModel = require("./QuestionAnswer");
const { EMSError, EXAM_PROCESS_ERROR_CODES } = require("../../EMSError");
const { EXAM_PROCESS_ERROR_MSGS } = require("../../ErrorMessages");
const { PRIMITIVE_TYPES } = require("../../Enums");
const { validateParametersWithoutCallingUser } = require("../../validateParameters");

class ExamRepository {
    #MetaQuestion
    #Exam
    #Question
    #Answer
    #QuestionAnswer

    constructor(sequelize) {
        this.#MetaQuestion = defineMetaQuestionModel(sequelize);
        this.#Exam = defineExamModel(sequelize);
        this.#Question = defineQuestionModel(sequelize);
        this.#Answer = defineAnswerModel(sequelize);
        this.#QuestionAnswer = defineQuestionAnswerModel(sequelize);



        // Define associations
        // Exam - Question
        this.#Exam.hasMany(this.#Question, { as: 'questions', foreignKey: 'examId', onDelete: 'CASCADE' });
        this.#Question.belongsTo(this.#Exam, { as: 'exam', foreignKey: 'examId' });

        // Question - MetaQuestion
        this.#MetaQuestion.hasMany(this.#Question, { as: 'questions', foreignKey: 'questionId', onDelete: 'CASCADE' });
        this.#Question.belongsTo(this.#MetaQuestion, { as: 'metaQuestion', foreignKey: 'metaQuestionId' });

        // Question - Answer, many to many
        this.#Question.belongsToMany(this.#Answer, { as: 'answers', through: this.#QuestionAnswer });
        this.#Answer.belongsToMany(this.#Question, { as: 'questions', through: this.#QuestionAnswer });
    }
    /**
     * 
     * @param  examData { title:string }
     * @returns New Dal exam promise
     */
    async createExam(examData) {
        return await this.#Exam.create(examData);
    }

    /**
     * @returns exam object
     */
    async getExamById(id) {
        try {
            return await this.#Exam.findByPk(id, {
                include: [
                    {
                        model: this.#Question,
                        as: 'questions',
                        include: [
                            {
                                model: this.#MetaQuestion,
                                as: 'metaQuestion',
                            },
                            {
                                model: this.#Answer,
                                as: 'answers',
                            }
                        ]
                    },
                ]
            });
        } catch (e) {
            console.error(e);
            throw new EMSError(EXAM_PROCESS_ERROR_MSGS.GET_EXAM_BY_ID(id), EXAM_PROCESS_ERROR_CODES.GET_EXAM_BY_ID)
        }
    }
    /**
     * 
     * @param  examId 
     * @param  mQid : the metaQuestion id of the question
     * @param  questionData : {ordinal : the ordinal of the question in the exam}
     * @param  answerData : an array of object, contains the answerId its ordinal and version in the question. type [{id, ordinal, version}]
     * @returns The new question
     */
    async addQuestionToExam(examId, mQid, questionData, answersData) {
        validateParametersWithoutCallingUser(questionData, { ordinal: PRIMITIVE_TYPES.NUMBER })
        try {
            const exam = await this.getExamById(examId);
            const question = await this.#Question.create(questionData);
            await question.save()
            const metaQuestion = await this.#MetaQuestion.findByPk(mQid);
            await question.setMetaQuestion(metaQuestion);
            await question.setExam(exam);
            await this.#setAnswersToQuestion(question.id, answersData);
            return await this.#Question.findByPk(question.id, {
                include: [
                    {
                        model: this.#MetaQuestion,
                        as: 'metaQuestion',
                    },
                    {
                        model: this.#Answer,
                        as: 'answers',
                    },
                ]
            });
        } catch (e) {
            console.error(e);
            throw new EMSError(EXAM_PROCESS_ERROR_MSGS.ADD_QUESTION_TO_EXAM(examId, mQid, questionData, answerData), EXAM_PROCESS_ERROR_CODES.ADD_QUESTION_TO_EXAM)
        }
    }


    /**
     * 
     * @param  qid : the question id of the question
     * @param  answersData : an array of object, contains the answerId its ordinal and version in the question. type [{id, ordinal, version}]
     */
    async #setAnswersToQuestion(qid, answersData) {
        validateParametersWithoutCallingUser(answersData, [{ id: PRIMITIVE_TYPES.NUMBER, ordinal: PRIMITIVE_TYPES.NUMBER, version: PRIMITIVE_TYPES.NUMBER }])

        const question = await this.#Question.findByPk(qid);
        try {
            await Promise.all(
                answersData.map(async answerData => {
                    const answer = await this.#Answer.findByPk(answerData.id);
                    return await question.addAnswer(answer, { through: { answerId: answer.id, questionId: qid, ordinal: answerData.ordinal, version: answerData.version } });
                }));
        } catch (e) {
            console.error(e);
            throw new EMSError(EXAM_PROCESS_ERROR_MSGS.SET_ANSWERS_TO_QUESTION(qid, answersData), EXAM_PROCESS_ERROR_CODES.SET_ANSWERS_TO_QUESTION)
        }

    }

    async getAllExams() {
        return await this.#Exam.findAll(
            {
                include: [
                    {
                        model: this.#Question, as: 'questions',
                        include: [
                            {
                                model: this.#MetaQuestion, as: 'metaQuestion'
                            },
                            {
                                model: this.#Answer, as: 'answers'
                            }
                        ]
                    }
                ]
            });
    }
}

module.exports = ExamRepository
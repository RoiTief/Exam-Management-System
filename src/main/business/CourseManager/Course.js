const FixedSizeMap = require("fixedsize-map"); // cyclic map with limited place
const MetaQuestion = require("../MetaQuestions/MetaQuestion");
const META_QUESTIONS_CACHE_SIZE = 100
const PAST_EXAMS_CACHE_SIZE = 100

const courseDbMock =
{
    addAdmin: (course, username) => {},
    addTa: (course, username) => {},
    addGrader: (course, username) => {},
    addMetaQuestion: (course, metaQuestionProperty) => {}
}
class Course{

    constructor(courseID, courseName, courseDb) {
        this.id = courseID;
        this.name = courseName;
        this.personal = {
            "CourseAdmins" : [],
            "TAs" : [],
            "Graders" : []
        }
        this.MetaQuestionsCache = new FixedSizeMap(META_QUESTIONS_CACHE_SIZE);
        this.pastExamsCache = new FixedSizeMap(PAST_EXAMS_CACHE_SIZE);;
        this.db = courseDb ?? courseDbMock;

    }

    async addAdmin(username){
        if(this.personal.CourseAdmins.includes(username))
            throw new Error(`${username} is already a course admin`)
        this.personal.CourseAdmins.push(username)
        await this.db.addAdmin(this, username)
    }

    async addTa(username){
        if(this.personal.TAs.includes(username))
            throw new Error(`${username} is already a TA`)
        this.personal.TAs.push(username)
        await this.db.addTa(this, username)
    }
    

    async addGrader(username){
        if(this.personal.Graders.includes(username))
            throw new Error(`${username} is already a grader`)
        this.personal.Graders.push(username)
        await this.db.addGrader(this, username)
    }

    async addSimpleMetaQuestion(metaQuestionProperty){
        const metaQuestionId = await this.db.addMetaQuestion(this, metaQuestionProperty)
        this.MetaQuestionsCache.push(new MetaQuestion(metaQuestionProperty))
    }
}

module.exports = Course;

const { dbConfig, presentationDbConfig} = require("./Configurations");
const initSequelize = require("./Sequelize");
const UserRepository = require("./User/UserRepository");
const MetaQuestionsRepository = require("./MetaQuestion/MetaQuestionRepository");
const ExamRepository = require("./Exam/ExamRepository");
const TaskRepository = require("./Tasks/TaskRepository");

const sequelize = initSequelize(presentationDbConfig);

const userRepo = new UserRepository(sequelize);
const metaQuestionsRepo = new MetaQuestionsRepository(sequelize);
const examRepo = new ExamRepository(sequelize)
const taskRepo = new TaskRepository(sequelize);
sequelize.sync({alter: true})

module.exports = {userRepo, metaQuestionsRepo, taskRepo, examRepo}

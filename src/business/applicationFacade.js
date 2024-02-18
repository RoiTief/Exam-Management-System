class ApplicationFacade{

    /**
     * register a user
     * @param username - the new user username - needs to be unique
     * @param password - the new user password
     * @returns {User} - returns the created user
     * @throws Error - if the username is taken
     */
    register(username, password){
        //todo
    }

    /**
     * signs in user
     * @param username - the user username - need to be registered
     * @param password - the user password
     * @returns {User} - returned the signed-in user
     * @throws {Error} - if there is no registered user with this username
     *                 - if the password is incorrect
     */
    signIn(username, password) {
        //todo
    }

    /**
     * creates new course
     * create a task for the new courseAdmin to accept being a courseAdmin
     * @param username - the user who tries to create the new course - needs to be a systemAdmin
     * @param courseID - the new courseID - need to be unique
     * @param courseName - the new course name
     * @param courseAdminUsername - the new course admin
     * @return {Course} the new course created
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a systemAdmin
     *                 - if there is no user named courseAdminUsername
     *                 - if there is already a course with this ID
     */
    addCourse(username, courseID, courseName, courseAdminUsername){
        //todo
    }

    /**
     * add a ta to the course {@username} is Admin of
     * create a task for the new TA to accept being a TA of this course
     * @param username - the user who tries to add the new TA - needs to be a courseAdmin
     * @param TAUsername
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername (is not assigned to a course)
     *                 - if there is no user named TAUsername
     */
    addTA(username, TAUsername){
        //todo
    }

    /**
     * add a grader to the course {@username} is Admin of
     * create a task for the new grader to accept being a grader of this course
     * @param username - the user who tries to add the new grader - needs to be a courseAdmin
     * @param graderUsername
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     *                 - if there is no user named graderUsername
     */
    addGrader(username, graderUsername){
        //todo
    }

    /**
     * creates a test for the course {@username} is Admin of
     * export it as a pdf and as a word file
     * adds the test to pastExams
     * @param username - the user who tries to set the exam parameters - needs to be a courseAdmin
     * @param parameters {Map<string, [number, number]>} a map of parameters that specify for each subject -
     *                                                  how many questions per subject and how many points the subject
     *                                                  is worth (notice that each question's value is the subject worth
     *                                                  devided by the number of questions
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     *                 - if the sum total of the subject worth is not 100
     */
    setExamParameters(username, parameters){
        //todo
    }

    /**
     * creates a test for the course {@username} is Admin of
     * export it as a pdf and as a word file
     * adds the test to pastExams
     * @param username - the user who tries to create the new exam - needs to be a courseAdmin
     * @param reason - why you create the new exam (for example "Term A 2022" "example test for students"
     * @return {Exam}
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     *                 - if the course subject spread is not specified
     *                 - if there is not enough questions for a subject
     */
    createExam(username, reason){
        //todo
    }

    /**
     * view course statistics (per subject)
     * @param username - the user who tries to view the course statistics - needs to be a courseAdmin
     * @return {Map<string,number>} per subject the precent of correct answers
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     *                 - if the course subject spread is not specified
     */
    viewStatistics(username){
        //todo
    }

    /**
     * view course statistics (per question)
     * @param username - the user who tries to view the course statistics - needs to be a courseAdmin
     * @param subject
     * @return {Map<Question,number>} per question the precent of correct answers
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     */
    viewStatisticsPerSubject(username, subject){
        //todo
    }

    /**
     * view all the tasks of the course and their progress
     * @param username - the user who tries to view the course tasks - needs to be a systemAdmin
     * @return {[Task]}
     * @throws {Error} - if there is no user with name @username
     *                 - if the user named username is not a courseAdminUsername or is not assigned to a course
     */
    viewTasksForCourse(username){
        //todo
    }

    /**
     * view my tasks
     * @param username - the user who tries to view his tasks
     * @return {[Task]}
     * @throws {Error} - if there is no user with name @username
     */
    viewMyTasks(username){
        //todo
    }

    /**
     * view all unassigned tasks
     * @param username - the user who tries to view his tasks
     * @return {[Task]}
     * @throws {Error} - if there is no user with name @username
     */
    viewUnassignedTasks(username){
        //todo
    }

    /**
     * assigned a new task to user named @{username}
     * @param username - the user who tries to assign himself a new task
     * @param taskId - the task
     * @throws {Error} - if there is no user with name @username
     *                 - if there is no task with this id
     *                 - if this task is already assigned to a user
     */
    assignNewTask(username, taskId){
        //todo
    }

    /**
     * progress a task - from backlog to processed or from processed to finished
     * @param username - the user who tries to progress a task
     * @param taskId - the taskID
     * @throws {Error} - if there is no user with name @username
     *                 - if there is no task with this id
     *                 - if task with this ID is not assigned to the username
     */
    progressATask(username, taskId){
        //todo
    }

    /**
     * a grader adds a student answers to an exam
     * the exam\subject\questions statistics are modified
     * @param username - the username of the grader
     * @param examId - the exam id
     * @param answers {[number]} - the answer list (each answer is a number between 1-4)
     * @throws {Error} - if there is no user with name @username
     *                 - if the user is not a grader of a course
     *                 - if there is no exam with this id to the course
     *                 - if one of the answers is not valid
     */
    addAnswer(username, examId, answers){
        //todo
    }


}
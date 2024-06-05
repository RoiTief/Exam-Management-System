import Cookies from 'js-cookie';
export const TOKEN_FIELD_NAME = "jwt_exam_token"
const SERVER_ROOT_URL = "http://localhost:8080/"
const LATEX_SERVER_ROOT_URL = "http://164.90.223.94:3001/"

export const httpsMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    OPTIONS: 'OPTIONS',
    HEAD: 'HEAD'
};

export const serverPath = {
    SIGN_UP: 'signUp',
    SIGN_IN: 'signIn',
    GET_ALL_STAFF : 'getAllStaff',
    SIGN_OUT: 'logout',
    VIEW_TASKS: 'viewMyTasks',
    ADD_TA: 'addTA',
    ADD_GRADER: 'addGrader',
    ADD_LECTURER: 'addLecturer',
    FINISH_TASK: 'finishATask',
    VIEW_QUESTIONS: 'viewCourseMetaQuestions',
    ADD_META_QUESTION: 'addMetaQuestion',
    GET_ALL_USERS: 'getAllUsers',
    GET_ALL_META_QUESTIONS: 'getAllMetaQuestions',
    GET_ALL_APPENDIXES: 'getAllAppendixes',
    DELETE_USER: 'deleteUser',
    CREATE_EXAM: 'createExam',
    GET_ALL_EXAMS: 'getAllExams',
    CHANGE_PASSWORD: 'changePassword',
    EDIT_USER: 'editUser'
}

export const latexServerPath = {
  COMPILE: 'compile',
  COMPILE_EXAM: 'exam',
  COMPILE_MQ: 'metaQuestion'
};

export async function requestLatexServer(path, body) {
  console.log(`req: ${LATEX_SERVER_ROOT_URL + path}`)
  return (Cookies.get(TOKEN_FIELD_NAME)) ?
    await fetch(LATEX_SERVER_ROOT_URL + path,
      {     method: httpsMethod.POST,
        headers: {
          'Content-Type': 'application/json',
          'Origin': '*',
          'Authorization': `JWT ${Cookies.get(TOKEN_FIELD_NAME)}`
        },
        body: JSON.stringify(body)
      }) :
     await fetch(LATEX_SERVER_ROOT_URL + path,
      {
        method: httpsMethod.POST,
        headers: {
          'Content-Type': 'application/json',
          'Origin': '*',
        },
        body: JSON.stringify(body)
      });
}

export async function requestServer(path, method, body) {
    var response
    if (Cookies.get(TOKEN_FIELD_NAME)) {
        response = await fetch(SERVER_ROOT_URL + path,
            {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': '*',
                    'Authorization': `JWT ${Cookies.get(TOKEN_FIELD_NAME)}`
                },
                body: JSON.stringify(body)
            })
    }
    else{
        response = await fetch(SERVER_ROOT_URL + path,
            {   
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': '*',
                },
                body: JSON.stringify(body)
            })
    }
    try{
    response = await response.json();

    }catch(err){
        throw new Error("Could not parse response")
    }
    
    if (response.code !== 200) {
        throw new Error(response.message)
    }
    var { code, ...retObject } = response
    return retObject;
}
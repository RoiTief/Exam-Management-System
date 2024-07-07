import Cookies from 'js-cookie';
import {validateParameters} from '../../../src/main/validateParameters'
import { PRIMITIVE_TYPES } from '../../../src/main/Enums';
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
  GET_ALL_STAFF: 'getAllStaff',
  SIGN_OUT: 'logout',
  VIEW_TASKS: 'viewMyTasks',
  ADD_TA: 'addTA',
  ADD_LECTURER: 'addLecturer',
  FINISH_TASK: 'finishATask',
  VIEW_QUESTIONS: 'viewCourseMetaQuestions',
  ADD_META_QUESTION: 'addMetaQuestion',
  ADD_MANUAL_META_QUESTION: 'addManualMetaQuestionToExam',
  ADD_AUTOMATIC_META_QUESTION: 'addAutomaticQuestionToExam',
  GET_ALL_USERS: 'getAllUsers',
  GET_ALL_META_QUESTIONS: 'getAllMetaQuestions',
  GET_META_QUESTIONS_FOR_EXAM: 'getMetaQuestionsForExam',
  REMOVE_QUESTION_FROM_EXAM: 'removeQuestionFromExam',
  GET_ALL_APPENDICES: 'getAllAppendices',
  DELETE_USER: 'deleteUser',
  CREATE_EXAM: 'createExam',
  CHANGE_PASSWORD: 'changePassword',
  RESET_PASSWORD: 'resetPassword',
  EDIT_USER: 'editUser',
  EDIT_META_QUESTION: 'editMetaQuestion',
  GET_META_QUESTIONS_FOR_APPENDIX: 'getMetaQuestionForAppendix',
  EDIT_APPENDIX: 'editAppendix',
  ADD_APPENDIX: 'addAppendix',
  REFRESH_TOKEN: 'refreshJWT',
  GET_ALL_EXAMS: 'getAllExams',
  GET_VERSIONED_EXAM: 'getVersionedExam',
  GENERATE_TASK: 'generateTask',
  COMPLETE_GENERATED_TASK: 'completeGeneratedTask',
  COMPLETE_CREATED_TASK: 'completeCreatedTask',
  DELETE_QUESTION: 'deleteQuestion',
  DELETE_APPENDIX: 'deleteAppendix'
};


const pathToReturnTypeMap={
  [serverPath.VIEW_TASKS]: {tasks:[{taskId:PRIMITIVE_TYPES.NUMBER, superType: PRIMITIVE_TYPES.STRING, type: PRIMITIVE_TYPES.STRING, creatingUser: {username: PRIMITIVE_TYPES.STRING, email: PRIMITIVE_TYPES.STRING, firstName: PRIMITIVE_TYPES.STRING, lastName: PRIMITIVE_TYPES.STRING, type: PRIMITIVE_TYPES.STRING}}]},
  [serverPath.GET_ALL_USERS] :{users: [{username: PRIMITIVE_TYPES.STRING, email: PRIMITIVE_TYPES.STRING, firstName: PRIMITIVE_TYPES.STRING, lastName: PRIMITIVE_TYPES.STRING, type: PRIMITIVE_TYPES.STRING}]}
}

export const latexServerPath = {
  COMPILE: 'compile',
  COMPILE_EXAM: 'exam',
  COMPILE_EXAM_VERSION: 'exam_version',
  COMPILE_MQ: 'metaQuestion',
  COMPILE_STEM: 'stem',
  COMPILE_APPENDIX: 'appendix',
  COMPILE_ANSWER: 'answer',
  APPENDIX: 'appendix'
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

async function fetchWithCookies(path, method, body){
  var response
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
    return response
}

async function extractDataFromResponse(response){
  try{
    response = await response.json();

    }catch(err){
        throw new Error("Could not parse response")
    }
    
    if (response.code !== 200) {
        throw new Error(response.message)
    }
    var { code, ...retObject } = response
    return retObject
}


export async function requestServer(path, method, body) {
    var response
    let responsePromise
    let refreshTokenPromise = undefined
    if (Cookies.get(TOKEN_FIELD_NAME)) {
      responsePromise = fetchWithCookies(path,method,body)

      // refresh cookies
      refreshTokenPromise = fetchWithCookies(serverPath.REFRESH_TOKEN ,httpsMethod.GET, undefined).then(async (refreshTokenResponse)=>{
          const {newToken} = await extractDataFromResponse(refreshTokenResponse)
          Cookies.set(TOKEN_FIELD_NAME, newToken, {expires: 1 / 96});
         }).catch(console.error)
         
    }
    else{
      responsePromise = fetch(SERVER_ROOT_URL + path,
            {   
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': '*',
                },
                body: JSON.stringify(body)
            })
    }

    response = await responsePromise
    const retObject = await extractDataFromResponse(response)
    
    if(pathToReturnTypeMap[path]){
      validateParameters(retObject, pathToReturnTypeMap[path], false, false)
    }

    if(refreshTokenPromise) await refreshTokenPromise 
    return retObject;
}
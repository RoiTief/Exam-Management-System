const SERVER_ROOT_URL = "http://localhost:8080/"
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
}


export async function requestServer(path, method, body){
    var response = await fetch(SERVER_ROOT_URL + path,
        {method,
        headers: {
          'Content-Type': 'application/json',
          'Origin' : '*'
        },
        body: JSON.stringify(body)
      })
    response = await response.json();
    
    if(response.code !== 200){
        throw new Error(response.message)
    }
    var {code, ...retObject} = response
    return retObject;
}
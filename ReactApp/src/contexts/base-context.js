// src/contexts/base-context.js
import Cookies from 'js-cookie';
import { httpsMethod, serverPath, requestServer, TOKEN_FIELD_NAME } from 'src/utils/rest-api-call';

class base_context {
  static async request(path, method, data) {
    try {
      const response = await requestServer(path, method, data);
      return response;
    } catch (error) {
      console.error(`Request failed: ${error}`);
      throw error;
    }
  }

  static getToken() {
    return Cookies.get(TOKEN_FIELD_NAME);
  }

  static setToken(token) {
    Cookies.set(TOKEN_FIELD_NAME, token);
  }

  static clearToken() {
    Cookies.remove(TOKEN_FIELD_NAME);
  }
}

export default base_context;

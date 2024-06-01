import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { httpsMethod, serverPath, requestServer, TOKEN_FIELD_NAME } from 'src/utils/rest-api-call';
import Cookies from 'js-cookie';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        user
          ? {
            isAuthenticated: true,
            isLoading: false,
            user
          }
          : {
            isAuthenticated: false,
            isLoading: false
          }
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    try {
      const token = Cookies.get(TOKEN_FIELD_NAME);
      if (token) {
        const user = JSON.parse(localStorage.getItem('user')); // Get user details from localStorage
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user
        });
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const signIn = async (username, password) => {
      const { user, token } = await requestServer(serverPath.SIGN_IN, httpsMethod.POST, { username, password });
      Cookies.set(TOKEN_FIELD_NAME, token, {expires: 1 / 96});
      localStorage.setItem('user', JSON.stringify(user)); // Store user details in localStorage
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user
      });
      return user;
  };

  const signUp = async (username, password) => {
    try {
      await requestServer(serverPath.SIGN_UP, httpsMethod.POST, { username, password });
    } catch (error) {
      console.error('Failed to sign up:', error);
    }
  };

  const signOut = async () => {
    try {
      await requestServer(serverPath.SIGN_OUT, httpsMethod.POST, {});
      Cookies.remove(TOKEN_FIELD_NAME);
      localStorage.removeItem('user'); // Remove user details from localStorage
      dispatch({
        type: HANDLERS.SIGN_OUT
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const changePassword = async (username, newPassword) => {
    const { user, token } = await requestServer(serverPath.CHANGE_PASSWORD, httpsMethod.POST, { username, newPassword });
    Cookies.set(TOKEN_FIELD_NAME, token, {expires: 1 / 96});
    localStorage.setItem('user', JSON.stringify(user)); // Store user details in localStorage
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);

import React, { createContext, useReducer, useEffect } from 'react';
import { requestServer, serverPath, httpsMethod } from 'src/utils/rest-api-call';

export const UserContext = createContext(undefined);

const initialState = {
  users: []
};

const HANDLERS = {
  SET_USER: 'SET_USER',
  ADD_USER: 'ADD_USER',
  EDIT_USER: 'EDIT_USER',
  DELETE_USER: 'DELETE_USER'
};

const handlers = {
  [HANDLERS.SET_USER]: (state, action) => {
    return {
      ...state,
      users: action.payload
    };
  },
  [HANDLERS.ADD_USER]: (state, action) => {
    return {
      ...state,
      users: [...state.users, action.payload]
    };
  },
  [HANDLERS.EDIT_USER]: (state, action) => {
    return {
      ...state,
      users: state.users.map(user => user.username === action.payload.username ? action.payload : user)
    };
  },
  [HANDLERS.DELETE_USER]: (state, action) => {
    return {
      ...state,
      users: state.users.filter(user => user.username !== action.payload)
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await requestServer(serverPath.GET_ALL_USERS, httpsMethod.GET);
        dispatch({ type: HANDLERS.SET_USER, payload: response.users });
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async user => {
    try {
      await requestServer(serverPath.SIGN_UP, httpsMethod.POST, {username: user.username, userType: user.type});
      dispatch({ type: HANDLERS.ADD_USER, payload: user });
    } catch (error){
      console.error("failed to add user:", error)
    }
  };

  const editUser = async user => {
    try {
      await requestServer(serverPath.EDIT_USER, httpsMethod.PUT, {username: user.username, userType: user.type});
      dispatch({ type: HANDLERS.EDIT_USER, payload: user });
    } catch (error){
      console.error("failed to edit user:", error)
    }
  };

  const deleteUser = async username => {
    try {
      await requestServer(serverPath.DELETE_USER, httpsMethod.DELETE, username);
      dispatch({ type: HANDLERS.DELETE_USER, payload: username });
    } catch (error){
      console.error("failed to delete user:", error)
    }
  };

  return (
    <UserContext.Provider value={{ state, addUser, editUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

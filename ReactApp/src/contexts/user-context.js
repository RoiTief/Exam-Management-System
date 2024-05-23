import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { requestServer, serverPath, httpsMethod } from 'src/utils/rest-api-call';

const UserContext = createContext(undefined);

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
      users: state.users.map(user => user.id === action.payload.id ? action.payload : user)
    };
  },
  [HANDLERS.DELETE_USER]: (state, action) => {
    return {
      ...state,
      users: state.users.filter(user => user.id !== action.payload.id)
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

  const addUser = user => {
    dispatch({ type: 'ADD_USER', payload: user });
  };

  const editUser = user => {
    dispatch({ type: 'EDIT_USER', payload: user });
  };

  const deleteUser = id => {
    dispatch({ type: 'DELETE_USER', payload: { id } });
  };

  return (
    <UserContext.Provider value={{ state, addUser, editUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

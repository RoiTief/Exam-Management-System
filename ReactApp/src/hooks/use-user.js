import { useContext } from 'react';
import { UserContext } from 'src/contexts/user-context';

export const useUser = () => useContext(UserContext);

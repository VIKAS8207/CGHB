import { createContext, useContext, useState } from 'react';
import { ROLES } from '../utils/roles';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // CHANGE THIS STRING TO TEST DIFFERENT VIEWS!
  // Options: ROLES.COMMISSIONER, ROLES.DEPT_HEAD, ROLES.ENGINEER
  const [userRole, setUserRole] = useState(ROLES.COMMISSIONER); 

  return (
    <AuthContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
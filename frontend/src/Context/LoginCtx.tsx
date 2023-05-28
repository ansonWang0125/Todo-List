import React, { useContext, useState, ReactNode } from 'react';

interface LoginContextProps {
  login: boolean;
  changeLogin: (input: boolean) => void;
}

interface LoginContextProviderProps {
  children: ReactNode;
}

const LoginContext = React.createContext<LoginContextProps>({
  login: false,
  changeLogin: () => {}
});

const LoginContextProvider: React.FC<LoginContextProviderProps> = ({ children }) => {
  const initialState = localStorage.getItem('user') ? true : false
  const [login, setLogin] = useState<boolean>(initialState);

  const changeLogin = (input: boolean) => {
    setLogin(input);
  };

  return (
    <LoginContext.Provider value={{ login, changeLogin }}>
      {children}
    </LoginContext.Provider>
  );
};

const useLoginContext = () => {
  return useContext(LoginContext);
};

export { LoginContextProvider, useLoginContext };

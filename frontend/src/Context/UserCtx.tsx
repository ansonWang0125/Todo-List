import React, { useContext, useState, ReactNode } from 'react';

interface UserContextProps {
  user: string;
  changeUser: (input: string) => void;
}

interface UserContextProviderProps {
  children: ReactNode;
}

const UserContext = React.createContext<UserContextProps>({
  user: '',
  changeUser: () => {}
});

const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  let initialState = ''
  const storedUser = localStorage.getItem('user');
  if (storedUser !== undefined && storedUser !== null) {
      const user = JSON.parse(storedUser);
      initialState = user.name;
  }
  const [user, setUser] = useState<string>(initialState);

  const changeUser = (input: string) => {
    setUser(input);
  };

  return (
    <UserContext.Provider value={{ user, changeUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  return useContext(UserContext);
};

export { UserContextProvider, useUserContext };

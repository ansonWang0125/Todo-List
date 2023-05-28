import React, { useContext, useState, ReactNode } from 'react';

interface StateContextProps {
  state: string;
  changeState: (input: string) => void;
}

interface StateContextProviderProps {
  children: ReactNode;
}

const StateContext = React.createContext<StateContextProps>({
  state: 'todo',
  changeState: () => {}
});

const StateContextProvider: React.FC<StateContextProviderProps> = ({ children }) => {
  const [state, setState] = useState<string>('todo');

  const changeState = (input: string) => {
    setState(input);
  };

  return (
    <StateContext.Provider value={{ state, changeState }}>
      {children}
    </StateContext.Provider>
  );
};

const useStateContext = () => {
  return useContext(StateContext);
};

export { StateContextProvider, useStateContext };

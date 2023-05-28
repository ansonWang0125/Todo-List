import React, { useContext, useState, ReactNode, useEffect } from 'react';
import { apiShowTask } from '../axios/api';

interface Data {
    taskID: number;
    task: string;
    creator: string;
    createTime: Date;
    dueTime: Date;
    state: string;
  }

interface TaskContextProps {
  todo: Data [];
  done: Data [];
  fetch: boolean;
  changeTodo: (input: Data []) => void;
  changeDone: (input: Data []) => void;
  changeFetch: (input: boolean) => void;
}

interface TaskContextProviderProps {
  children: ReactNode;
}

const TaskContext = React.createContext<TaskContextProps>({
  todo: [],
  done: [],
  fetch: false,
  changeTodo: () => {},
  changeDone: () => {},
  changeFetch: () => {},
});

async function ShowAllTask() {
    try {
      const response = await apiShowTask();
      if (response.status === 200) {
        const responseData = response.data;
        console.log('success');
        console.log('response = ', responseData);
        return responseData;
      }
    } catch (reason: any){ 
        let response = reason.response
        console.log(response)
    }
}

const TaskContextProvider: React.FC<TaskContextProviderProps> = ({ children }) => {
    const [fetch, setFetch] = useState<boolean>(false);
    useEffect(() => {
        console.log('fetching TaskContext')
        const fetchData = async () => {
          const response = await ShowAllTask();
          console.log(response)
          if ( response.length > 0 ) {
            changeTodo(response.filter((row: Data) => row.state === 'todo'))
            changeDone(response.filter((row: Data) => row.state === 'done'))
          }
        }
        fetchData();
      }, [fetch])

    const [todo, setTodo] = useState<Data []>([]);
    const [done, setDone] = useState<Data []>([]);

    const changeTodo = (input: Data []) => {
        setTodo(input);
    };

    const changeDone = (input: Data []) => {
        setDone(input);
    };

    const changeFetch = (input: boolean) => {
        setFetch(input);
    };

    return (
        <TaskContext.Provider value={{ todo, done, fetch, changeTodo, changeDone, changeFetch }}>
        {children}
        </TaskContext.Provider>
    );
};

const useTaskContext = () => {
  return useContext(TaskContext);
};

export { TaskContextProvider, useTaskContext };

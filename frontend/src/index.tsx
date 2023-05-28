import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LoginContextProvider } from './Context/LoginCtx';
import { UserContextProvider } from './Context/UserCtx';
import { StateContextProvider } from './Context/StateCtx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TaskContextProvider } from './Context/TaskCtx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <UserContextProvider>
    <LoginContextProvider>
    <StateContextProvider>
    <TaskContextProvider>
      <App />
    </TaskContextProvider>
    </StateContextProvider>
    </LoginContextProvider>
    </UserContextProvider>
    </LocalizationProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

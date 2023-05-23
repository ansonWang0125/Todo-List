import React from 'react';
import './css/mainpage.css';
import Login from '../Components/login/Login';
import Todo from '../Components/todo/Todo';

function Mainpage() {
  return (
    <div className="mainpage">
        <Login />
        <Todo />
    </div>
  );
}

export default Mainpage;
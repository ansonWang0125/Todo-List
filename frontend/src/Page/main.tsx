import React from 'react';
import { Routes, Route,} from "react-router";
import './css/main.css';
import Mainpage from './mainpage';

function Main() {
  return (
    <div className="main">
      <Routes>
        <Route path='/' element={ <Mainpage />}/>
      </Routes>
    </div>
  );
}

export default Main;
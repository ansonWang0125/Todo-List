import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Main from './Page/main';
import Header from './Components/header/header';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Wrapper = styled.div`
  position: fixed;
  width:100%;
  height:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow:scroll;
`

function App() {
  return (
    <>
    <ToastContainer/>
    <div className="App">
      <Wrapper id="rootMain">
        <Router>
          <Header />
          <Routes>
            <Route path='/*' element={ <Main/> } />
          </Routes>
          {/* <Footer/> */}
        </Router>
      </ Wrapper>
    </div>
    </>
  );
}

export default App;

import React from 'react';
// import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes,  Route } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

import Main from './page/main';
import Login from './page/login';
import Register from './page/register';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/*" element={<Main />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

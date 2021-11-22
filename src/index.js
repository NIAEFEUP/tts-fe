import React from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/home'
import Header from './components/Header'
import "./style.css" 

ReactDOM.render( 
  <React.StrictMode> 
    <Header/>
    <Home/> 
  </React.StrictMode>,
  document.getElementById('root')
); 

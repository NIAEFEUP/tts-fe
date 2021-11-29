import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';

import Home from './pages/home';
import Header from './components/Header';
import AppTheme from "./AppTheme";
import "./style.css";

ReactDOM.render( 
  <React.StrictMode>
    <ThemeProvider theme={AppTheme}>
      <Header/>
      <Home/> 
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
); 

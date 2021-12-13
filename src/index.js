import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';

import AppTheme from "./AppTheme";
import "./style.css";
import AppRouter from './AppRouter';

ReactDOM.render( 
    <React.StrictMode>
        <ThemeProvider theme={AppTheme}>
            <AppRouter />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
); 

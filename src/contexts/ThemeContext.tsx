import React, { createContext, useContext, useState } from 'react';
import { useDarkMode } from '../hooks';

export const ThemeContext = createContext({
    enabled: false,
    setEnabled: (enabled) => {}
});


import React, { createContext } from 'react'

export const ThemeContext = createContext({
  enabled: false,
  setEnabled: (enabled: boolean) => {},
})

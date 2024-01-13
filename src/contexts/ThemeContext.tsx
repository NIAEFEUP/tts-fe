import { createContext } from 'react'

//TODO: Change the boolean to a more appropriate name, like "darkMode"
export const ThemeContext = createContext({
  enabled: false,
  setEnabled: (enabled: boolean) => {},
})

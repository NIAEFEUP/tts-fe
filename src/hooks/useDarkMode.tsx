import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage('dark-theme', false)

  // DARK MODE DISABLED: Always remove dark theme to force light mode.
  // To re-enable dark mode, replace the line below with:
  //   if (enabled) { window.document.body.setAttribute('data-theme', 'dark') } else { window.document.body.removeAttribute('data-theme') }
  useEffect(() => {
    window.document.body.removeAttribute('data-theme')
  }, [enabled])

  return [enabled, setEnabled]
}

export default useDarkMode

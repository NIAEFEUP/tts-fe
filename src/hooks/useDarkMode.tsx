import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage('dark-theme', false)

  useEffect(() => {
    if (enabled) {
      window.document.body.setAttribute('data-theme', 'dark')
    } else {
      window.document.body.removeAttribute('data-theme')
    }
  }, [enabled])

  return [enabled, setEnabled]
}

export default useDarkMode

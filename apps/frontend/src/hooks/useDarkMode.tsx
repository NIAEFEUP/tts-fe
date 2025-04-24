import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage('dark-theme', false)

  useEffect(() => {
    const className = 'dark'
    const bodyClass = window.document.body.classList

    // eslint-disable-next-line 
    enabled ? bodyClass.add(className) : bodyClass.remove(className)
  }, [enabled])

  return [enabled, setEnabled]
}

export default useDarkMode

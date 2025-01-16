import { useEffect, useState } from 'react'
import useLocalStorage from './useLocalStorage'

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage('dark-theme')

  // @ts-ignore
  const isEnabled = typeof enabledState === 'undefined' && enabled

  useEffect(() => {
    const className = 'dark'
    const bodyClass = window.document.body.classList

    // eslint-disable-next-line 
    isEnabled ? bodyClass.add(className) : bodyClass.remove(className)
  }, [enabled, isEnabled])

  return [enabled, setEnabled]
}

export default useDarkMode

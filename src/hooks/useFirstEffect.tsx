import { useEffect, useRef } from 'react'

const useFirstEffect = (callback: Function, dependencies: any[]) => {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (!firstRenderRef.current) return
    firstRenderRef.current = false
    callback()
  }, dependencies)
}

export default useFirstEffect

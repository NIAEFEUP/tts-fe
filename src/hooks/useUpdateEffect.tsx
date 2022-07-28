import { useEffect, useRef } from 'react'

const useUpdateEffect = (callback: Function, dependencies: any[]) => {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    callback()
  }, dependencies)
}

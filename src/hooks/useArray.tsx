import { useState } from 'react'

const useArray = (defaultValue: any[]) => {
  const [array, setArray] = useState<any[]>(defaultValue)

  function push(element: any) {
    setArray((a) => [...a, element])
  }

  function pop() {
    setArray((a) => a.slice(0, -1))
  }

  function filter(callback: any) {
    setArray((a) => a.filter(callback))
  }

  function update(index: number, newElement: any) {
    setArray((a) => [...a.slice(0, index), newElement, ...a.slice(index + 1, a.length)])
  }

  function remove(index: number) {
    setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)])
  }

  function clear() {
    setArray([])
  }

  return { array, set: setArray, push, pop, filter, update, remove, clear }
}

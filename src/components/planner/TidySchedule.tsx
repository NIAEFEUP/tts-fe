import { SparklesIcon } from '@heroicons/react/outline'
import React from 'react'

type Props = {
  showGridHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const TidySchedule = ({ showGridHook }: Props) => {
  const [showGrid, setShowGrid] = showGridHook

  return (
    <button
      type="button"
      onClick={() => setShowGrid(!showGrid)}
      className="hidden h-auto w-full items-center justify-center space-x-2 rounded border-2 border-transparent bg-primary px-2 py-3 
      text-xs font-medium text-white transition hover:opacity-80 lg:flex xl:w-min xl:space-x-0 xl:px-4 xl:text-sm"
    >
      <span className="flex xl:hidden">Minimal</span>
      <SparklesIcon className="h-4 w-4 xl:h-5 xl:w-5" />
    </button>
  )
}

export default TidySchedule

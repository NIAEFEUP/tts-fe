import { useState } from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

const BackToTop = () => {
  const [hidden, setHidden] = useState(true)

  window.onscroll = () => {
    setHidden(window.scrollY < 500)
  }

  return (
    <button
      hidden={hidden}
      onClick={() => document.getElementById('layout').scrollIntoView()}
      className="fixed bottom-5 left-5 z-50 rounded-full bg-gray-400 p-2 text-white transition-all hover:bg-primary
        dark:bg-darkish dark:text-white hover:dark:bg-primary xl:p-3"
    >
      <ChevronUpIcon className="h-6 w-6" />
    </button>
  )
}

export default BackToTop

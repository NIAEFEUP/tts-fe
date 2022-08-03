import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'

type Props = {
  question: string
  answer: string
}

const FaqBox = ({ question, answer }: Props) => {
  const [dropDownIsOpen, changeState] = useState(false)
  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-2 p-2">
        {question}
        <div
          onClick={() => {
            changeState(!dropDownIsOpen)
          }}
        >
          {dropDownIsOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400 transition  duration-100 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400 transition  duration-100 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" />
          )}
        </div>
      </div>

      <hr className="" />
      {dropDownIsOpen ? <div className="bg-gray-300 p-2 text-justify dark:bg-lightNavy">{answer}</div> : null}
    </div>
  )
}

export default FaqBox

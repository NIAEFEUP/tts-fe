//import classNames from 'classnames'
import { useState } from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/outline'


type Props = {
  question: string
  answer: string
}

const FaqBox = ({ question, answer }: Props) => {
  const [dropDownIsOpen, changeState] = useState(false)
  return (
    <div >
      <div >
        {question}
        <div onClick={() => { changeState(!dropDownIsOpen); }}>
          {dropDownIsOpen ? <ChevronUpIcon /> : <ChevronDownIcon/>}
        </div>
      </div>
      {dropDownIsOpen ?
        <div >
          {answer}
        </div> : null
      }
    </div>
  )
}

export default FaqBox

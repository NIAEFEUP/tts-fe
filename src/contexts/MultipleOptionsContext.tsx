import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { MultipleOptions } from '../@types'

interface MultipleOptionsContent {
  multipleOptions: MultipleOptions
  setMultipleOptions: Dispatch<SetStateAction<MultipleOptions>>
  selectedOption: number
  setSelectedOption: Dispatch<SetStateAction<number>>
}

const MultipleOptionsContext: Context<MultipleOptionsContent> = createContext({
  multipleOptions: [],
  setMultipleOptions: () => { },
  selectedOption: 0,
  setSelectedOption: () => { },
});

export default MultipleOptionsContext

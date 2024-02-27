import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { Major } from '../@types/new_index'

interface MajorContextContent {
  majors: Major[]
  setMajors: Dispatch<SetStateAction<Major[]>>
  selectedMajor: Major
  setSelectedMajor: Dispatch<SetStateAction<Major>>
}

const MajorContext: Context<MajorContextContent> = createContext({
  majors: [],
  setMajors: (majors: Major[]) => {},
  selectedMajor: null,
  setSelectedMajor: (selectedMajor: Major) => {},
})

export default MajorContext

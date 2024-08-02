import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { Major } from '../@types'

interface MajorContextContent {
  majors: Major[]
  setMajors: Dispatch<SetStateAction<Major[]>>
}

const MajorContext: Context<MajorContextContent> = createContext({
  majors: [],
  setMajors: (majors: Major[]) => {}
})

export default MajorContext

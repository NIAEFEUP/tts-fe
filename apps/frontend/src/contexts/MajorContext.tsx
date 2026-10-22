import { Context } from 'react'
import { createContext } from 'react'
import { Major } from '../@types'

interface MajorContextContent {
  majors: Major[]
  majorsError: unknown
  retryMajors: () => void
}

const MajorContext: Context<MajorContextContent> = createContext({
  majors: [],
  majorsError: null,
  retryMajors: () => {},
})

export default MajorContext

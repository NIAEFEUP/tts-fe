import { Context } from 'react'
import { createContext } from 'react'
import { Major } from '../@types'

interface MajorContextContent {
  majors: Major[]
}

const MajorContext: Context<MajorContextContent> = createContext({
  majors: [],
})

export default MajorContext

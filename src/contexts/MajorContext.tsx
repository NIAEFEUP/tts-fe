import { Context, Dispatch, SetStateAction, useState } from 'react'
import { createContext } from 'react'
import { Major } from '../@types/new_index'

interface MajorContextContent {
  majors: Major[]
  setMajors: Dispatch<SetStateAction<Major[]>>
  majorIndex: number
  setMajorIndex: Dispatch<SetStateAction<number>>
}

const MajorContext: Context<MajorContextContent> = createContext({
  majors: [],
  setMajors: (majors: Major[]) => {},
  majorIndex: null,
  setMajorIndex: (majorIndex: number) => {},
})

export default MajorContext

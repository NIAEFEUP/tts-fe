import React from 'react'
import { getClassType } from '../../utils'
import { Checkbox } from '../ui/new/checkbox'

type Props = {
  types: string[]
  hiddenLessonsTypes: string[]
  setHiddenLessonsTypes: (hiddenLessonsTypes: string[]) => void
}

const ScheduleTypes = ({ types, hiddenLessonsTypes, setHiddenLessonsTypes }: Props) => {
  const handleToggle = (lessonType: string) => {
    if (hiddenLessonsTypes.includes(lessonType)) {
      setHiddenLessonsTypes(hiddenLessonsTypes.filter((type) => type !== lessonType))
    } else {
      setHiddenLessonsTypes([...hiddenLessonsTypes, lessonType])
    }
  }

  return (
    <>
      {types.map((lessonType) => {
        const isHidden = hiddenLessonsTypes.includes(lessonType)

        return (
          <div
            className="group relative flex items-center gap-1.5 overflow-x-hidden rounded-lg px-1 py-0.5 lg:gap-1"
            key={lessonType}
          >
            <Checkbox
              checked={!isHidden}
              onChange={() => handleToggle(lessonType)}
              style={
                {
                  '--color-accent': `var(--color-schedule-${lessonType.toLowerCase()})`,
                  '--color-accent-foreground': '#fff',
                } as React.CSSProperties
              }
            />

            {getClassType(lessonType)}

            <div className="z-5 absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-linear-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
          </div>
        )
      })}
    </>
  )
}

export default ScheduleTypes

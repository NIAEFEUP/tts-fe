import { useState } from 'react'
import { EyeSlashIcon } from '@heroicons/react/24/outline'
import { EyeIcon } from 'lucide-react'
import { getClassType } from '../../utils'

type Props = {
  types: string[]
}

const ScheduleTypes = ({ types } : Props) => {
  const [hiddenLessonsTypes, setHiddenLessonsTypes] = useState<String[]>([])

  return (
    <>
      {types.map((lessonType) => (
        <label
          className="group relative flex items-center gap-1.5 overflow-x-hidden rounded-lg hover:cursor-pointer lg:gap-1"
          key={`lesson-type-${lessonType}`}
        >
          <input
            type="checkbox"
            className="peer hidden"
            checked={hiddenLessonsTypes.includes(lessonType)}
            onChange={(e) => {
              if (e.target.checked) {
                setHiddenLessonsTypes((prev) => [...prev, lessonType])
              } else {
                setHiddenLessonsTypes((prev) => prev.filter((type) => type !== lessonType))
              }
            }}
          />

          <span
            className={`flex h-4 w-4 items-center justify-center rounded 2xl:h-4 2xl:w-4 
          ${'bg-schedule-' + lessonType.toLowerCase() + '/80'}`}
            style={{ marginRight: '5px' }}
          >
            {hiddenLessonsTypes.find((lesson) => lesson === lessonType) ? (
              <EyeSlashIcon className={`h-3 w-3 text-white`} />
            ) : (
              <EyeIcon className={`h-3 w-3 text-white`} />
            )}
          </span>

          <span className="cursor-pointer select-none peer-checked:line-through">{getClassType(lessonType)}</span>

          {/* Shine box */}
          <div className="z-5 absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        </label>
      ))}
    </>
  )
}

export default ScheduleTypes

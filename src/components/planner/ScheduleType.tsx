import { EyeSlashIcon } from '@heroicons/react/24/outline'
import { EyeIcon } from 'lucide-react'
import { getClassType } from '../../utils'

type Props = {
  types: String[],
  hiddenLessonsTypes: String[],
  setHiddenLessonsTypes: (hiddenLessonsTypes: String[]) => void
}

const ScheduleTypes = ({ types, hiddenLessonsTypes, setHiddenLessonsTypes }: Props) => {
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
                setHiddenLessonsTypes([...hiddenLessonsTypes, lessonType])
              } else {
                setHiddenLessonsTypes(hiddenLessonsTypes.filter((type) => type !== lessonType))
              }
            }}
          />

          <span
            className={`flex h-4 w-4 items-center justify-center rounded 2xl:h-4 2xl:w-4 peer-checked:opacity-50
          ${'bg-schedule-' + lessonType.toLowerCase() + '/80'}`}
            style={{ marginRight: '5px' }}
          />

          <span className="cursor-pointer select-none peer-checked:line-through peer-checked:opacity-50">{getClassType(lessonType)}</span>

          {/* Shine box */}
          <div className="z-5 absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        </label>
      ))}
    </>
  )
}

export default ScheduleTypes

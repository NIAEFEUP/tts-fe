import { getClassType} from '../../utils'
import { Badge } from '../ui/badge'

type Props = {
  types: string[],
  hiddenLessonsTypes: string[],
  setHiddenLessonsTypes: (hiddenLessonsTypes: string[]) => void
}

const ScheduleTypes = ({ types, hiddenLessonsTypes, setHiddenLessonsTypes }: Props) => {
  return (
    <>
    <div className="flex flex-wrap gap-4 items-center"></div>
      {types.map((lessonType) => {
        const isHidden = hiddenLessonsTypes.includes(lessonType)
        return (
          <label
            className="group relative flex items-center gap-1.5 overflow-x-hidden rounded-lg hover:cursor-pointer lg:gap-1"
            key={`lesson-type-${lessonType}`}
          >
            <input
              type="checkbox"
              className="peer hidden"
              checked={isHidden}
              onChange={(e) => {
                if (e.target.checked) {
                  setHiddenLessonsTypes([...hiddenLessonsTypes, lessonType])
                } else {
                  setHiddenLessonsTypes(hiddenLessonsTypes.filter((type) => type !== lessonType))
                }
              }}
            />

            <span
              className={`
                flex h-4 w-4 items-center justify-center rounded
                ${'bg-schedule-' + lessonType.toLowerCase() + '/80'}
              `}
            >
              {!isHidden &&    
              (<span className="absolute text-white text-[11px] font-semibold leading-none">
                ✓
              </span>)
              }
            </span>

        
            <span >
              {getClassType(lessonType)}
            </span>

            <div className="z-5 absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
         
          </label>
        )
      })}
    </>
  )
}

export default ScheduleTypes
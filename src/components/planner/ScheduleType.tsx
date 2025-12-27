import { getClassType} from '../../utils'
import { Badge } from '../ui/badge'

type Props = {
  types: string[],
  hiddenLessonsTypes: string[],
  setHiddenLessonsTypes: (hiddenLessonsTypes: string[]) => void
}

const ScheduleTypes = ({ types, hiddenLessonsTypes, setHiddenLessonsTypes }: Props) => {
  const toggleType = (lessonType: string) => {
    if (hiddenLessonsTypes.includes(lessonType)) {
      setHiddenLessonsTypes(hiddenLessonsTypes.filter(t => t !== lessonType))
    } else {
      setHiddenLessonsTypes([...hiddenLessonsTypes, lessonType])
    }
  }
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {types.map((lessonType) => {
          const isHidden = hiddenLessonsTypes.includes(lessonType)

          return (
            <Badge
              key={lessonType}
              onClick={() => toggleType(lessonType)}
              variant={isHidden ? 'outline' : 'secondary'}
              className={`
                cursor-pointer select-none transition-all
                hover:opacity-90
              `}
            >
              <span
                className={`
                  flex h-4 w-4 items-center justify-center rounded mr-2
                  ${'bg-schedule-' + lessonType.toLowerCase() + '/80'}
                  peer-checked:opacity-50
                `}
              >
                {!isHidden &&    
                (<span className="absolute text-white text-[11px] font-semibold leading-none">
                  ✓
                </span>)
                }
              </span>
              {getClassType(lessonType)}
            </Badge>
          )
        })}
      </div>
    </>
  )
}

export default ScheduleTypes
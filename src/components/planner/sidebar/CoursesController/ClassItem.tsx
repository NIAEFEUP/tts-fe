import { useContext, useMemo, useState } from 'react'
import { ClassInfo } from '../../../../@types/new_index'
import { DropdownMenuCheckboxItem } from '../../../ui/dropdown-menu'
import { ExclamationTriangleIcon, EyeIcon } from '@heroicons/react/20/solid'
import { getLessonBoxTime, convertWeekday } from '../../../../utils'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'

type Props = {
  course_id: number,
  classInfo: ClassInfo
  displayed?: boolean
  checked?: boolean
  conflict?: boolean
  onSelect?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const ClassItem = ({ course_id, classInfo, displayed, checked, conflict, onSelect, onMouseEnter, onMouseLeave }: Props) => {

  const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext)

  const selectOption = () => {
    const multipleOptionsEntry = multipleOptions[selectedOption].course_options.find((option) => option.course_id === course_id);
    if(multipleOptionsEntry) {
      multipleOptionsEntry.picked_class_id = classInfo.id;
      setMultipleOptions({...multipleOptions})
    }
    onSelect();
  }

  return (
    <DropdownMenuCheckboxItem
      onSelect={() => selectOption()}
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
    >
      <div className="grow">
        <span className="text-sm tracking-tighter">{classInfo.name}</span>
        <div>
          {classInfo.slots.map((slot, idx) => (
            <div key={`${classInfo.name}-${idx}`} className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{slot.type}</span>
              {/* <span className="text-xs text-gray-500">{convertWeekday(slot.day)}</span> */}
              {/* <span className="text-xs text-gray-500">{getLessonBoxTime(slot)}</span> */}
              <span className="text-xs text-gray-500">{slot.location}</span>
              <span className="text-xs text-gray-500">
                {slot.professors.map((professor) => professor.acronym).join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className={`absolute inset-y-0 right-0 flex items-center pr-3 text-rose-700 ${true ? 'block' : 'hidden'}`}>
        <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
      </span>
    </DropdownMenuCheckboxItem>
  )
}

export default ClassItem

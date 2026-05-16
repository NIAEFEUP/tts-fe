import { CheckBadgeIcon } from '@heroicons/react/24/outline'
import { CourseInfo } from '../../../../@types'
import { Button } from '../../../ui/new/button'
import { Checkbox } from '../../../ui/new/checkbox'
import { IncludeCourseUnitCard } from './cards/IncludeCourseUnitCard'
import ScheduleContext from '../../../../contexts/ScheduleContext'
import { useContext } from 'react'

type Props = {
  setSelectedCourseUnits: React.Dispatch<React.SetStateAction<CourseInfo[]>>
  enrolledCourseUnits: CourseInfo[]
  selectedCourseUnits: CourseInfo[]
  setSelectingCourseUnits: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChooseIncludedCourseUnits = ({
  selectedCourseUnits,
  setSelectedCourseUnits,
  enrolledCourseUnits,
  setSelectingCourseUnits,
}: Props) => {
  const { originalExchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext)

  return (
    <div className="flex flex-col gap-y-2 h-full">
      <div className="flex flex-row items-center gap-2 mb-2">
        <Checkbox
          id="selecting-course-units"
          onChange={(e) => {
            if (!e.target.checked) {
              setSelectedCourseUnits([])
            } else {
              setSelectedCourseUnits(enrolledCourseUnits)
            }
          }}
          checked={selectedCourseUnits.length === enrolledCourseUnits.length && enrolledCourseUnits.length > 0}
        />
        <label htmlFor="selecting-course-units" className="text-sm cursor-pointer select-none">
          Selecionar todas as disciplinas
        </label>
      </div>
      {/* Scrollable container */}
      <div className="flex-1 overflow-auto flex flex-col gap-y-2 no-scrollbar">
        {enrolledCourseUnits?.map((courseInfo: CourseInfo) => (
          <IncludeCourseUnitCard
            key={'include-course-unit-' + courseInfo.id}
            courseInfo={courseInfo}
            selectedCourseUnitsHook={[selectedCourseUnits, setSelectedCourseUnits]}
          />
        ))}
      </div>

      <Button
        size="md"
        className="w-full success-button hover:bg-white flex flex-row gap-x-2 mt-2"
        onClick={() => {
          setSelectingCourseUnits(false)
          setExchangeSchedule(originalExchangeSchedule)
        }}
      >
        Confirmar disciplinas
        <CheckBadgeIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}

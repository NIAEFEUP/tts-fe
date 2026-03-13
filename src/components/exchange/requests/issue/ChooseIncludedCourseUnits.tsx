import { CheckBadgeIcon } from '@heroicons/react/24/outline'
import { CourseInfo } from '../../../../@types'
import { Button } from '../../../ui/button'
import { Checkbox } from '../../../ui/checkbox'
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
    <div className="flex h-full flex-col gap-y-2">
      <div className="mb-2 flex flex-row gap-2">
        <Checkbox
          id="selecting-course-units"
          onCheckedChange={(checked) => {
            if (!checked) {
              setSelectedCourseUnits([])
            } else {
              setSelectedCourseUnits(enrolledCourseUnits)
            }
          }}
          checked={selectedCourseUnits.length === enrolledCourseUnits.length}
        />
        <label htmlFor="selecting-course-units">Selecionar todas as disciplinas</label>
      </div>
      {/* Scrollable container */}
      <div className="flex flex-1 flex-col gap-y-2 overflow-auto">
        {enrolledCourseUnits?.map((courseInfo: CourseInfo) => (
          <IncludeCourseUnitCard
            key={'include-course-unit-' + courseInfo.id}
            courseInfo={courseInfo}
            selectedCourseUnitsHook={[selectedCourseUnits, setSelectedCourseUnits]}
          />
        ))}
      </div>

      <Button
        className="success-button mt-2 flex w-full flex-row gap-x-2 hover:bg-white"
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

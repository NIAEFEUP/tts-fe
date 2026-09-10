import { CourseInfo } from '../../../../../@types'
import { Card, CardHeader, CardTitle } from '../../../../ui/card'
import { Checkbox } from '../../../../ui/new/checkbox'

type Props = {
  courseInfo: CourseInfo
  selectedCourseUnitsHook: [CourseInfo[], React.Dispatch<React.SetStateAction<CourseInfo[]>>]
}

export const IncludeCourseUnitCard = ({ courseInfo, selectedCourseUnitsHook }: Props) => {
  const [selectedCourseUnits, setSelectedCourseUnits] = selectedCourseUnitsHook

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center gap-4">
        <CardTitle className="text-md">{courseInfo.name}</CardTitle>
        <Checkbox
          id={`${courseInfo.id}-checkbox`}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCourseUnits([...selectedCourseUnits, courseInfo])
            } else {
              setSelectedCourseUnits(
                selectedCourseUnits.filter((currentCourseInfo) => currentCourseInfo.id !== courseInfo.id),
              )
            }
          }}
          checked={selectedCourseUnits.some((currentCourseInfo) => currentCourseInfo.id === courseInfo.id)}
        />
      </CardHeader>
    </Card>
  )
}

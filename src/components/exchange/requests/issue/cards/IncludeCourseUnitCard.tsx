import { Dispatch, SetStateAction } from "react"
import { CourseInfo, CreateRequestData } from "../../../../../@types"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card"
import { Checkbox } from "../../../../ui/checkbox"

type Props = {
  courseInfo: CourseInfo
  selectedCourseUnitsHook: [CourseInfo[], React.Dispatch<React.SetStateAction<CourseInfo[]>>]
}

export const IncludeCourseUnitCard = ({ courseInfo, selectedCourseUnitsHook }: Props) => {
  const [selectedCourseUnits, setSelectedCourseUnits] = selectedCourseUnitsHook;

  return <Card>
    <CardHeader className="flex flex-row justify-between items-center gap-4">
      <CardTitle className="text-md">{courseInfo.name}</CardTitle>
      <Checkbox
        id={`${courseInfo.id}-checkbox`}
        onCheckedChange={(checked) => {
          if (checked) {
            setSelectedCourseUnits([...selectedCourseUnits, courseInfo]);
          } else {
            setSelectedCourseUnits(selectedCourseUnits.filter((currentCourseInfo) => currentCourseInfo.id !== courseInfo.id));

          }
        }}
        checked={selectedCourseUnits.some((currentCourseInfo) => currentCourseInfo.id === courseInfo.id)}
      />
    </CardHeader>
  </Card>
}

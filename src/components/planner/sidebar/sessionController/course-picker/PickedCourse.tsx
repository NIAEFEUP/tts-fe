import { CourseInfo } from '../../../../../@types/new_index'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../ui/card'
import { Separator } from '../../../../ui/separator'

const PickedCourse = ({ course: CourseInfo }) => {
  return (
    <Card className="flex justify-between">
      <CardHeader>
        <CardTitle>{CourseInfo.name}</CardTitle>
        <CardDescription>({CourseInfo.acronym})</CardDescription>
      </CardHeader>
      <CardContent />
      <Separator orientation="vertical" />
      <CardFooter>
        <p>{CourseInfo.ects} ECTS</p>
      </CardFooter>
    </Card>
  )
}

export default PickedCourse

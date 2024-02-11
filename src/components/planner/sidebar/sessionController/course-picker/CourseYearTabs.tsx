import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs'
import { CourseInfo } from '../../../../../@types/new_index'
import { CourseYearCheckboxes } from './CourseYearCheckboxes'

type Props = {
  courses: CourseInfo[][]
  pickedCourses: CourseInfo[]
}

const CourseYearTabs = ({ courses, pickedCourses }: Props) => {
  const isCourseChecked = (idx) => {
    for (const course of pickedCourses) {
      if (course.id === idx) {
        return true
      }
    }

    return false
  }

  return (
    <Tabs defaultValue={`${courses.length}`} className="w-[400px]">
      <TabsList>
        {courses.map((yearCourses, idx) => (
          <TabsTrigger value={`${idx + 1}`}>`${idx + 1}º Ano`</TabsTrigger>
        ))}
      </TabsList>

      {courses.map((yearCourses, idx) => (
        <TabsContent value={`${idx + 1}`}>{<CourseYearCheckboxes courses={yearCourses} />}</TabsContent>
      ))}
    </Tabs>
  )
}

import { useContext } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs'
import { CourseInfo } from '../../../../../@types/new_index'
import { CourseYearCheckboxes } from './CourseYearCheckboxes'
import CourseContext from '../../../../../contexts/CourseContext'
import { groupCoursesByYear } from '../../../../../utils/utils'

type Props = {
  courses: CourseInfo[][]
  pickedCourses: CourseInfo[]
}

const CourseYearTabs = () => {
  const { pickedCourses, setPickedCourses, coursesInfo, setCoursesInfo } = useContext(CourseContext)

  const coursesByYear = groupCoursesByYear(coursesInfo)

  const isCourseChecked = (idx) => {
    for (const course of pickedCourses) {
      if (course.id === idx) {
        return true
      }
    }

    return false
  }

  return (
    <Tabs defaultValue={`${coursesByYear.length}`} className="w-full">
      <TabsList className="w-full">
        {coursesByYear.map((_, idx) => (
          <TabsTrigger key={idx} value={`${idx + 1}`} className="m-2 rounded bg-primary text-white">
            {`${idx + 1}º Ano`}
          </TabsTrigger>
        ))}
      </TabsList>

      {coursesByYear.map((yearCourses, idx) => (
        <TabsContent key={idx} value={`${idx + 1}`}>
          {<CourseYearCheckboxes courses={yearCourses} />}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default CourseYearTabs

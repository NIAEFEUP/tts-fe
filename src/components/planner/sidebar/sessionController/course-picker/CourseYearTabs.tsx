import { useContext, useState } from 'react'
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
  const { pickedCourses, coursesInfo } = useContext(CourseContext)
  const [selectedTab, setSelectedTab] = useState('1')

  const coursesByYear = groupCoursesByYear(coursesInfo)

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="w-full">
        {coursesByYear.map((_, idx) => (
          <TabsTrigger key={idx} value={`${idx + 1}`}>
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

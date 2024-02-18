import { useContext, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs'
import { CourseYearCheckboxes } from './CourseYearCheckboxes'
import CourseContext from '../../../../../contexts/CourseContext'
import { groupCoursesByYear } from '../../../../../utils/utils'
import { ScrollArea } from '../../../../ui/scroll-area'

const CourseYearTabs = () => {
  const { coursesInfo } = useContext(CourseContext)
  const [selectedTab, setSelectedTab] = useState('1')

  const coursesByYear = groupCoursesByYear(coursesInfo)

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="box-border w-[27.5rem]">
      <TabsList className="w-full">
        {coursesByYear.map((_, idx) => (
          <TabsTrigger key={idx} value={`${idx + 1}`}>
            {`${idx + 1}º Ano`}
          </TabsTrigger>
        ))}
      </TabsList>
      {coursesByYear.map((yearCourses, idx) => (
        <TabsContent key={idx} value={`${idx + 1}`}>
          <ScrollArea className="h-[200px] px-3">{<CourseYearCheckboxes courses={yearCourses} />}</ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default CourseYearTabs

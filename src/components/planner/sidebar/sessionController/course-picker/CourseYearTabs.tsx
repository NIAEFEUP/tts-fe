import { useContext, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs'
import { CourseYearCheckboxes } from './CourseYearCheckboxes'
import CourseContext from '../../../../../contexts/CourseContext'
import { groupCoursesByYear } from '../../../../../utils'
import { ScrollArea } from '../../../../ui/scroll-area'
import { isSubset } from '../../../../../utils'

const CourseYearTabs = () => {
  const { coursesInfo, pickedCourses, setPickedCourses } = useContext(CourseContext)
  const [selectedTab, setSelectedTab] = useState('1')
  const coursesByYear = groupCoursesByYear(coursesInfo)

  const handleClick = (event, idx) => {
    switch (event.detail) {
      case 1: {
        break
      }
      default: {
        let newPickedCourses = new Set([...pickedCourses])
        const yearCourses = new Set(coursesByYear[parseInt(idx)])
        if (isSubset(yearCourses, newPickedCourses, (course1, course2) => course1.id === course2.id)) {
          newPickedCourses = new Set(
            pickedCourses.filter((pickedCourse) => pickedCourse.course_unit_year !== parseInt(selectedTab))
          )
        } else {
          newPickedCourses = new Set([...pickedCourses, ...coursesByYear[parseInt(selectedTab) - 1]])
        }

        setPickedCourses([...newPickedCourses.values()])
        break
      }
    }
  }

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="w-full">
        {coursesByYear.map((_, idx) => (
          <TabsTrigger
            className="select-none"
            onClick={(event) => handleClick(event, idx)}
            key={idx}
            value={`${idx + 1}`}
          >
            {`${idx + 1}º Ano`}
          </TabsTrigger>
        ))}
      </TabsList>
      {coursesByYear.map((yearCourses, idx) => {
        return (
          <TabsContent key={idx} value={`${idx + 1}`}>
            <ScrollArea className="h-[200px] px-3">
              <CourseYearCheckboxes courses={yearCourses} />
            </ScrollArea>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

export default CourseYearTabs

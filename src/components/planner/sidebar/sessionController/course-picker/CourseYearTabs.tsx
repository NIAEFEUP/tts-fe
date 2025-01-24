import { useContext, useState } from 'react'
import { CourseYearCheckboxes } from './CourseYearCheckboxes'
import { ScrollArea } from '../../../../ui/scroll-area'
import CoursePickerContext from '../../../../../contexts/coursePicker/CoursePickerContext'
import MultipleOptionsContext from '../../../../../contexts/MultipleOptionsContext'
import { groupCoursesByYear, isSubset, replaceCourseOptions } from '../../../../../utils'
import { NoMajorSelectedSVG } from '../../../../svgs'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../ui/tabs'
import { CourseInfo } from '../../../../../@types'

//TODO: Check this code, too ugly
const CourseYearTabs = () => {
  const { coursesInfo, checkboxedCourses, setCheckboxedCourses } = useContext(CoursePickerContext)
  const { setMultipleOptions, multipleOptions } = useContext(MultipleOptionsContext)
  const [selectedTab, setSelectedTab] = useState('1')
  const coursesByYear = groupCoursesByYear(coursesInfo)

  /*
   * Handle a double click in a year tab which function as a
   * select all/deselect all course units from that year
   */
  const handleClick = (idx) => {
    let newCheckboxedCourses = [...checkboxedCourses]
    const yearCourses = coursesByYear[parseInt(idx)]
    if (isSubset(yearCourses, newCheckboxedCourses, (course1: CourseInfo, course2: CourseInfo) => course1.id === course2.id)) {
      // removes
      newCheckboxedCourses = newCheckboxedCourses.filter((pickedCourse) => pickedCourse.course_unit_year !== parseInt(selectedTab))
    } else {
      // adds
      newCheckboxedCourses = [...newCheckboxedCourses, ...coursesByYear[parseInt(selectedTab) - 1]]
    }

    // Remove duplicates
    for (let i = 0; i < newCheckboxedCourses.length; i++) {
      for (let j = i + 1; j < newCheckboxedCourses.length; j++) {
        if (newCheckboxedCourses[i].id === newCheckboxedCourses[j].id) {
          newCheckboxedCourses.splice(j--, 1)
        }
      }
    }

    setMultipleOptions(replaceCourseOptions(newCheckboxedCourses, multipleOptions))
    setCheckboxedCourses([...newCheckboxedCourses.values()])
  }

  return coursesByYear.length > 0 ? (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="w-full">
        {coursesByYear.map((_, idx) => (
          <TabsTrigger
            className="select-none"
            onDoubleClick={async () => handleClick(idx)}
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
            <ScrollArea className="h-[200px]">
              <CourseYearCheckboxes courses={yearCourses} />
            </ScrollArea>
          </TabsContent>
        )
      })}
    </Tabs>
  ) : (
    <div className="flex items-center justify-center">
      <NoMajorSelectedSVG />
    </div>
  )
}

export default CourseYearTabs

import { useContext, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../ui/tabs'
import { CourseYearCheckboxes } from './CourseYearCheckboxes'
import MultipleOptionsContext from '../../../../../contexts/MultipleOptionsContext'
import CourseContext from '../../../../../contexts/CourseContext'
import { groupCoursesByYear, replaceCourseOptions } from '../../../../../utils'
import { ScrollArea } from '../../../../ui/scroll-area'
import { isSubset } from '../../../../../utils'
import { NoMajorSelected } from '../../../../svgs'
import api from '../../../../../api/backend'

const CourseYearTabs = () => {
  const { coursesInfo, pickedCourses, setPickedCourses } = useContext(CourseContext)
  const { setMultipleOptions, multipleOptions } = useContext(MultipleOptionsContext)
  const [selectedTab, setSelectedTab] = useState('1')
  const coursesByYear = groupCoursesByYear(coursesInfo)
  const [checkboxList, setCheckboxList] = useState<boolean[]>([])

  const [getPickedCourseClasses, setGetPickedCourseClasses] = useState<boolean>(false);

  /*
   * Handle a double click in a year tab which function as a
   * select all/deselect all course units from that year
   */
  const handleClick = (idx) => {
    let newPickedCourses = [...pickedCourses]
    const yearCourses = coursesByYear[parseInt(idx)]
    if (isSubset(yearCourses, newPickedCourses, (course1, course2) => course1.id === course2.id)) {
      // removes
      newPickedCourses = pickedCourses.filter((pickedCourse) => pickedCourse.course_unit_year !== parseInt(selectedTab))
    } else {
      // adds
      newPickedCourses = [...pickedCourses, ...coursesByYear[parseInt(selectedTab) - 1]]
    }

    // Remove duplicates
    for (let i = 0; i < newPickedCourses.length; i++) {
      for (let j = i + 1; j < newPickedCourses.length; j++) {
        if (newPickedCourses[i].id === newPickedCourses[j].id) {
          newPickedCourses.splice(j--, 1)
        }
      }
    }

    setMultipleOptions(replaceCourseOptions(newPickedCourses, multipleOptions))
    setPickedCourses([...newPickedCourses.values()])
    setGetPickedCourseClasses(true);
  }

  useEffect(() => {
    let componentUmounted = false;

    const getClasses = async () => {
      if (!getPickedCourseClasses) return;

      const newPickedCourses = await api.getCoursesClasses([...pickedCourses]);

      if (!componentUmounted) {
        setPickedCourses(newPickedCourses)
        setGetPickedCourseClasses(false);
      }
    }

    getClasses();

    // Cleanup function
    return () => {
      componentUmounted = true;
    }
  }, [getPickedCourseClasses]);

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
            <ScrollArea className="h-[200px] px-3">
              <CourseYearCheckboxes courses={yearCourses} />
            </ScrollArea>
          </TabsContent>
        )
      })}
    </Tabs>
  ) : (
    <div className="flex items-center justify-center">
      <NoMajorSelected />
    </div>
  )
}

export default CourseYearTabs

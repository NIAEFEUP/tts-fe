import { useContext, useState, useEffect } from 'react'
import { CourseInfo } from '../../../../../@types'
import CourseContext from '../../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../../contexts/MultipleOptionsContext'
import { removeCourseOption, addCourseOption } from '../../../../../utils'
import { Checkbox } from '../../../../ui/checkbox'
import { Label } from '../../../../ui/label'


type Props = {
  courses: CourseInfo[]
}

export const CourseYearCheckboxes = ({ courses }: Props) => {
  const { setCheckboxedCourses, checkboxedCourses } = useContext(CourseContext)
  const { setMultipleOptions, multipleOptions } = useContext(MultipleOptionsContext)
  const [checkboxList, setCheckboxList] = useState<boolean[]>([])

  const toggleCourse = (idx: number) => {
    // Toggle the checkbox
    setCheckboxList((prev) => {
      const newCheckboxList = [...prev]
      newCheckboxList[idx] = !newCheckboxList[idx]
      return newCheckboxList
    })

    // Add or remove the course from the pickedCourses list
    if (checkboxedCourses.some((checkedCourse: CourseInfo) => checkedCourse.id === courses[idx].id)) {
      setMultipleOptions(removeCourseOption(courses[idx], multipleOptions))
      setCheckboxedCourses(checkboxedCourses.filter((checkedCourse: CourseInfo) => checkedCourse.id !== courses[idx].id))
    } else {
      setCheckboxedCourses([...checkboxedCourses, courses[idx]]);
      setMultipleOptions(addCourseOption(courses[idx], multipleOptions));
    }
  }

  /*
   * Update the checkboxList on load and when the pickedCourses changes
   * This happends when the user removes a course from the pickedCourses list
   */
  useEffect(() => {
    setCheckboxList(courses.map((course: CourseInfo) => checkboxedCourses.some((pickedCourse) => pickedCourse.id === course.id)))
  }, [courses, checkboxedCourses])

  return (
    <div className="flex flex-col justify-start gap-2 p-2">
      {courses.map((course: CourseInfo, courseIdx: number) => (
        <div key={`course-checkbox-${course.course_unit_year}-${course.id}`} className="flex items-center space-x-2">
          <Checkbox
            id={`checkbox-${courseIdx}`}
            title={course.name}
            checked={checkboxList[courseIdx]}
            onCheckedChange={() => toggleCourse(courseIdx)}
          />
          <Label htmlFor={`checkbox-${courseIdx}`} className="text-wrap leading-normal hover:cursor-pointer">
            {course.name + ' (' + course.acronym + ')'}
          </Label>
        </div>
      ))}
    </div>
  )
}

import { useContext } from 'react'
import { CourseInfo } from '../../../../../@types/new_index'
import CourseContext from '../../../../../contexts/CourseContext'
import { Checkbox } from '../../../../ui/checkbox'
import { Label } from '../../../../ui/label'

type Props = {
  courses: CourseInfo[]
}

export const CourseYearCheckboxes = ({ courses }) => {
  const { pickedCourses, setPickedCourses, coursesInfo, setCoursesInfo } = useContext(CourseContext)

  const isCourseChecked = (idx) => {
    return pickedCourses.some((course) => course.id === idx)
  }

  return (
    <div className="flex flex-col justify-start gap-2">
      {courses.map((course: CourseInfo, courseIdx: number) => (
        <div key={`course-checkbox-${course.course_unit_year}-${course.id}`}>
          <Checkbox
            id={`checkbox-${courseIdx}`}
            title={course.name}
            defaultChecked={isCourseChecked(course.id)}
            onCheckedChange={() => {
              console.log('Selecting!!')
              if (pickedCourses.includes(course)) {
                setPickedCourses(pickedCourses.filter((pickedCourse) => pickedCourse !== course))
              } else {
                setPickedCourses([...pickedCourses, course])
              }
            }}
          />
          <Label htmlFor={`checkbox-${courseIdx}`}> {course.name + ' (' + course.acronym + ')'}</Label>
        </div>
      ))}
    </div>
  )

  return (
    <div className="mt-2 ml-4  grid grid-flow-col grid-rows-8 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 p-1">
      {courses.map((course: CourseInfo, courseIdx: number) => (
        <div
          title={course.name}
          key={`course-checkbox-${course.course_unit_year}-${course.id}`}
          className="flex items-center transition"
          onSelect={() => {
            console.log('Selecting!!')
            if (pickedCourses.includes(course)) return
            setPickedCourses([...pickedCourses, course])
          }}
        >
          <input
            type="checkbox"
            className="checkbox"
            defaultChecked={true /*course.checked*/}
            id={`course-checkbox-${course.course_unit_year}-${courseIdx}`}
          />
          <label className="ml-1.5 block cursor-pointer text-sm dark:text-white">
            {course.name + ' (' + course.acronym + ')'}
          </label>
        </div>
      ))}
    </div>
  )
}

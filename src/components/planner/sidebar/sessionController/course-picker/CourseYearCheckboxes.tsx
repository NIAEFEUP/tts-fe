import { CourseInfo } from '../../../../../@types/new_index'

type Props = {
  courses: CourseInfo[]
}

export const CourseYearCheckboxes = ({ courses }) => {
  return (
    <>
      <div className="mt-2 ml-4 flex grid grid-flow-col grid-rows-8 flex-wrap items-center justify-center gap-x-1 gap-y-1.5 p-1">
        {courses.map((course: CourseInfo, courseIdx: number) => (
          <div
            title={course.name}
            key={`course-checkbox-${course.course_unit_year}-${course.id}`}
            className="flex items-center transition"
          >
            <input
              type="checkbox"
              className="checkbox"
              defaultChecked={true /*course.checked*/}
              id={`course-checkbox-${course.course_unit_year}-${courseIdx}`}
            />
            <label className="ml-1.5 block cursor-pointer text-sm dark:text-white">{course.name}</label>
          </div>
        ))}
      </div>
    </>
  )
}

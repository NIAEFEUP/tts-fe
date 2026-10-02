import { useContext, useMemo } from 'react'
import { ClassDescriptor } from '../@types'
import CourseContext from '../contexts/CourseContext'
import MultipleOptionsContext from '../contexts/MultipleOptionsContext'

export default (): ClassDescriptor[] => {
  const { pickedCourses } = useContext(CourseContext)
  const { multipleOptions, selectedOption } = useContext(MultipleOptionsContext)

  return useMemo(() => {
    const option = multipleOptions[selectedOption]
    const classes: ClassDescriptor[] = []

    for (const courseOption of option.course_options) {
      const course_info = pickedCourses.find((course) => course.id === courseOption.course_id)
      if (!course_info) continue
      const class_info = course_info.classes?.find((c) => c.id === courseOption.picked_class_id)
      if (class_info === undefined) continue
      classes.push({ courseInfo: course_info, classInfo: class_info })
    }

    return classes
  }, [multipleOptions, pickedCourses, selectedOption])
}

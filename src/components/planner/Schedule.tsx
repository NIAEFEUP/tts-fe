import '../../styles/schedule.css'
import { useEffect } from 'react'
import { CourseOptions } from '../../@types'

type Props = {
  courseOptionsHook: [CourseOptions, React.Dispatch<React.SetStateAction<CourseOptions>>]
}

const Schedule = ({ courseOptionsHook }: Props) => {
  const [courseOptions, setCourseOptions] = courseOptionsHook

  return (
    <div className="schedule">
      {courseOptions.map((courseOption, courseOptionIdx) => (
        <div key={courseOptionIdx}>
          <span>{courseOption.course.info.acronym}</span>
          {courseOption.option ? (
            <span>
              : <strong>{courseOption.option.class_name}</strong>
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default Schedule

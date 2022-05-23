import '../../styles/schedule.css'
import { CourseOptions } from '../../@types'

type Props = {
  courseOptions: CourseOptions
}

const Schedule = ({ courseOptions }: Props) => {
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

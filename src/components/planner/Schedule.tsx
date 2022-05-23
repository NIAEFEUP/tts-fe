import '../../styles/schedule.css'
import { CourseOptions } from '../../@types'

type Props = {
  courseOptions: CourseOptions
}

const Schedule = ({ courseOptions }: Props) => {
  return (
    <div className="schedule">
      <SchedulesText courseOptions={courseOptions} />
    </div>
  )
}

const SchedulesText = ({ courseOptions }: Props) => (
  <>
    {courseOptions.map((courseOption, courseOptionIdx) => (
      <div key={courseOptionIdx}>
        <span>{courseOption.course.info.acronym}</span>
        {courseOption.option && (
          <span>
            : <strong>{courseOption.option.class_name}</strong>
          </span>
        )}
      </div>
    ))}
  </>
)

export default Schedule

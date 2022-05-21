import React from 'react'
import '../../styles/schedule.css'
import { CourseOptions } from '../../@types'

type Props = {
  selectedHook: [CourseOptions, React.Dispatch<React.SetStateAction<CourseOptions>>]
}

const Schedule = ({ selectedHook }: Props) => {
  const [selected, setSelected] = selectedHook

  return (
    <div className="schedule">
      {selected.map((courseOption, courseOptionIdx) => (
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

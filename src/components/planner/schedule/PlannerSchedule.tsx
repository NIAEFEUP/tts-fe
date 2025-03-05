import { useContext, useEffect, useState } from "react";
import { ClassDescriptor, CourseInfo, CourseOption, ImportedCourses, SlotInfo } from "../../../@types";
import CourseContext from "../../../contexts/CourseContext";
import MultipleOptionsContext from "../../../contexts/MultipleOptionsContext";
import Schedule from "../Schedule";
import { importSchedule } from "../../../utils/ImportSchedule";

const PlannerSchedule = () => {
  const { pickedCourses } = useContext(CourseContext);
  const { multipleOptions, selectedOption } = useContext(MultipleOptionsContext);
  const [classes, setClasses] = useState<ClassDescriptor[]>([]);
  const [slots, setSlots] = useState<SlotInfo[]>([]);

  useEffect(() => {
    //TODO: Improvements by functional programming
    const newClasses = []
    const option = multipleOptions[selectedOption]

    for (let i = 0; i < option.course_options.length; i++) {
      const course_info = pickedCourses.find((course) => course.id === option.course_options[i].course_id)
      if (!course_info) continue;
      const class_info = course_info.classes?.find(
        (class_info) => class_info.id === option.course_options[i].picked_class_id
      )

      if (course_info === undefined || class_info === undefined) continue
      newClasses.push({
        courseInfo: course_info,
        classInfo: class_info,
      })
    }

    setClasses(newClasses)
    setSlots(newClasses.map((newClass) => newClass.classInfo.slots).flat())
  }, [multipleOptions, pickedCourses, selectedOption])


  return (
    <Schedule
      classes={classes}
      slots={slots}
    />
  )
}

export default PlannerSchedule;

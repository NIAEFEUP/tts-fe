import { useState, useEffect, useContext } from 'react'
import ClassSelector from './ClassSelector'
import { CourseInfo, CourseOption } from '../../../../@types'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import ClassSelectorContext from '../../../../contexts/classSelector/ClassSelectorContext'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'

type Props = {
  course: CourseInfo,
  selectedClassIdCallback?: (selectedClassId: number | null) => void
}

/**
 * This component is used to render ClassSelector with injected dependencies
*/
export const PlannerClassSelector = ({
  course,
  selectedClassIdCallback,
}: Props) => {
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext)
  const courseOption: CourseOption = multipleOptions[selectedOption].course_options.find((opt) => opt.course_id === course.id)
  const [locked, setLocked] = useState(courseOption?.locked)
  const [preview, setPreview] = useState<number | null>(null)

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [display, setDisplay] = useState(courseOption?.picked_class_id)

  useEffect(() => {
    if (selectedClassIdCallback) selectedClassIdCallback(selectedClassId)
  }, [selectedClassId])

  useEffect(() => {
    const course_options = multipleOptions[selectedOption].course_options;
    const option = course_options.filter((option) => option.course_id === course.id && option.picked_class_id !== null)

    if (option.length === 0) {
      setSelectedClassId(null);
      setDisplay(null);
      return;
    }

    if (!preview) setSelectedClassId(option[0].picked_class_id);
    setDisplay(option[0].picked_class_id);
  }, [selectedOption, multipleOptions, course.id]);

  // Restores into multiple options the picked_class_id prior to when the user started previewing
  const removePreview = () => {
    const newMultipleOptions = [...multipleOptions];

    const newCourseOptions: CourseOption[] = newMultipleOptions[selectedOption].course_options.map((c: CourseOption) => {
      if (c.course_id === course.course_unit_id) {
        c.picked_class_id = selectedClassId
      }

      return c;
    });

    newMultipleOptions[selectedOption].course_options = newCourseOptions;
    setMultipleOptions(newMultipleOptions);

    setPreview(null);
  }

  const toggleLocker = () => {
    const newMultipleOptions = [...multipleOptions];
    const courseOptions = newMultipleOptions[selectedOption].course_options.map(opt => {
      if (opt.course_id === course.id) {
        return { ...opt, locked: !locked };
      }
      return opt;
    });
    newMultipleOptions[selectedOption].course_options = courseOptions;
    setMultipleOptions(newMultipleOptions);
    setLocked(!locked)

    AnalyticsTracker.trackFeature(Feature.LOCK_TOGGLE);
  }

  useEffect(() => {
    setLocked(courseOption?.locked)
  }, [selectedOption]);

  return (
    <ClassSelectorContext.Provider value={{
      selectedClassId,
      setSelectedClassId,
      display,
      setDisplay,
      preview,
      setPreview,
      removePreview,
      locked,
      setLocked,
      toggleLocker,
      courseOption
    }}>
      <ClassSelector
        course={course}
      />
    </ClassSelectorContext.Provider>
  )
}

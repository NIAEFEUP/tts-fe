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
export const ExchangeClassSelector = ({
  course,
  selectedClassIdCallback,
}: Props) => {
  const [preview, setPreview] = useState<number | null>(null)

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [display, setDisplay] = useState(null)

  useEffect(() => {
    if (selectedClassIdCallback) selectedClassIdCallback(selectedClassId)
  }, [selectedClassId])

  useEffect(() => {
   
  }, []);

  // Restores into multiple options the picked_class_id prior to when the user started previewing
  const removePreview = () => {
    
  }

  return (
    <ClassSelectorContext.Provider value={{
      selectedClassId,
      setSelectedClassId,
      display,
      setDisplay,
      preview,
      setPreview,
      removePreview,
      locked: null,
      setLocked: null,
      toggleLocker: null,
      courseOption: null
    }}>
      <ClassSelector
        course={course}
        lockFunctionality={false}
      />
    </ClassSelectorContext.Provider>
  )
}

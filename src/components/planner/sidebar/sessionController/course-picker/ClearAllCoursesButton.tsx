import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import CourseContext from '../../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../../contexts/MultipleOptionsContext'
import { removeAllCourseOptions } from '../../../../../utils'
import { Button } from '../../../../ui/new/newButton'
import { DialogClose } from '../../../../ui/new/dialog'

export const ClearAllCoursesButton = () => {
  const { setCheckboxedCourses } = useContext(CourseContext)
  const { multipleOptions } = useContext(MultipleOptionsContext)

  return (
    <>
      <Button
        onClick={() => {
          setCheckboxedCourses([])
          removeAllCourseOptions(multipleOptions)
        }}
        variant="primary"
        className="bg-lightish text-darkish gap-1.5"
      >
        <TrashIcon className="h-5 w-5" />
        <span>Limpar</span>
      </Button>
      <DialogClose asChild>
        <Button
          variant="primary"
          className="bg-primary hover:bg-primary/90 text-white gap-1.5"
          onClick={clearAllCourses}
        >
          <CheckCircleIcon className="h-5 w-5" />
          <p>Está feito</p>
        </Button>
      </DialogClose>
    </>
  )
}

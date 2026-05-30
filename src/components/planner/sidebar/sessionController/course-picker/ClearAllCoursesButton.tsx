import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useContext } from "react"
import CourseContext from "../../../../../contexts/CourseContext"
import MultipleOptionsContext from "../../../../../contexts/MultipleOptionsContext"
import { removeAllCourseOptions } from "../../../../../utils"
import { Button } from "../../../../ui/new/button"
import { Dialog } from "../../../../ui/new/dialog"

export const ClearAllCoursesButton = () => {
  const { setCheckboxedCourses } = useContext(CourseContext)
  const { multipleOptions, setMultipleOptions } = useContext(MultipleOptionsContext)

  const clearAllCourses = () => {
    setCheckboxedCourses([])
    const newOptions = removeAllCourseOptions(multipleOptions)
    setMultipleOptions([...newOptions])
  }

  return (
    <>
      <Button
        onClick={clearAllCourses}
        variant="primary"
        className="bg-lightish hover:bg-lightish/90 text-darkish gap-1.5"
      >
        <TrashIcon className="h-5 w-5" />
        <span>Limpar</span>
      </Button>
      <Dialog.Close asChild>
        <Button variant="primary" className="bg-primary hover:bg-primary/90 text-white gap-1.5">
          <CheckCircleIcon className="h-5 w-5" />
          <p>Está feito</p>
        </Button>
      </Dialog.Close>
    </>
  )
}

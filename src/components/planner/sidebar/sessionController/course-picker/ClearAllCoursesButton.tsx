import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useContext } from "react"
import CourseContext from "../../../../../contexts/CourseContext"
import MultipleOptionsContext from "../../../../../contexts/MultipleOptionsContext"
import { removeAllCourseOptions } from "../../../../../utils"
import { Button } from "../../../../ui/button"
import { DialogClose } from "../../../../ui/dialog"

export const ClearAllCoursesButton = () => {
  const { setCheckboxedCourses } = useContext(CourseContext);
  const { multipleOptions } = useContext(MultipleOptionsContext);

  return <>
    <Button
      onClick={() => {
        setCheckboxedCourses([])
        removeAllCourseOptions(multipleOptions)
      }}
      variant="icon"
      className="bg-lightish text-darkish gap-1.5"
    >
      <TrashIcon className="h-5 w-5" />
      <span>Limpar</span>
    </Button>
    <DialogClose asChild>
      <Button variant="icon" className="bg-primary gap-1.5">
        <CheckCircleIcon className="h-5 w-5" />
        <p>Está feito</p>
      </Button>
    </DialogClose>
  </>
}

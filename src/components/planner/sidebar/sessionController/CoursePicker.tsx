import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog'
import { Button } from '../../../ui/button'
import { Separator } from '../../../ui/separator'
import { MajorSearchCombobox } from './course-picker'
import { PencilSquareIcon } from '@heroicons//react/24/solid'
import { CheckedCourse } from '../../../../@types'
import { Course, Major } from '../../../../@types/new_index'
import { groupCoursesByYear } from '../../../../utils/utils'

type Props = {
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  extraCoursesActiveHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  extraCoursesModalOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  sourceBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  destBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  repeatedCourseControlHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const CoursePicker = ({
  // majors,
  // selectedMajorHook,
  openHook,
  coursesHook,
  extraCoursesActiveHook,
  extraCoursesModalOpenHook,
  sourceBufferHook,
  destBufferHook,
  repeatedCourseControlHook,
}: Props) => {
  // const [selectedMajor, setSelectedMajor] = selectedMajorHook

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="icon" className="flex-grow gap-2 bg-primary" title="Editar Unidades Curriculares">
          <span className="hidden md:block lg:hidden xl:block">Escolher UCs</span>
          <PencilSquareIcon className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seleciona as tuas Unidades Curriculares</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <div>
            <MajorSearchCombobox />
            <div className="w-96"> </div>
          </div>
          <Separator orientation="vertical" className="mx-5" />
          <div></div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CoursePicker

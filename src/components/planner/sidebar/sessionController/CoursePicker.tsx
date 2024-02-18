import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog'
import StorageAPI from '../../../../api/storage'
import CourseContext from '../../../../contexts/CourseContext'
import MajorContext from '../../../../contexts/MajorContext'
import { Button } from '../../../ui/button'
import { Separator } from '../../../ui/separator'
import { MajorSearchCombobox, CourseYearTabs, PickedCoursesList } from './course-picker'
import { PencilSquareIcon } from '@heroicons//react/24/solid'
import { CheckedCourse } from '../../../../@types'
import { Course, Major } from '../../../../@types/new_index'
import { useContext, useEffect } from 'react'

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
  openHook,
  coursesHook,
  extraCoursesActiveHook,
  extraCoursesModalOpenHook,
  sourceBufferHook,
  destBufferHook,
  repeatedCourseControlHook,
}: Props) => {
  // const [selectedMajor, setSelectedMajor] = selectedMajorHook
  const { pickedCourses } = useContext(CourseContext)
  const { selectedMajor } = useContext(MajorContext)

  useEffect(() => {
    StorageAPI.setPickedCoursesStorage(pickedCourses)
  }, [pickedCourses])

  useEffect(() => {
    StorageAPI.setSelectedMajorStorage(selectedMajor)
  }, [selectedMajor])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="icon" className="flex-grow gap-2 bg-primary" title="Editar Unidades Curriculares">
          <span className="hidden md:block lg:hidden xl:block">Escolher UCs</span>
          <PencilSquareIcon className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit min-w-fit">
        <DialogHeader>
          <DialogTitle>Seleciona as tuas Unidades Curriculares</DialogTitle>
          <DialogDescription className="mt-2">
            Escolhe um curso e unidades curriculares à esquerda. À direita aparecem as unidades curriculares que
            escolheste.
          </DialogDescription>
        </DialogHeader>
        <MajorSearchCombobox />
        <Separator />
        <div className="flex">
          <div className="flex w-fit flex-col gap-2">
            <CourseYearTabs />
          </div>
          <Separator orientation="vertical" className="mx-5" />
          <PickedCoursesList />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CoursePicker

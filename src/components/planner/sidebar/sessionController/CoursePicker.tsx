import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '../../../ui/dialog'
import StorageAPI from '../../../../api/storage'
import CourseContext from '../../../../contexts/CourseContext'
import MajorContext from '../../../../contexts/MajorContext'
import { Button } from '../../../ui/button'
import { Separator } from '../../../ui/separator'
import { MajorSearchCombobox, CourseYearTabs, PickedCoursesList, Ects } from './course-picker'
import { PencilSquareIcon } from '@heroicons//react/24/solid'
import { useContext, useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import api from '../../../../api/backend'

const CoursePicker = () => {
  const [open, setOpen] = useState(false)
  const { pickedCourses } = useContext(CourseContext)
  const { selectedMajor } = useContext(MajorContext)

  useEffect(() => {
    StorageAPI.setPickedCoursesStorage(pickedCourses)
  }, [pickedCourses])

  useEffect(() => {
    StorageAPI.setSelectedMajorStorage(selectedMajor)
  }, [selectedMajor])

  const handleOpenChange = () => {
    setOpen(!open)
    if (open === false) return
    const schedules = api._getCoursesSchedules(pickedCourses)
    console.log(schedules)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
        <div className="grid w-[55rem] grid-cols-[1fr_3rem_1fr]">
          <CourseYearTabs />
          <Separator orientation="vertical" className="mx-5" />
          <PickedCoursesList />
        </div>
        <DialogFooter className="grid grid-cols-2">
          <div />
          <div className="flex items-center justify-between pr-4">
            <Ects />
            <DialogClose asChild>
              <Button variant="icon" className="gap-2 bg-lightish text-darkish">
                <CheckIcon className="h-5 w-5" />
                <span>Pronto</span>
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CoursePicker

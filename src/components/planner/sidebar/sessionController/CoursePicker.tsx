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
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import MajorContext from '../../../../contexts/MajorContext'
import { Button } from '../../../ui/button'
import { Separator } from '../../../ui/separator'
import { MajorSearchCombobox, CourseYearTabs, PickedCoursesList, Ects } from './course-picker'
import { PencilSquareIcon, TrashIcon } from '@heroicons//react/24/solid'
import { useContext, useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import api from '../../../../api/backend'
import { Desert } from '../../../svgs'

const CoursePicker = () => {
  const [open, setOpen] = useState(false)
  const { pickedCourses, setPickedCourses, setChoosingNewCourse } = useContext(CourseContext)
  const { selectedMajor } = useContext(MajorContext)
  const showContent = selectedMajor || pickedCourses.length > 0

  useEffect(() => {
    StorageAPI.setPickedCoursesStorage(pickedCourses)
  }, [pickedCourses])

  useEffect(() => {
    StorageAPI.setSelectedMajorStorage(selectedMajor)
  }, [selectedMajor])

  const handleOpenChange = async () => {
    setChoosingNewCourse((prev) => !prev);
    setOpen(!open)
    if (open === false) return
    const newPickedCourses = [...pickedCourses];
    await api.getCoursesClasses(newPickedCourses); // (thePeras): not using the return value and modifying the parameter directly???
    setPickedCourses(newPickedCourses);
    StorageAPI.setPickedCoursesStorage(newPickedCourses)
  }

  return (
    <Dialog open={open} onOpenChange={async () => { await handleOpenChange() }}>
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
        {showContent ? (
          <>
            <div className="grid w-[55rem] grid-cols-[1fr_3rem_1fr]">
              <CourseYearTabs />
              <Separator orientation="vertical" className="mx-5" />
              <PickedCoursesList />
            </div>
            <DialogFooter className="grid grid-cols-2">
              <div />
              <div className="flex items-center justify-between pr-4 dark:text-white">
                <Ects />
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPickedCourses([])}
                    variant="icon"
                    className="gap-2 bg-lightish text-darkish"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Limpar</span>
                  </Button>
                  <DialogClose asChild>
                    <Button variant="icon" className="gap-2 bg-lightish text-darkish">
                      <CheckIcon className="h-5 w-5" />
                      <span>Pronto</span>
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="flex h-64 w-[55rem] flex-col items-center justify-center text-center text-sm dark:text-white">
            <Desert />
            <span>Seleciona um curso primeiro.</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CoursePicker

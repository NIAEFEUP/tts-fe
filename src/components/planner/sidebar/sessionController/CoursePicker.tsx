import { MajorSearchCombobox, CourseYearTabs, PickedCoursesList, Ects } from './course-picker'
import { PencilSquareIcon, TrashIcon } from '@heroicons//react/24/solid'
import { useContext, useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import StorageAPI from '../../../../api/storage'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { removeAllCourseOptions } from '../../../../utils'
import { Desert } from '../../../svgs'
import { Button } from '../../../ui/button'
import { DialogHeader, DialogFooter, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../../ui/dialog'
import BackendAPI from '../../../../api/backend'
import { Separator } from '../../../ui/separator'

//TODO: absolute imports with @

const CoursePicker = () => {
  const [open, setOpen] = useState(false)
  const { multipleOptions } = useContext(MultipleOptionsContext)
  const { pickedCourses, setPickedCourses, setChoosingNewCourse, setCoursesInfo } = useContext(CourseContext)

  const [selectedMajor, setSelectedMajor] = useState(StorageAPI.getSelectedMajorStorage());
  const showContent = selectedMajor || pickedCourses.length > 0

  useEffect(() => {
    if (!selectedMajor) return
    //TODO(thePeras): Takes time and a shimmer effect should be added
    BackendAPI.getCourses(selectedMajor).then((courses) => {
      setCoursesInfo(courses);
    })
    StorageAPI.setSelectedMajorStorage(selectedMajor);
  }, [selectedMajor, setCoursesInfo])

  useEffect(() => {
    StorageAPI.setPickedCoursesStorage(pickedCourses)
  }, [pickedCourses])

  const handleOpenChange = async () => {
    setChoosingNewCourse((prev) => !prev);
    setOpen(!open)
    if (open === false) return
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
        <MajorSearchCombobox selectedMajor={selectedMajor} setSelectedMajor={setSelectedMajor}/>
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
                    onClick={() => {
                      setPickedCourses([])
                      removeAllCourseOptions(multipleOptions)
                    }}
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

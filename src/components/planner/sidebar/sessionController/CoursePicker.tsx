import { MajorSearchCombobox, CourseYearTabs, PickedCoursesList, Ects } from './course-picker'
import { PencilSquareIcon, TrashIcon } from '@heroicons//react/24/solid'
import { useContext, useEffect, useState } from 'react'
import StorageAPI from '../../../../api/storage'
import CourseContext from '../../../../contexts/CourseContext'
import { Desert } from '../../../svgs'
import { Button } from '../../../ui/button'
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../../ui/dialog'
import BackendAPI from '../../../../api/backend'
import { Separator } from '../../../ui/separator'
import useCourseUnits from '../../../../hooks/useCourseUnits'
import { Major } from '../../../../@types'
import { Skeleton } from '../../../ui/skeleton'
import { ClearAllCoursesButton } from './course-picker/ClearAllCoursesButton'

//TODO: absolute imports with @

const CoursePicker = () => {
  const { pickedCourses, setPickedCourses, checkboxedCourses, setChoosingNewCourse, setCoursesInfo, ucsModalOpen, setUcsModalOpen } = useContext(CourseContext)

  const [selectedMajor, setSelectedMajor] = useState<Major>(StorageAPI.getSelectedMajorStorage());
  const { courseUnits, loading: loadingCourseUnits } = useCourseUnits(selectedMajor ? selectedMajor.id : null);
  const showContent = selectedMajor || pickedCourses.length > 0

  useEffect(() => {
    if (!courseUnits) return;
    setCoursesInfo(courseUnits);
  }, [courseUnits])

  useEffect(() => {
    BackendAPI.getCoursesClasses(checkboxedCourses).then((courseWithClasses) => {
      StorageAPI.setPickedCoursesStorage(courseWithClasses);
      setPickedCourses(courseWithClasses);
    })
  }, [checkboxedCourses])

  useEffect(() => {
    if (!selectedMajor) return
    StorageAPI.setSelectedMajorStorage(selectedMajor);
  }, [selectedMajor, setCoursesInfo])

  const handleOpenChange = () => {
    setChoosingNewCourse((prev) => !prev);
    if (ucsModalOpen === false) return
    setUcsModalOpen(false)
  }

  return (
    <Dialog open={ucsModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="icon" className="flex-grow gap-2 bg-primary" title="Editar Unidades Curriculares" onClick={() => setUcsModalOpen(true)}>
          <span className="hidden md:block lg:hidden xl:block">Unidades Curriculares</span>
          <PencilSquareIcon className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit min-w-fit">
        <DialogHeader>
          <DialogTitle>Seleciona as tuas unidades curriculares</DialogTitle>
          <DialogDescription className="mt-2">
            Pesquisa pelas tuas unidades curriculares. As disciplinas selecionadas aparecem no lado direito.
          </DialogDescription>
        </DialogHeader>
        <MajorSearchCombobox selectedMajor={selectedMajor} setSelectedMajor={setSelectedMajor} />
        <Separator />
        {showContent ? (
          <>
            <div className="grid w-[60rem] grid-cols-[1fr_2.5rem_1fr]">
              {!loadingCourseUnits
                ? <CourseYearTabs />
                : <div className="flex flex-col space-y-3">
                  <Skeleton className="h-8 rounded-xl" />
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
              }
              <Separator orientation="vertical" className="mx-5" />
              <PickedCoursesList />
            </div>
            <DialogFooter className="grid grid-cols-2">
              <div />
              <div className="flex items-center justify-between dark:text-white pr-4 pb-4">
                <Ects />
                <div className="flex gap-2">
                  <ClearAllCoursesButton />
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

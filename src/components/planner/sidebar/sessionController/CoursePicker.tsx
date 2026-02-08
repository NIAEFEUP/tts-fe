import { MajorSearchCombobox, CourseYearTabs, PickedCoursesList, Ects, Electives } from './course-picker'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { useContext, useEffect } from 'react'
import { Desert } from '../../../svgs'
import { Button } from '../../../ui/button'
import { 
  DialogHeader, 
  DialogFooter, 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogTitle, 
  DialogTrigger 
} from '../../../ui/dialog'
import { Separator } from '../../../ui/separator'
import useCourseUnits from '../../../../hooks/useCourseUnits'
import { Skeleton } from '../../../ui/skeleton'
import { ClearAllCoursesButton } from './course-picker/ClearAllCoursesButton'
import CoursePickerContext from '../../../../contexts/coursePicker/CoursePickerContext'
import BackendAPI from '../../../../api/backend'

//TODO: absolute imports with @


const CoursePicker = () => {
  const {
    coursesStorage,
    setCoursesInfo,
    setUcsModalOpen,
    setChoosingNewCourse,
    ucsModalOpen,
    selectedMajor,
    setSelectedMajor,
    setElectiveCourses
  } = useContext(CoursePickerContext)

  const { courseUnits, loading: loadingCourseUnits } = useCourseUnits(selectedMajor ? selectedMajor.id : null);
  const showContent = selectedMajor || coursesStorage.length > 0

  useEffect(() => {
    if (!courseUnits) return;
    setCoursesInfo(courseUnits);
  }, [courseUnits, setCoursesInfo])

  useEffect(() => {
    if (!selectedMajor) return;

    const fetchElectives = async () => {
      try {
        const groups = await BackendAPI.getCourseGroups(selectedMajor.id);
        if (!groups) return;

        const targetGroups = groups.filter((g: any) => {
             const name = g.name ? g.name.toLowerCase() : "";
             return name.includes("transversais");
        });
        
        const electivesPromises = targetGroups.map((g: any) => BackendAPI.getCourseGroupUnits(g.id));
        const electivesArrays = await Promise.all(electivesPromises);
        let allElectives = electivesArrays.flat();
        
        // remove duplicates by id
        allElectives = allElectives.filter((course, index, self) => 
            index === self.findIndex((c) => c.id === course.id)
        );

        setElectiveCourses(allElectives);
      } catch (error) {
        console.error("Failed to fetch electives", error);
      }
    };

    fetchElectives();
  }, [selectedMajor, setElectiveCourses]);

  const handleOpenChange = (open: boolean) => {
    setChoosingNewCourse((prev) => !prev);
    if (!open) {
      setUcsModalOpen(false)
    }
  }

  return (
    <Dialog open={ucsModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="icon" 
          className="flex-grow gap-2 bg-primary" 
          title="Editar Unidades Curriculares" 
          onClick={() => setUcsModalOpen(true)}
        >
          <span className="hidden md:block lg:hidden xl:block">Unidades Curriculares</span>
          <PencilSquareIcon className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="flex flex-col h-fit w-screen max-h-screen lg:min-w-fit overflow-scroll">
        <DialogHeader className="mx-4">
          <DialogTitle>Seleciona as tuas unidades curriculares</DialogTitle>
          <DialogDescription className="mt-2">
            Pesquisa pelas tuas unidades curriculares. As disciplinas selecionadas aparecem no lado direito.
          </DialogDescription>
        </DialogHeader>

        <MajorSearchCombobox selectedMajor={selectedMajor} setSelectedMajor={setSelectedMajor} />
        
        <Separator />

        {showContent ? (
          <>
            <div className="flex flex-col lg:flex-row flex-grow w-full lg:w-[60rem]">
              <div className="w-full lg:w-1/2">
                {!loadingCourseUnits ? (
                  <>
                    <CourseYearTabs />
                    <Electives />
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-8 rounded-xl" />
                    <div className="space-y-4">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row w-full lg:w-1/2 mt-4">
                <Separator orientation="vertical" className="mx-5 hidden lg:block" />
                <PickedCoursesList />
              </div>
            </div>

            <DialogFooter className="flex flex-row justify-center">
              <div className="flex flex-row items-center justify-between dark:text-white pr-4 pb-4">
                <Ects />
                <div className="flex gap-2 mt-4">
                  <ClearAllCoursesButton />
                </div>
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center flex-grow w-full lg:w-[60rem] py-10">
            <Desert className="h-64 w-full" />
            <p className="mt-4 text-muted-foreground">Seleciona um curso primeiro.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CoursePicker
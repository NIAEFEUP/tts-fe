import { useContext, useState } from 'react';
import CourseContext from '../../contexts/CourseContext';
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext';
import { Button } from '../ui/button';
import { importSchedule } from '../../utils/ImportSchedule';
import { CheckCircleIcon,  TrashIcon } from '@heroicons/react/24/outline';
import CoursePickerContext from '../../contexts/coursePicker/CoursePickerContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '../ui/dialog';

const PasteOptionModal = ({ pastedClasses } : { pastedClasses : string }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { setPickedCourses } = useContext(CourseContext);
  const { multipleOptions,setMultipleOptions } = useContext(MultipleOptionsContext);
  const { setSelectedMajor, setCheckboxedCourses } = useContext(CoursePickerContext);
  const [ selectedCopyOption,setSelectedCopyOption ] = useState(-1);

  const handleOpenChange = () => {
    if(isModalOpen === false) return
    setIsModalOpen(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark text-left align-middle shadow-xl transition-all">
        <DialogHeader>
          <DialogTitle>Escolha um horário para copiar e substituir:</DialogTitle>
          <DialogDescription>Esta ação vai substituir o horário selecionado.</DialogDescription>
          </DialogHeader>
            <div className="min-h-full items-center justify-center p-4 text-center">
              <div className="grid grid-cols-3 md:grid-cols-5 lg:flex lg:flex-row gap-2 transition-colors duration-300 dark:group-hover:text-white group-hover:text-slate-700" >
                {
                  [...multipleOptions].map((option,key) => {
                    return (
                      <Button
                        key={key}
                        variant='icon'
                        className={`flex-grow bg-lightish dark:bg-darkish 
                                  ${selectedCopyOption === option.id
                                    ? 'bg-primary/75 dark:bg-primary/50'
                                    : 'bg-lightish dark:bg-darkish'}`}
                        onClick={() => {
                          setSelectedCopyOption(option.id)
                        }}
                      >
                        <img src={option.icon} className="w-5 h-5 transform duration-200 ease-in-out group-hover:mt-3" alt={option.name} />
                      </Button> 
                    )
                  })
                }
              </div>
              <div className='justify-end flex flex-col lg:flex-row gap-2 mt-10'>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="icon"
                  className="bg-lightish text-darkish gap-1.5"
                >
                  <TrashIcon className="h-5 w-5" />
                  <span>Cancelar</span>
                </Button>
                <Button 
                  disabled={selectedCopyOption == -1}
                  variant="icon" className="bg-primary gap-1.5"
                  onClick={() => {
                    importSchedule(
                      pastedClasses,
                      multipleOptions,
                      setMultipleOptions,
                      selectedCopyOption,
                      setPickedCourses,
                      setSelectedMajor,
                      setCheckboxedCourses,
                    )
                    setIsModalOpen(false)
                  }}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <p>Está feito</p>
                </Button>
              </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default PasteOptionModal
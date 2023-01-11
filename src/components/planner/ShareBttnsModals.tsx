import { Dialog, Transition } from '@headlessui/react'
import { XIcon, CheckIcon, PencilAltIcon, PlusIcon} from '@heroicons/react/outline'
import { Fragment, useState } from 'react'
import { CourseOption, MultipleOptions, CheckedCourse, Major, CourseSchedule} from '../../@types'
import getMajors from '../../api/backend'

type Props = {
    majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
    schedule: CourseOption[]
    multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
    setIsImportedSchedule: React.Dispatch<React.SetStateAction<boolean>>
}

const ShareBttnsModals = () => {
    const [isConfModalOpen, setIsConfModalOpen] = useState(false)
    const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)

  
    function closeConfModal() {
        setIsConfModalOpen(false)
    }
    function openConfModal(){
        setIsConfModalOpen(true)
    }

    function closeDecisionModal(){
        setIsDecisionModalOpen(false)
    }
    function openDecisionModal(){
        setIsDecisionModalOpen(true)
    }

    const importSchedule = async (replaceExisting : boolean) => {
        var input = document.getElementById("schedule-input") as HTMLInputElement;
        let value : string = input.value;
        var tokens : string[] = value.split(";")
        var major_id = tokens[0];
        var courses_info : string[][] = [];

        tokens.splice(0, 1);
        for (let i = 0; i < tokens.length ; i++){
            courses_info.push(tokens[i].split("#"));
        }


        //get Major
        var imported_major : Major;
        var majors = await getMajors.getMajors();
        for (let i = 0; i < majors.length ; i++){
            if(majors[i]["id"] == major_id){
                imported_major = majors[i];
                break;
            }

        }

        //get courses
        var course_units = await getMajors.getCourses(imported_major);
        var imported_course_units : CourseOption[];
        if (replaceExisting){
            imported_course_units = [];
        }
        else{
            imported_course_units = multipleOptions.options[multipleOptions.index];
        }


        for (let i = 0; i < courses_info.length; i++){
            let course_option : CourseOption;
            var checked_course : CheckedCourse 
            for(let j = 0; j < course_units.length; j++){

                if(course_units[j]["course_unit_id"] == courses_info[i][0]){
                    checked_course = {
                        checked: true,
                        info: course_units[j],
                    };
                    break;
                }
            }

            let course_schedule = await getMajors.getCourseSchedule(checked_course);
            let option : CourseSchedule | null = null;
            if (courses_info[i][1] != "null"){
                for (let j = 0; j < course_schedule.length ; j++){
                    if (course_schedule[j].class_name == courses_info[i][1]){
                        option = course_schedule[j];
                        break;
                    }
                }
            }
    
            let shown_var = {
                T: true,
                TP: true
              };

              course_option = {
                shown: shown_var,
                course: checked_course,
                option: option,
                schedules: course_schedule,
            }
            imported_course_units.push(course_option);
        }


        let all_options = multipleOptions.options

        all_options[multipleOptions.index] = imported_course_units;

        if (imported_major.id != major.id){
            setMajor(imported_major);
        }
        
        setMultipleOptions((prev) => ({
            index: prev.index,
            selected: imported_course_units,
            options: all_options,
        }))
        

        input.value = "";
    }
    
  
    return (
    <>
        {/* ConfirmationModal */}
        <Transition appear show={isConfModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10 text-sm" onClose={closeConfModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-black bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                        className="w-full w-1/4 h-50 transform overflow-hidden rounded-2xl bg-white p-6
                        text-left align-middle text-gray-700 shadow-xl transition-all dark:bg-dark dark:text-white"
                        >
                        <div className="flex justify-end">  
                        <button
                            type="button"
                            onClick={closeConfModal}
                            className="float-right rounded text-rose-700 transition hover:bg-rose-700 hover:text-white"
                            >
                            <XIcon className="h-6 w-6" />
                            </button> 
                        </div>    
                        <div className="flex justify-end">  
                            <div className="mx-auto">              
                                <Dialog.Title as="h1" className="text-2xl rounded-ld font-semibold leading-6 mx-auto">
                                    IMPORTAR  
                                </Dialog.Title>
                            </div>  
                        </div>   
                        <div className="mt-3 flex flex-col text-center">
                            <p>O seguinte processo irá apagar todo seu progresso, deseja prosseguir?</p>
                        </div>

                        <div className="flex mt-8">
                            <button
                            type="button"
                            className="flex items-center space-x-2 mx-auto mr-3 rounded bg-rose-700 px-3 py-2 text-center text-sm font-medium text-white 
                            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={closeConfModal}
                            >
                            <span>NÃO</span>
                            <XIcon className="h-5 w-5" />
                            </button>
                            <button
                            type="button"
                            className="flex items-center space-x-2 mx-auto ml-3 rounded bg-tertiary px-3 py-2 text-center text-sm font-medium text-white 
                            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => closeConfModal}
                            >
                            <span>SIM</span>
                            <CheckIcon className="h-5 w-5" />
                            </button>
                        </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
        </Transition>

        {/* DecisionModal */}
        <Transition appear show={isDecisionModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10 text-sm" onClose={() => closeDecisionModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-black bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                        className="w-full max-w-xl h-50 transform overflow-hidden rounded-2xl bg-white p-6
                        text-left align-middle text-gray-700 shadow-xl transition-all dark:bg-dark dark:text-white"
                        >
                        <div className="flex justify-end">  
                        <button
                            type="button"
                            onClick={() => closeDecisionModal}
                            className="float-right rounded text-rose-700 transition hover:bg-rose-700 hover:text-white"
                            >
                            <XIcon className="h-6 w-6" />
                            </button> 
                        </div>    
                        <div className="flex justify-end">  
                            <div className="mx-auto">              
                                <Dialog.Title as="h1" className="text-2xl rounded-ld font-semibold leading-6 mx-auto">
                                    IMPORTAR  
                                </Dialog.Title>
                            </div>  
                        </div>   
                        <div className="mt-3 flex flex-col text-center">
                            <p>O seguinte processo irá adicionar horários de unidades curriculares diferentes das selecionadas por si. Deseja adicionar ou substituir?</p>
                        </div>

                        <div className="flex mt-8">
                        <button
                            type="button"
                            className="flex items-center space-x-2 mx-auto mr-3 rounded bg-primary px-3 py-2 text-center text-sm font-medium text-white 
                            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => closeDecisionModal}
                            >
                            <span>SUBSTITUIR</span>
                            <PencilAltIcon className="h-5 w-5" />
                        </button>
                            <button
                            type="button"
                            className="flex items-center space-x-2 mx-auto ml-3 rounded bg-tertiary px-3 py-2 text-center text-sm font-medium text-white 
                            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => closeDecisionModal}
                            >
                            <span>ADICIONAR</span>
                            <PlusIcon className="h-5 w-5" />
                            </button>
                            
                        </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>
            
    </>
    )

}

export default ShareBttnsModals
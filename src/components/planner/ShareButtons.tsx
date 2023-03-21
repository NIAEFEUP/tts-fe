import { CourseOption, MultipleOptions, CheckedCourse, Major, CourseSchedule, ImportedCourse} from '../../@types'
import React, {Fragment, useState } from 'react';
import { DocumentDuplicateIcon, UploadIcon, CheckIcon, XIcon, PencilAltIcon, PlusIcon} from '@heroicons/react/outline'
import getMajors from '../../api/backend'
import { Dialog, Transition } from '@headlessui/react'



type Props = {
    majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
    schedule: CourseOption[]
    multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
    setIsImportedSchedule: React.Dispatch<React.SetStateAction<boolean>>
}


/**
 * Component that contains the buttons to share and import schedules
 * @param majorHook major hook
 * @param schedule current schedule
 * @param multipleOptionsHook multiple options hook
 * @param setIsImportedSchedule function that sets if the schedule is imported
 * @returns ShareButtons component
 */
const ShareButtons = ({majorHook, schedule, multipleOptionsHook, setIsImportedSchedule }: Props) => {
    const [major, setMajor] = majorHook
    const [multipleOptions, setMultipleOptions] = multipleOptionsHook
    const [isConfModalOpen, setIsConfModalOpen] = useState(false)
    const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)

  
    function closeConfModal() {
        setIsConfModalOpen(false)
    }

    function closeDecisionModal(){
        setIsDecisionModalOpen(false)
    }

    const [icon, setIcon] = useState(false);
    const [showDiv, setShowDiv] = useState(false);

    /**
     * Function that converts schedule to string
     * @param major selected major
     * @param schedule current schedule
     * @returns stringified schedule
     */
    const scheduleToString = (major : Major, schedule : CourseOption[]) => {
        let copySchedule : string = (major.id).toString();
        let extraUCsStrs : { [id: string] : string ; } = {};
        for (let i = 0; i < schedule.length ; i++){
            let uc_course_id = schedule[i].course.info.course_id;
            let uc_course_unit_id = schedule[i].course.info.course_unit_id;
            if (uc_course_id === major.id){
                copySchedule += ";" + uc_course_unit_id + "#";
                if (schedule[i].option == null){
                    copySchedule += "null";
                }
                else{
                    copySchedule += schedule[i].option.class_name;

                }
            }
            else{
                if (extraUCsStrs[uc_course_id] == null){
                    extraUCsStrs[uc_course_id] = uc_course_id + "";
                }
                
                extraUCsStrs[uc_course_id] += ";" + uc_course_unit_id + "#";
                if (schedule[i].option == null){
                    extraUCsStrs[uc_course_id] += "null";
                }
                else{
                    extraUCsStrs[uc_course_id] += schedule[i].option.class_name;
                }
                
            }
        }

        for (let key in extraUCsStrs){
            copySchedule += "-" + extraUCsStrs[key];
        }
        return copySchedule;
    }
    
    /**
     * Function that copies schedule to clipboard
    */
    const copySchedule = () => {
        const scheduleToCopy = {
            "major": major,
            "selected": schedule
        }

        navigator.clipboard.writeText(scheduleToString(scheduleToCopy.major, scheduleToCopy.selected));
        setIcon(true);
        setShowDiv(true);
        setTimeout(() => {
            setIcon(false)
            setShowDiv(false)
        }, 2000)
    }

    const importAllSchedules = async (replaceExisting : boolean) => {
        setIsImportedSchedule(true)
        var input = document.getElementById("schedule-input") as HTMLInputElement;
        let majorTokens : string[] = input.value.split("-")
        

        let imported_course_units : CourseOption[] = []

        for (let i = 0; i < majorTokens.length; i++){
            try{
                imported_course_units.unshift(...(await importSingleSchedule(majorTokens[i])))
            }catch(e: any){
                console.log(e);
                setIsImportedSchedule(false)
                return;
            }
        }

        let all_options = multipleOptions.options

        let placeholder_course_options: CourseOption[] = []

        for (let i = 0; i < imported_course_units.length ; i++){
            placeholder_course_options.push({
                    shown: imported_course_units[i].shown,
                    course: imported_course_units[i].course,
                    option: null,
                    schedules: imported_course_units[i].schedules,
                    teachers: [],
                    filteredTeachers: [],
                })
            
        }

        all_options[multipleOptions.index] = imported_course_units;

        //purge all non imported courses
        if(replaceExisting){
            for (let i = 0; i < all_options.length ; i++){
                if (i !== multipleOptions.index){
                    let new_option = [];
                    for(let y = 0; y < all_options[i].length; y++){
                        for(let x = 0; x < placeholder_course_options.length; x++){
                            if (placeholder_course_options[x].course.info.course_unit_id === all_options[i][y].course.info.course_unit_id){
                                new_option.push(all_options[i][y]);
                                break;
                            }
                        }
                    }
                    all_options[i] = new_option;
                    
                }
            }
        }

        //add missing imported courses
        for (let i = 0; i < all_options.length ; i++){
            if (i !== multipleOptions.index){
                for(let x = 0; x < placeholder_course_options.length; x++){
                    let found = false;
                    for(let y = 0; y < all_options[i].length; y++){
                        if (placeholder_course_options[x].course.info.course_unit_id === all_options[i][y].course.info.course_unit_id){
                            found = true;
                            break;
                        }
                    }
                    if (!found){
                        all_options[i].push(placeholder_course_options[x]);
                    }
                }
                
            }
        }

        
        let imported_major : Major;
        let major_id = Number(majorTokens[0].split(";")[0]);

        let majors = await getMajors.getMajors();

        for (let i = 0; i < majors.length ; i++){
            if(majors[i]["id"] === major_id){
                imported_major = majors[i];
                break;
            }

        }


        if (imported_major.id !== major.id){
            setMajor(imported_major);

        }

        
        setMultipleOptions((prev) => ({
            index: prev.index,
            selected: imported_course_units,
            options: all_options,
            names: prev.names
        }))
        

        input.value = "";        
        

        return 1;


    }

    const importSingleSchedule = async (scheduleString : string) => {
        var tokens : string[] = scheduleString.split(";")
        var major_id = Number(tokens[0]);
        var courses_info : ImportedCourse[] = [];

        tokens.splice(0, 1);
        for (let i = 0; i < tokens.length ; i++){
            let split_tokens = tokens[i].split("#");
            let imported_course : ImportedCourse = {
                course_unit_id: Number(split_tokens[0]),
                class_name: split_tokens[1]
            }
            courses_info.push(imported_course);
        }


        //get Major
        var imported_major : Major;
        
        var majors = await getMajors.getMajors();
        

        for (let i = 0; i < majors.length ; i++){
            if(majors[i]["id"] === major_id){
                imported_major = majors[i];
                break;
            }

        }

        //get courses
        try{
            var course_units = await getMajors.getCourses(imported_major);
        }catch(e: any){
            console.log(e);
            setIsImportedSchedule(false);
            return;
        }

        var imported_course_units : CourseOption[] = [];
        


        for (let i = 0; i < courses_info.length; i++){
            let course_option : CourseOption;
            var checked_course : CheckedCourse 
            for(let j = 0; j < course_units.length; j++){

                if(course_units[j]["course_unit_id"] === courses_info[i].course_unit_id){
                    checked_course = {
                        checked: true,
                        info: course_units[j],
                    };
                    break;
                }
            }

            let course_schedule : CourseSchedule[];
            try{
                course_schedule = await getMajors.getCourseSchedule(checked_course);
            }catch(e: any){
                console.log(e);
                setIsImportedSchedule(false);
                return;
            }
            let option : CourseSchedule | null = null;
            if (courses_info[i].class_name !== "null"){
                for (let j = 0; j < course_schedule.length ; j++){
                    if (course_schedule[j].lesson_type !== "T" && course_schedule[j].class_name === courses_info[i].class_name){
                        option = course_schedule[j];
                        break;
                    }
                }
            }

            let course_already_exists = false;
            for(let j = 0; j < imported_course_units.length; j++){
                if(imported_course_units[j].course.info.course_unit_id === checked_course.info.course_unit_id){
                    imported_course_units[j].option = option;
                    course_already_exists = true;
                    break;
                }
            }
            if (course_already_exists)
                continue;
    
            let shown_var = {
                T: true,
                TP: true
              };

            course_option = {
                shown: shown_var,
                course: checked_course,
                option: option,
                schedules: course_schedule,
                teachers: [],
                filteredTeachers: [],
            }
            



            imported_course_units.push(course_option);
        }

        return imported_course_units;


    }

    const checkIfSameCoursesImport = (import_tokens : string[]) => {
        let current_schedule = multipleOptions.options[multipleOptions.index];
        if (import_tokens.length !== (current_schedule.length + 1)){
            return false;
        }

        for (let i = 1; i < import_tokens.length; i++){
            let found = false;
            let import_course = import_tokens[i].split("#");
            for (let j = 0; j < current_schedule.length; j++){
                if (Number(import_course[0]) === current_schedule[j].course.info.course_unit_id){
                    found = true;
                    break;
                }
            }
            if (!found){
                return false;
            }
        }
        return true;
    }


    const openDecisionModal = async () => {
        var input = document.getElementById("schedule-input") as HTMLInputElement;
        let value : string = input.value;
        if (value === ""){
            return;
        }
        var tokens : string[] = value.split(";")

        //if the import has the same courses as the current schedule, no need to show any modal, just replace the current schedule
        if (checkIfSameCoursesImport(tokens)){
            importAllSchedules(false)
            return;
        }

        var major_id = tokens[0];

        if (Number(major_id) === major.id){
            setIsDecisionModalOpen(true)
        }else{
            setIsConfModalOpen(true)
        }
    }

    return (
    <>  
    { showDiv ? <div className="absolute m-auto left-0 right-0 bottom-5 w-1/5 flex place-items-center p-3 w-full text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-700" role="alert">
                    <div className="inline-flex justify-center items-center w-6 h-6 text-white bg-secondary rounded-lg dark:bg-secondary dark:text-white">
                    <CheckIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-5 text-sm font-normal">Horário Copiado Com Sucesso</div>
                        <button 
                            onClick={() => setShowDiv(false)}
                            className="ml-auto -mx-1.5 -my-1.5 bg-white  items-center text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 
                                                hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 
                                                dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                            <span className="sr-only">Close</span>
                            <XIcon className="h-6 w-6" />
                        </button>
                </div> : null }
  
    <div className='grid grid-flow-row grid-rows-1 grid-cols-7 gap-2 w-full mt-1'>
        <div className="relative col-span-6">
            <div className="absolute inset-y-0 left-0 col-span-6">
            
            </div>
            <input placeholder='Insere o link do horário...' id="schedule-input" className="inline-flex w-full items-center justify-center whitespace-nowrap rounded bg-tertiary p-2 
                        text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50" required>
            </input>
            <button 
                        onClick={() => openDecisionModal()}

                        id='ImportButton'
                        title="Importar o link inserido"
                        className="absolute right-0.5 bottom-0.5 items-center justify-center  whitespace-nowrap rounded bg-tertiary p-2 
                        text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        <UploadIcon className="h-4 w-4" />

            </button>
            
        </div>
                <div className='col-span-1'>
                    <button
                        onClick={() => copySchedule()}
                        title="Copiar o link do horário"
                        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded bg-tertiary p-2 
                        text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        {icon? <CheckIcon className='w-6 h-5'/> : <DocumentDuplicateIcon className='w-6 h-5' />}
                    </button>

                </div>

        </div>

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
                            onClick={() => {closeConfModal(); importAllSchedules(true)}}
                            // onClick={closeConfModal}

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
                <Dialog as="div" className="relative z-10 text-sm" onClose={closeDecisionModal}>
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
                            onClick={closeDecisionModal}
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
                            onClick={() => {closeDecisionModal(); importAllSchedules(true);}}
                            >
                            <span>SUBSTITUIR</span>
                            <PencilAltIcon className="h-5 w-5" />
                        </button>
                            <button
                            type="button"
                            className="flex items-center space-x-2 mx-auto ml-3 rounded bg-tertiary px-3 py-2 text-center text-sm font-medium text-white 
                            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => {closeDecisionModal(); importAllSchedules(false);}}
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
export default ShareButtons
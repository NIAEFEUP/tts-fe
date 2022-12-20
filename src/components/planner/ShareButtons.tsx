import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { DocumentDuplicateIcon, UploadIcon, CheckIcon, XIcon} from '@heroicons/react/outline'
import { CourseOption, MultipleOptions, CheckedCourse, Major } from '../../@types'
import getMajors from '../../api/backend'

type Props = {
    majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
    coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
    schedule: CourseOption[]
    multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const ShareButtons = ({majorHook, coursesHook, schedule, multipleOptionsHook }: Props) => {
    const buttonRef = useRef(null)
    const [major, setMajor] = majorHook
    const [checkedCourses, setCheckedCourses] = coursesHook
    const [multipleOptions, setMultipleOptions] = multipleOptionsHook

    const [icon, setIcon] = useState(false);
    const [showDiv, setShowDiv] = useState(false);

    /**
     * Function that converts schedule to string
     * @param major selected major
     * @param schedule current schedule
     * @returns stringified schedule
     */
    const scheduleToString = (major : Major, schedule : CourseOption[]) => {
        //TODO
        var copySchedule : string = (major.id).toString();
        console.log(schedule)
        for (let i = 0; i < schedule.length ; i++){
            copySchedule += ";" + schedule[i].course.info.course_unit_id + "#";
            if (schedule[i].option == null){
                copySchedule += "null";
            }
            else{
                copySchedule += schedule[i].option.class_name;

            }
        }
        return copySchedule;
    }
    
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

    const importSchedule = async () => {
        var input = document.getElementById("schedule-input") as HTMLInputElement;
        let value : string = input.value;
        //120;477603#null;477604#null;477606#null;477605#null;477607#null;477602#null
        var tokens : string[] = value.split(";")
        var major_id = tokens[0];
        var courses_info : string[][] = [];

        tokens.splice(0, 1);
        for (let i = 0; i < tokens.length ; i++){
            console.log(tokens[i])
            courses_info.push(tokens[i].split("#"));
        }

        var major : Major;
        var majors = await getMajors.getMajors();
        for (let i = 0; i < majors.length ; i++){
            if(majors[i]["id"] == major_id){
                major = majors[i];
                break;
            }

        }

        var course_units = await getMajors.getCourses(major);
        var imported_course_units : CourseOption[] = [];
        for (let i = 0; i < courses_info.length; i++){
            let course_option : CourseOption;
            var checked_course : CheckedCourse 
            for(let j = 0; j < course_units.length; j++){

                if(course_units[j]["course_unit_id"] == courses_info[i][0]){
                    console.log("Found pair for: ", i)
                    checked_course = {
                        checked: true,
                        info: course_units[j],
                    };
                    break;
                }
            }
            
            //for loop to check schedule and option
            let shown_var = {
                T: true,
                TP: true
              };

            course_option = {
                shown: shown_var,
                course: checked_course,
                option: null,
                schedules: [],
            }
            imported_course_units.push(course_option);
        }

        console.log("imported courses: ", imported_course_units);

        let all_options = multipleOptions.options

        all_options[multipleOptions.index] = imported_course_units;


        setMultipleOptions((prev) => ({
            index: prev.index,
            selected: imported_course_units,
            options: all_options,
        }))

            
        setMajor(major)
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
                        onClick={() => importSchedule()}

                        id='ImportButton'
                        title="Importar o link inserido"
                        className="absolute right-0.5 bottom-0.5 items-center justify-center  whitespace-nowrap rounded bg-tertiary p-2 
                        text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        <text></text><UploadIcon className="h-4 w-4" />

            </button>
            
        </div>
                <div className='col-span-1'>
                    <button
                        onClick={() => copySchedule()}
                        title="Copiar o link do horário"
                        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded bg-tertiary p-2 
                        text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                        <text></text>{icon? <CheckIcon className='w-6 h-5'/> : <DocumentDuplicateIcon className='w-6 h-5' />}
                    </button>

                </div>

        </div>
    </>
        )
    }
export default ShareButtons
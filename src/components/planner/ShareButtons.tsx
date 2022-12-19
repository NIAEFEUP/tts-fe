import { DocumentDuplicateIcon, UploadIcon } from '@heroicons/react/outline'
import { CourseOption, MultipleOptions, CheckedCourse, Major, CourseSchedule } from '../../@types'
import getMajors from '../../api/backend'

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


    /**
     * Function that converts schedule to string
     * @param major selected major
     * @param schedule current schedule
     * @returns stringified schedule
     */
    const scheduleToString = (major : Major, schedule : CourseOption[]) => {
        var copySchedule : string = (major.id).toString();
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
    
    /**
     * Function that copies schedule to clipboard
    */
    const copySchedule = () => {
        const scheduleToCopy = {
            "major": major,
            "selected": schedule
        }

        navigator.clipboard.writeText(scheduleToString(scheduleToCopy.major, scheduleToCopy.selected));
    }

    /**
     * Function that imports schedule from clipboard
     */
    const importSchedule = async () => {
        setIsImportedSchedule(true);
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
            if(majors[i]["id"] === major_id){
                imported_major = majors[i];
                break;
            }

        }

        //get courses
        var course_units = await getMajors.getCourses(imported_major);
        var imported_course_units : CourseOption[] = [];
        for (let i = 0; i < courses_info.length; i++){
            let course_option : CourseOption;
            var checked_course : CheckedCourse 
            for(let j = 0; j < course_units.length; j++){

                if(course_units[j]["course_unit_id"] === courses_info[i][0]){
                    checked_course = {
                        checked: true,
                        info: course_units[j],
                    };
                    break;
                }
            }

            let course_schedule = await getMajors.getCourseSchedule(checked_course);
            let option : CourseSchedule | null = null;
            if (courses_info[i][1] !== "null"){
                for (let j = 0; j < course_schedule.length ; j++){
                    if (course_schedule[j].class_name === courses_info[i][1]){
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

        if (imported_major.id !== major.id){
            setMajor(imported_major);
        }
        
        setMultipleOptions((prev) => ({
            index: prev.index,
            selected: imported_course_units,
            options: all_options,
        }))
    }

    return (
    <>  <div className='grid grid-rows-3 grid-flow-col gap-2 w-full mt-1'>
           
            <div className='col-span-2 flex w-full flex-col items-center justify-center gap-2 2xl:flex-row'>
                <button 
                    onClick={() => importSchedule()}

                    id='ImportButton'
                    title="Importar o link inserido"
                    className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
                    text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    <span className="flex">Importar</span><UploadIcon className="h-5 w-5" />

                </button>
                
                <button
                    onClick={() => copySchedule()}
                    title="Copiar o link do horário"
                    className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
                    text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    <span className="flex">Copiar</span><DocumentDuplicateIcon className="h-5 w-5" />

                </button>
            </div>
            <input placeholder='Insere o link do horário...' id='schedule-input' className='col-span-2 inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
                text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'></input>
        </div>
    </>
    )
}

export default ShareButtons
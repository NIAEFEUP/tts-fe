import { useRef } from 'react'
import { DocumentDuplicateIcon, UploadIcon } from '@heroicons/react/outline'
import { CourseOption, MultipleOptions, CheckedCourse, Major, CourseSchedule } from '../../@types'
import getMajors from '../../api/backend'

type Props = {
    majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
    coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
    schedule: CourseOption[]
    multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
    isImportedScheduleHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}



const ShareButtons = ({majorHook, coursesHook, schedule, multipleOptionsHook, isImportedScheduleHook }: Props) => {
    const buttonRef = useRef(null)
    const [major, setMajor] = majorHook
    const [checkedCourses, setCheckedCourses] = coursesHook
    const [multipleOptions, setMultipleOptions] = multipleOptionsHook
    const [isImportedSchedule, setIsImportedSchedule] = isImportedScheduleHook
    var firstRun : boolean = true;

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
    }

    const importSchedule = async () => {
        setIsImportedSchedule(true)
        console.log("HERE")
        let input = document.getElementById("schedule-input") as HTMLInputElement;
        let value : string = input.value;
        let tokens : string[] = value.split(";")
        let major_id = tokens[0];
        let courses_info : string[][] = [];

        tokens.splice(0, 1);
        for (let i = 0; i < tokens.length ; i++){
            console.log(tokens[i])
            courses_info.push(tokens[i].split("#"));
        }


        //get Major
        let imported_major : Major;
        let majors = await getMajors.getMajors();
        for (let i = 0; i < majors.length ; i++){
            if(majors[i]["id"] == major_id){
                imported_major = majors[i];
                break;
            }

        }

        //get courses
        let course_units = await getMajors.getCourses(major);
        let imported_course_units = [] as CourseOption[];
        console.log("import_course_units 1:", [...imported_course_units])
        console.log("Length:", courses_info.length)
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

            console.log("import_course_units before getMajors:", [...imported_course_units])

            let course_schedule = await getMajors.getCourseSchedule(checked_course);

            let schedule_option : CourseSchedule | null = null;

            console.log("import_course_units 2:", [...imported_course_units])

            if (courses_info[i][1] != "null"){
                for (let j = 0; j < course_schedule.length ; j++){
                    if (course_schedule[j].class_name == courses_info[i][1] && course_schedule[j].lesson_type == "TP"){
                        schedule_option = course_schedule[j];
                        console.log("option:", schedule_option)

                        break;
                    }
                }
            }

            
            let shown_var = {
                T: true,
                TP: true
              };

            console.log("out of loop", schedule_option)

            course_option = {
                shown: shown_var,
                course: checked_course,
                option: schedule_option,
                schedules: course_schedule,
            }
            console.log("import_course_units 3:", [...imported_course_units])

            console.log("first: ", JSON.parse(JSON.stringify(course_option)))
            course_option["option"] = schedule_option
            console.log("second:", JSON.parse(JSON.stringify(course_option)))
            console.log("imported_couse_units while building before push: ", [...imported_course_units])
            imported_course_units.push({
                shown: shown_var,
                course: checked_course,
                option: schedule_option,
                schedules: course_schedule,
            });
            console.log("imported_couse_units while building: ", [...imported_course_units])
        }

        console.log("imported courses: ", [...imported_course_units]);

        let all_options = multipleOptions.options

        all_options[multipleOptions.index] = imported_course_units;
        
        if (major.id != imported_major.id){
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
                    <text>Importar</text><UploadIcon className="h-5 w-5" />

                </button>
                
                <button
                    onClick={() => copySchedule()}
                    title="Copiar o link do horário"
                    className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
                    text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    <text>Copiar</text><DocumentDuplicateIcon className="h-5 w-5" />

                </button>
            </div>
            <input placeholder='Insere o link do horário...' id='schedule-input' className='col-span-2 inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
                text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'></input>
        </div>
    </>
    )
}

export default ShareButtons
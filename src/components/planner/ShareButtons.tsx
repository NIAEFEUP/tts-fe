import { useRef } from 'react'
import { DocumentDuplicateIcon, UploadIcon } from '@heroicons/react/outline'
import { CourseOption, MultipleOptions, CheckedCourse, Major } from '../../@types'

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

    const importSchedule = () => {
        //TODO
        var input = document.getElementById("schedule-input") as HTMLInputElement;
        console.log(input.value)
    }

    return (
    <>  <div className='grid grid-rows-3 grid-flow-col gap-2 w-full'>
            <input placeholder='Insere o link do horário...' id='schedule-input' className='col-span-2 inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
                text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'></input>
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
        </div>
    </>
    )
}

export default ShareButtons
import { useRef } from 'react'
import {DocumentDuplicateIcon, UploadIcon } from '@heroicons/react/outline'
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

    const scheduleToString = (major : Major, schedule : CourseOption[]) => {
        return major.name + ";" + schedule.length
    }
    
    const copySchedule = () => {
        const scheduleToCopy = {
            "major": major,
            "selected": schedule
        }

        navigator.clipboard.writeText(scheduleToString(scheduleToCopy.major, scheduleToCopy.selected));
    }

    return (
    <>  
        <input id='schedule-input' className='inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
            text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'></input>

        <button title="Importar"
            className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
            text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
            <UploadIcon className="h-5 w-5" />

        </button>
        
        <button
            onClick={() => copySchedule()}
            title="CopiarHorario"
            className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
            text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
            <DocumentDuplicateIcon className="h-5 w-5" />
        </button>
    </>
    )
}

export default ShareButtons
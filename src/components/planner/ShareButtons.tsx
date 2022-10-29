import {DocumentDuplicateIcon, UploadIcon, DotsHorizontalIcon, SupportIcon, XIcon } from '@heroicons/react/outline'
import { CourseOption, MultipleOptions, CheckedCourse, Major, ExportJSON } from '../../@types'

type Props = {
    majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
    coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
    schedule: CourseOption[]
    multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const ShareButtons = () => {
    return (
    <>
        <input id='schedule-input' className='inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
            text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'></input>
            <button title="Importar"
                className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
                text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                <UploadIcon className="h-5 w-5" />

            </button>
            
            <button
                //onClick={/**import schedule */}
                title="Importar"
                className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-tertiary p-2 
                text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                <DocumentDuplicateIcon className="h-5 w-5" />
            </button>
        
    </>
    )
}

export default ShareButtons
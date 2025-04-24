import { Context, Dispatch, createContext, SetStateAction } from 'react';
import { CourseOption } from '../../@types';

interface ClassSelectorContextContent {
    selectedClassId: number | null;
    setSelectedClassId: Dispatch<SetStateAction<number | null>>;
    display: number | null;
    setDisplay: Dispatch<SetStateAction<number | null>>;
    preview: number | null;
    setPreview: Dispatch<SetStateAction<number | null>>;
    removePreview: () => void;
    locked: boolean;
    setLocked: Dispatch<SetStateAction<boolean>>;
    toggleLocker: () => void;
    courseOption: CourseOption;
}

const ClassSelectorContext: Context<ClassSelectorContextContent> = createContext({
    selectedClassId: null,
    setSelectedClassId: () => {},
    display: null,  
    setDisplay: () => {},
    preview: null,
    setPreview: () => {},
    removePreview: () => {},
    locked: false,
    setLocked: () => {},
    toggleLocker: () => {},
    courseOption: null
});

export default ClassSelectorContext;
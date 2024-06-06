import { ImportedCourses } from "../../../../@types";
import { MultipleOptions } from "../../../../@types/new_index";

const fillOptions = (importedCourses: ImportedCourses, selectedOption: number, multipleOptions: MultipleOptions, setMultipleOptions: React.Dispatch<React.SetStateAction<MultipleOptions>>) => {

    const newMultipleOptions = [...multipleOptions];

    // This handles
    newMultipleOptions[selectedOption].course_options = newMultipleOptions[selectedOption].course_options.map((option) => {
        const optionIntValue = parseInt(importedCourses[option.course_id]);
        const newValue = isNaN(optionIntValue) ? null : optionIntValue;

        return { ...option, picked_class_id: newValue };
    });

    setMultipleOptions(newMultipleOptions)
}

export default fillOptions;
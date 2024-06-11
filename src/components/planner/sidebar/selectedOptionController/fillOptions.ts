import { ImportedCourses } from "../../../../@types";
import { MultipleOptions } from "../../../../@types/new_index";

const fillOptions = (importedCourses: ImportedCourses, selectedOption: number, multipleOptions: MultipleOptions, setMultipleOptions: React.Dispatch<React.SetStateAction<MultipleOptions>>) => {
    const newMultipleOptions = [...multipleOptions];

    console.log("Imported courses are: ", importedCourses);

    // This handles
    newMultipleOptions[selectedOption].course_options = newMultipleOptions[selectedOption].course_options.map((option) => {
        const importedOption = importedCourses[option.course_id];
        if(importedOption !== undefined) {
            const optionIntValue = parseInt(importedOption);
            const newValue = isNaN(optionIntValue) ? null : optionIntValue;

            return { ...option, picked_class_id: newValue };
        } else {
            return { ...option }
        }
    });

    setMultipleOptions(newMultipleOptions)
}

export default fillOptions;